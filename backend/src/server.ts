// backend/src/server.ts

import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import empanadaRoutes from './routes/empanada.routes';
import extraRoutes from './routes/extra.routes';
import formuleRoutes from './routes/formule.routes';
import commandeRoutes from './routes/commande.routes'
import authRoutes from './routes/auth.routes';
import codePromoRoutes from './routes/codePromo.routes'

import cookieParser from 'cookie-parser';
import { stripeWebhookHandler } from './controllers/stripe.controller';
import { Prisma } from '@prisma/client';

(Prisma.Decimal.prototype as any).toJSON = function () {
  return this.toNumber();
};

const app = express();

app.post('/api/stripe/webhook', express.raw({ type: 'application/json'}), stripeWebhookHandler,);

// Middlewares globaux, exécutés sur CHAQUE requête entrante
app.use(cookieParser());
app.use(cors({
  origin: process.env.FRONTEND_URL, // pas de '*' possible avec credentials
  credentials: true, // indispensable pour accepter les cookies cross-origin
}));
app.use(express.json());      // permet de lire le JSON envoyé dans le corps des requêtes

// Route de test, pour vérifier que le serveur répond
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Le serveur fonctionne' });
});

// Utilise les routes d'émpanadas
app.use('/api/empanadas', empanadaRoutes);
// Utilise les routes d'extras
app.use('/api/extras', extraRoutes);
// Utilise les routes de formule
app.use('/api/formules', formuleRoutes);
// Utilise les routes de commandes
app.use('/api/commandes', commandeRoutes)
// Utilise les routes des code Promo
app.use('/api/codes-promo', codePromoRoutes);

// Utilise l'authentification et la gestion des utilisateurs
app.use('/api/auth', authRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Serveur backend démarré sur http://localhost:${PORT}`);
});