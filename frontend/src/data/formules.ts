// src/data/formules.ts

import type { Formule } from '../types';

export const formules: Formule[] = [
  {
    id: 1,
    nom: 'La Découverte',
    description: '3 empanadas au choix + 1 boisson',
    prix: 13.50,
    nbEmpanadas: 3,
  },
  {
    id: 2,
    nom: "L'Expérience Les Farcis",
    description: '3 empanadas au choix + 1 boisson + 1 douceur maison',
    prix: 19.50,
    nbEmpanadas: 3,
    populaire: true,
  },
  {
    id: 3,
    nom: 'Le Coffret à Partager',
    description: '6 ou 12 empanadas au choix + boissons',
    prix: 39.00,
    nbEmpanadas: 12,
  },
];