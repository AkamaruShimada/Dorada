// backend/src/server.ts

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import empanadaRoutes from './routes/empanada.routes';
import extraRoutes from './routes/extra.routes';
import formuleRoutes from './routes/formule.routes';

// Charge les variables du fichier .env dans process.env
dotenv.config();

const app = express();

// Middlewares globaux, exécutés sur CHAQUE requête entrante
app.use(cors());              // autorise le frontend à appeler cette API
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

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Serveur backend démarré sur http://localhost:${PORT}`);
});