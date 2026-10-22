// backend/src/services/paiement.service.ts

import type Stripe from 'stripe';
import prisma from '../prisma/client';

export const traiterPaiementReussi = async (
  eventId: string,
  session: Stripe.Checkout.Session,
) => {
  await prisma.$transaction(async (tx) => {
    // Idempotence : Stripe peut envoyer le même événement plusieurs fois
    const dejaTraite = await tx.stripeEvenement.findUnique({ where: { id: eventId } });
    if (dejaTraite) return;
    
    const commandeId = session.metadata?.commandeId
      ? Number(session.metadata.commandeId)
      : null;

    const commande = await tx.commande.findFirst({
      where: commandeId
        ? { OR: [{ stripeSessionId: session.id }, { id: commandeId }] }
        : { stripeSessionId: session.id },
      include: { empanadas: true, extras: true },
    });

    if (!commande) {
      throw new Error(`Commande introuvable pour la session ${session.id}`);
    }

    if (commande.statut === 'VALIDEE') return; // déjà traité, c'est normal
    if (commande.statut !== 'EN_ATTENTE_PAIEMENT') {
      throw new Error(`Statut inattendu ${commande.statut} pour ${commande.reference}`);
    }

    // Décrémenter le stock de façon atomique (échoue si stock insuffisant)
    for (const l of commande.empanadas) {
      const res = await tx.empanada.updateMany({
        where: { id: l.empanadaId, stock: { gte: l.quantite } },
        data: { stock: { decrement: l.quantite } },
      });
      if (res.count === 0) {
        // Payé mais plus de stock : à traiter manuellement (remboursement)
        console.error(`STOCK INSUFFISANT après paiement, commande ${commande.reference}`);
      }
    }
    for (const l of commande.extras) {
      await tx.extra.updateMany({
        where: { id: l.extraId, stock: { gte: l.quantite } },
        data: { stock: { decrement: l.quantite } },
      });
    }

    if (commande.codePromoId) {
      await tx.codePromo.update({
        where: { id: commande.codePromoId },
        data: { usagesActuels: { increment: 1 } },
      });
    }

    await tx.commande.update({
      where: { id: commande.id },
      data: {
        statut: 'VALIDEE',
        payeeLe: new Date(),
        stripePaymentIntentId:
          typeof session.payment_intent === 'string' ? session.payment_intent : null,
      },
    });

    await tx.stripeEvenement.create({ data: { id: eventId, type: 'checkout.session.completed' } });
  });
};

export const traiterSessionExpiree = async (
  eventId: string,
  session: Stripe.Checkout.Session,
) => {
  await prisma.commande.updateMany({
    where: { stripeSessionId: session.id, statut: 'EN_ATTENTE_PAIEMENT' },
    data: { statut: 'EXPIREE' },
  });
};