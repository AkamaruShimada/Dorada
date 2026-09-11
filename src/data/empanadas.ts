// src/data/empanadas.ts

import type { Empanada } from '../types';

export const empanadas: Empanada[] = [
  {
    id: 1,
    nom: 'Bœuf épicé',
    description: 'Bœuf mijoté, oignons, poivrons, olives, cumin.',
    prix: 4.50,
    image: '/images/boeuf-epice.jpg',
    categorie: 'sale',
  },
  {
    id: 2,
    nom: 'Poulet crémeux',
    description: 'Poulet, oignons, poivrons, crème légère, épices douces.',
    prix: 4.50,
    image: '/images/poulet-cremeux.jpg',
    categorie: 'sale',
  },
  {
    id: 3,
    nom: 'Épinards & fromage',
    description: 'Épinards frais, oignons, mozzarella, œuf.',
    prix: 4.20,
    image: '/images/epinards-fromage.jpg',
    categorie: 'sale',
  },
  {
    id: 4,
    nom: 'Jambon & fromage',
    description: 'Jambon cuit, mozzarella fondante, origan.',
    prix: 4.20,
    image: '/images/jambon-fromage.jpg',
    categorie: 'sale',
  },
  {
    id: 5,
    nom: 'Légumes du soleil',
    description: 'Courgettes, poivrons, oignons, maïs, tomates, herbes.',
    prix: 4.20,
    image: '/images/legumes-soleil.jpg',
    categorie: 'sale',
  },
  {
    id: 6,
    nom: 'Dulce de leche',
    description: 'Confiture de lait onctueuse, touche de vanille.',
    prix: 3.50,
    image: '/images/dulce-de-leche.jpg',
    categorie: 'sucre',
  },
];