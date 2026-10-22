// frontend/src/types/admin.types.ts

export type TypeEmpanada = 'SALEE' | 'SUCREE' | 'VEGETARIEN';
export type TypeExtra = 'DOUCEUR' | 'BOISSON';

export interface Empanada {
  id: number;
  nom: string;
  description: string;
  type: TypeEmpanada;
  prixHt: number;
  tauxTva: number;
  sansGluten: boolean;
  stock: number;
  actif: boolean;
  image_url: string;
}

// Payload = ce qu'on envoie à l'API (sans id, généré côté serveur)
export type EmpanadaPayload = Omit<Empanada, 'id'>;

export interface Extra {
  id: number;
  nom: string;
  description: string;
  type: TypeExtra;
  prixHt: number;
  tauxTva: number;
  sansGluten: boolean;
  stock: number;
  actif: boolean;
  image_url: string;
}

export type ExtraPayload = Omit<Extra, 'id'>;

export interface Formule {
  id: number;
  nom: string;
  description: string;
  prixTtc: number;
  image_url: string | null;
  actif: boolean;
  nombreEmpanadas: number;
  nombreExtras: number;
}

export type FormulePayload = Omit<Formule, 'id'>;

export type StatutCommande =
  | 'EN_ATTENTE_PAIEMENT'
  | 'VALIDEE'
  | 'RECUPEREE'
  | 'ANNULEE'
  | 'EXPIREE'
  | 'REMBOURSEE';

export type ModeRecuperation = 'RETRAIT' | 'LIVRAISON';

export type MotifRemboursement =
  | 'STOCK_INSUFFISANT'
  | 'CAPACITE_DEPASSEE'
  | 'ERREUR_COMMANDE'
  | 'GESTE_COMMERCIAL'
  | 'AUTRE';

export type StatutRemboursement = 'EN_COURS' | 'REUSSI' | 'ECHOUE';

  export interface LigneCommande {
    id: number;
    quantite: number;
    nomFige: string;
    prixUnitaireHt: number;
    tauxTva: number;
    totalHt: number;
    totalTva: number;
    totalTtc: number;
    commandeFormuleId: number | null;
    empanada?: { nom: string };
    extra?: { nom: string };
 }

  export interface CommandeFormule {
    id: number;
    quantite: number;
    nomFige: string;
    totalTtc: number;
    empanadasChoisies: LigneCommande[];
    extrasChoisies: LigneCommande[];
  }

export interface Remboursement {
  id: number;
  montant: number;
  motif: MotifRemboursement;
  commentaire: string;
  statut: StatutRemboursement;
  demandeParNom: string;
  creeLe: string;
  traiteLe: string;
}

export interface Commande {
  id: number;
  reference: string;
  statut: StatutCommande;
  clientNom: string;
  clientEmail: string;
  clientTelephone: string;
  modeRecuperation: ModeRecuperation;
  adresseLivraison: string | null;
  dateSouhaitee: string;
  creeLe: string;
  totalHt: number;
  totalTva: number;
  totalTtc: number;
  remiseTtc: number;            // 0 si aucun code promo
  remisePourcent: number | null;
  codePromoFige: string | null; // null si aucun code promo
  empanadas: LigneCommande[];
  extras: LigneCommande[];
  formules: CommandeFormule[];
  remboursements: Remboursement[];
}

export interface CodePromo {
  id: number;
  code: string;
  pourcentage: number;
  actif: boolean;
  dateExpiration: string | null;
  usagesMax: number | null;
  usagesActuels: number;
  creeLe: string;
}

// Création : on n'envoie que ces champs, le reste est géré par le serveur
export interface CodePromoPayload {
  code: string;
  pourcentage: number;
  dateExpiration?: string | null;
  usagesMax?: number | null;
}

// Mise à jour : activation/désactivation, expiration, limite d'usage
export type CodePromoUpdatePayload = Partial<
  Pick<CodePromo, 'actif' | 'dateExpiration' | 'usagesMax'>
>;