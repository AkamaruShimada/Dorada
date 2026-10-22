// backend/src/config/stripe.ts
import Stripe from 'stripe';

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY manquante');
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);