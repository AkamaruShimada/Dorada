// backend/src/services/remboursement.service.ts

import { Prisma } from '@prisma/client';
import prisma from '../prisma/client';
import type Stripe from 'stripe';
import { stripe } from '../config/stripe';
import type { CreateRemboursementInput } from '../schemas/remboursement.schema';

const Decimal = Prisma.Decimal;

export class RemboursementError extends Error {}

export const demanderRemboursement = async (
  commandeId: number,
  data: CreateRemboursementInput,
  utilisateurId: number,
) => {
  // Récupérer le nom depuis la BDD
  // (adaptez le nom du modèle et du champ : utilisateur / user, nom / name...)
  const utilisateur = await prisma.utilisateur.findUniqueOrThrow({
    where: { id: utilisateurId },
    select: { id: true, nom: true },
  });
  
  // 1. Réserver le remboursement en base dans une transaction
  //    (empêche le double remboursement en cas de double-clic)
  const remboursement = await prisma.$transaction(
    async (tx) => {
      const commande = await tx.commande.findUnique({
        where: { id: commandeId },
        include: { remboursements: true },
      });

      if (!commande) throw new RemboursementError('Commande introuvable');
      if (!commande.stripePaymentIntentId || !commande.payeeLe) {
        throw new RemboursementError('Cette commande n’a pas été payée');
      }

      const dejaReserve = commande.remboursements
        .filter((r) => r.statut !== 'ECHOUE')
        .reduce((somme, r) => somme.plus(r.montant), new Decimal(0));

      const resteRemboursable = commande.totalTtc.minus(dejaReserve);
      const montant = data.montant
        ? new Decimal(data.montant)
        : resteRemboursable; // pas de montant = remboursement du solde

      if (montant.lte(0)) {
        throw new RemboursementError('Montant invalide ou commande déjà intégralement remboursée');
      }
      if (montant.gt(resteRemboursable)) {
        throw new RemboursementError(
          `Montant trop élevé : maximum remboursable ${resteRemboursable.toFixed(2)} €`,
        );
      }

      return tx.remboursement.create({
        data: {
          commandeId,
          montant,
          motif: data.motif,
          commentaire: data.commentaire,
          demandeParId: utilisateur.id,
          demandeParNom: utilisateur.nom,
        },
      });
    },
    { isolationLevel: Prisma.TransactionIsolationLevel.Serializable },
  );

  // 2. Appeler Stripe HORS de la transaction (appel réseau externe)
  try {
    const commande = await prisma.commande.findUniqueOrThrow({ where: { id: commandeId } });

    const refund = await stripe.refunds.create(
      {
        payment_intent: commande.stripePaymentIntentId!,
        amount: remboursement.montant.times(100).toDecimalPlaces(0).toNumber(), // en centimes
        reason: 'requested_by_customer',
        metadata: {
          remboursementId: String(remboursement.id),
          commandeReference: commande.reference,
        },
      },
      { idempotencyKey: remboursement.idempotencyKey }, // protège contre un retry réseau
    );

    const maj = await prisma.remboursement.update({
      where: { id: remboursement.id },
      data: { stripeRefundId: refund.id },
    });

    if (refund.status === 'succeeded') {
      await traiterRemboursement(`direct-${refund.id}`, refund);
    }
    return maj;
  } catch (err) {
    const refusExplicite =
      err instanceof stripe.errors.StripeError &&
      err.type !== 'StripeConnectionError' &&
      err.type !== 'StripeAPIError';

    if (refusExplicite) {
      await prisma.remboursement.update({
        where: { id: remboursement.id },
        data: { statut: 'ECHOUE', traiteLe: new Date() },
      });
    }
    throw new RemboursementError(
      err instanceof Error ? `Stripe : ${err.message}` : 'Erreur lors du remboursement Stripe',
    );
  }
};

export const traiterRemboursement = async (eventId: string, refund: Stripe.Refund) => {
  console.log('refund', refund.id, refund.status)
  await prisma.$transaction(async (tx) => {
    const dejaTraite = await tx.stripeEvenement.findUnique({ where: { id: eventId } });
    if (dejaTraite) return;

    const idLocal = refund.metadata?.remboursementId
      ? Number(refund.metadata.remboursementId)
      : null;

    const remboursement = await tx.remboursement.findFirst({
      where: idLocal
        ? { OR: [{ stripeRefundId: refund.id }, { id: idLocal }] }
        : { stripeRefundId: refund.id },
    });

    if (!remboursement) {
      console.warn('Remboursement local introuvable pour', refund.id);
      return; // remboursement fait hors de l'app (dashboard Stripe)
    }

    if (refund.status === 'succeeded') {
      await tx.remboursement.update({
        where: { id: remboursement.id },
        data: { statut: 'REUSSI', traiteLe: new Date() },
      });

      // La commande passe REMBOURSEE seulement si tout est remboursé
      const commande = await tx.commande.findUniqueOrThrow({
        where: { id: remboursement.commandeId },
        include: { remboursements: true },
      });
      const totalRembourse = commande.remboursements
        .filter((r) => r.statut === 'REUSSI' || r.id === remboursement.id)
        .reduce((s, r) => s.plus(r.montant), new Prisma.Decimal(0));

      if (totalRembourse.gte(commande.totalTtc)) {
        await tx.commande.update({
          where: { id: commande.id },
          data: { statut: 'REMBOURSEE' },
        });
      }
      await tx.stripeEvenement.create({ data: { id: eventId, type: 'refund.updated' } });
    } else if (refund.status === 'failed' || refund.status === 'canceled') {
      await tx.remboursement.update({
        where: { id: remboursement.id },
        data: { statut: 'ECHOUE', traiteLe: new Date() },
      });
      await tx.stripeEvenement.create({ data: { id: eventId, type: 'refund.updated' } });
    }

  });
};