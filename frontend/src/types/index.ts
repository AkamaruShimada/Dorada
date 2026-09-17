// src/types/index.ts

/**
 * Une empanada individuelle (carte "Nos Empanadas")
 */
export interface Empanada {
  id: number;
  nom: string;
  description: string;
  prix: number;
  image: string;
  categorie: 'sale' | 'sucre'; // Union type : uniquement ces 2 valeurs possibles
}

/**
 * Une formule / pack (ex: "La Découverte", "L'Expérience Les Farcis")
 */
export interface Formule {
  id: number;
  nom: string;
  description: string;
  prix: number;
  nbEmpanadas: number;
  populaire?: boolean; // le "?" = propriété optionnelle, absente par défaut
}

/**
 * Douceurs maison (alfajor, cookie...) et boissons
 * Structure volontairement simple : pas de prix affiché sur votre maquette
 */
export interface Extra {
  id: number;
  nom: string;
  description: string;
  type: 'douceur' | 'boisson';
}

/**
 * Une empanada choisie dans le panier/formule, avec sa quantité
 * Utile plus tard pour la logique de commande
 */
export interface ItemPanier {
  empanadaId: number;
  quantite: number;
}

export interface LigneCommande {
  empanadaId: number;
  nomAuMomentAchat: string;
  prixAuMomentAchat: number;
  quantite: number;
}