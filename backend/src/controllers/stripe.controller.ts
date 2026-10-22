// backend/src/controllers/stripe.controller.ts

import type { Request, Response } from 'express';
import Stripe from 'stripe';
import { stripe } from '../config/stripe';
import { traiterPaiementReussi, traiterSessionExpiree } from '../services/paiement.service';
import { traiterRemboursement } from '../services/remboursement.service';

export const stripeWebhookHandler = async (req: Request, res: Response) => {
  const signature = req.headers['stripe-signature'];
  if (!signature || typeof signature !== 'string') {
    return res.status(400).send('Signature manquante');
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      req.body, // Buffer brut grâce à express.raw
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!,
    );
  } catch(err) {
    console.error('Webhook Stripe rejeté :', (err as Error).message);
    console.error('secret défini ?', !!process.env.STRIPE_WEBHOOK_SECRET);
    console.error('body est un Buffer ?', Buffer.isBuffer(req.body));
    return res.status(400).send('Signature invalide');
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed':
        await traiterPaiementReussi(event.id, event.data.object as Stripe.Checkout.Session);
        break;
      case 'checkout.session.expired':
        await traiterSessionExpiree(event.id, event.data.object as Stripe.Checkout.Session);
        break;
      case 'charge.refunded': {
        const charge = event.data.object as Stripe.Charge;
        for (const refund of charge.refunds?.data ?? []) {
          await traiterRemboursement(`${event.id}:${refund.id}`, refund);
        }
        break;
      }
      case 'refund.updated':
      case 'refund.created': // optionnel
        await traiterRemboursement(event.id, event.data.object as Stripe.Refund);
        break;
    }
    res.json({ received: true });
  } catch (err) {
    console.error('Erreur traitement webhook', err);
    res.status(500).send('Erreur de traitement'); // Stripe réessaiera
  }
};