// backend/src/services/rapport.service.ts

import prisma from '../prisma/client';
import { type Periode } from '../utils/rapport.dates';
import { libelleMoyenPaiement } from '../utils/moyenPaiement';

export type TypeRapport = 'hebdomadaire' | 'mensuel' | 'personnalise';

export interface DetailProduitFormule {
  produit: string;
  quantite: number;
  tauxTva: number;
  totalHt: number;
  montantTva: number;
  totalTtc: number;
  supplementTtc: number;
}

export interface LigneFormule extends LigneRapport {
  detail: DetailProduitFormule[];
}

export interface LigneRapport {
  produit: string;
  quantite: number;
  prixUnitaireTtc: number;
  supplementTtc: number;
  totalHt: number;
  tauxTva: number | null;
  montantTva: number;
  totalTtc: number;
  moyenPaiement: string;
}

export interface RapportVentes {
  type: TypeRapport;
  periode: { label: string; debut: Date; fin: Date };
  unite: {
    lignes: LigneRapport[];
    totaux: TotauxRapport;
  };
  formules: {
    lignes: LigneRapport[];
    totaux: TotauxRapport;
  };
  global: TotauxRapport & { nombreCommandes: number; nombreRemboursees: number };
}

export interface TotauxRapport {
  quantite: number;
  totalHt: number;
  totalTva: number;
  totalTtc: number;
  totalSupplements: number;
}

const STATUTS_VENTE = ['VALIDEE', 'RECUPEREE'] as const;
const STATUTS_TOUTES = [...STATUTS_VENTE, 'REMBOURSEE'] as const;

const n = (v: unknown) => Number(v ?? 0);
const arrondi = (v: number) => Math.round(v * 100) / 100;

function calculerTotaux(lignes: LigneRapport[]): TotauxRapport {
  return lignes.reduce(
    (acc, l) => ({
      quantite: acc.quantite + l.quantite,
      totalHt: arrondi(acc.totalHt + l.totalHt),
      totalTva: arrondi(acc.totalTva + l.montantTva),
      totalTtc: arrondi(acc.totalTtc + l.totalTtc),
      totalSupplements: arrondi(acc.totalSupplements + l.supplementTtc),
    }),
    { quantite: 0, totalHt: 0, totalTva: 0, totalTtc: 0, totalSupplements: 0 },
  );
}

export async function genererRapport(periode: Periode, type: TypeRapport): Promise<RapportVentes> {

  const commandes = await prisma.commande.findMany({
    where: {
      statut: { in: [...STATUTS_TOUTES] },
      payeeLe: { gte: periode.debut, lte: periode.fin },
    },
    include: {
      empanadas: { include: { empanada: true } },
      extras: { include: { extra: true } },
      boissons: { include: { boisson: true } },
      formules: { include: { formule: true } },
    },
  });

  const lignesUnite: LigneRapport[] = [];
  const lignesFormules: LigneRapport[] = [];
  let nombreRemboursees = 0;

  for (const cmd of commandes) {
    const moyenPaiement = libelleMoyenPaiement(cmd.moyenPaiement);
    const estRemboursee = cmd.statut === 'REMBOURSEE';
    if (estRemboursee) nombreRemboursees++;

    // Les remboursements sont enregistrés en négatif pour que les totaux soient nets
    const signe = estRemboursee ? -1 : 1;

    // Ventes à l'unité : lignes sans formule parente
    for (const l of cmd.empanadas.filter((x) => x.commandeFormuleId === null)) {
      lignesUnite.push(construireLigne({
        produit: l.empanada.nom,
        quantite: l.quantite,
        totalHt: n(l.totalHt),
        totalTva: n(l.totalTva),
        totalTtc: n(l.totalTtc),
        tauxTva: n(l.tauxTva),
        moyenPaiement,
        signe,
      }));
    }

    for (const l of cmd.extras.filter((x) => x.commandeFormuleId === null)) {
      lignesUnite.push(construireLigne({
        produit: l.extra.nom,
        quantite: l.quantite,
        totalHt: n(l.totalHt),
        totalTva: n(l.totalTva),
        totalTtc: n(l.totalTtc),
        tauxTva: n(l.tauxTva),
        moyenPaiement,
        signe,
      }));
    }

    for (const l of cmd.boissons.filter((x) => x.commandeFormuleId === null)) {
      lignesUnite.push(construireLigne({
        produit: l.boisson.nom,
        quantite: l.quantite,
        totalHt: n(l.totalHt),
        totalTva: n(l.totalTva),
        totalTtc: n(l.totalTtc),
        tauxTva: n(l.tauxTva),
        moyenPaiement,
        signe,
      }));
    }

    // Ventes de formules : une ligne par CommandeFormule
    for (const f of cmd.formules) {
        // Produits enfants de cette formule
        const enfants = [
            ...cmd.empanadas.filter((x) => x.commandeFormuleId === f.id).map((x) => ({
            produit: x.empanada.nom,
            quantite: x.quantite,
            tauxTva: n(x.tauxTva),
            totalHt: n(x.totalHt),
            montantTva: n(x.totalTva),
            totalTtc: n(x.totalTtc),
            supplementTtc: n(x.supplementTtc),
            })),
            ...cmd.extras.filter((x) => x.commandeFormuleId === f.id).map((x) => ({
            produit: x.extra.nom,
            quantite: x.quantite,
            tauxTva: n(x.tauxTva),
            totalHt: n(x.totalHt),
            montantTva: n(x.totalTva),
            totalTtc: n(x.totalTtc),
            supplementTtc: n(x.supplementTtc),
            })),
            ...cmd.boissons.filter((x) => x.commandeFormuleId === f.id).map((x) => ({
            produit: x.boisson.nom,
            quantite: x.quantite,
            tauxTva: n(x.tauxTva),
            totalHt: n(x.totalHt),
            montantTva: n(x.totalTva),
            totalTtc: n(x.totalTtc),
            supplementTtc: n(x.supplementTtc),
            })),
        ];

        const detail = regrouperDetail(enfants, signe);
        const supplementFormule = arrondi(
          enfants.reduce((acc, e) => acc + e.supplementTtc, 0) * signe,
        );

        lignesFormules.push({
            ...construireLigne({
            produit: f.formule.nom,
            quantite: f.quantite,
            totalHt: n(f.totalHt),
            totalTva: n(f.totalTva),
            totalTtc: n(f.totalTtc),
            tauxTva: null, // pas de moyenne : le taux est porté par le détail
            moyenPaiement,
            signe,
            supplementTtc: supplementFormule, // pas de supplément pour la formule elle-même, c'est porté par le détail
            }),
            detail,
        } as LigneFormule);
        }
  }

  const totauxUnite = calculerTotaux(lignesUnite);
  const totauxFormules = calculerTotaux(lignesFormules);

  return {
    type,
    periode: { label: periode.label, debut: periode.debut, fin: periode.fin },
    unite: { lignes: lignesUnite, totaux: totauxUnite },
    formules: { lignes: lignesFormules, totaux: totauxFormules },
    global: {
      quantite: totauxUnite.quantite + totauxFormules.quantite,
      totalHt: arrondi(totauxUnite.totalHt + totauxFormules.totalHt),
      totalTva: arrondi(totauxUnite.totalTva + totauxFormules.totalTva),
      totalTtc: arrondi(totauxUnite.totalTtc + totauxFormules.totalTtc),
      totalSupplements: arrondi(totauxUnite.totalSupplements + totauxFormules.totalSupplements),
      nombreCommandes: commandes.length,
      nombreRemboursees,
    },
  };
}

function regrouperDetail(
  items: Omit<DetailProduitFormule, never>[],
  signe: number,
): DetailProduitFormule[] {
  const map = new Map<string, DetailProduitFormule>();

  for (const i of items) {
    const cle = `${i.produit}|${i.tauxTva}`;
    const existant = map.get(cle);
    if (existant) {
      existant.quantite += i.quantite * signe;
      existant.totalHt = arrondi(existant.totalHt + i.totalHt * signe);
      existant.montantTva = arrondi(existant.montantTva + i.montantTva * signe);
      existant.totalTtc = arrondi(existant.totalTtc + i.totalTtc * signe);
      existant.supplementTtc = arrondi(existant.supplementTtc + i.supplementTtc * signe);
    } else {
      map.set(cle, {
        produit: i.produit,
        quantite: i.quantite * signe,
        tauxTva: i.tauxTva,
        totalHt: arrondi(i.totalHt * signe),
        montantTva: arrondi(i.montantTva * signe),
        totalTtc: arrondi(i.totalTtc * signe),
        supplementTtc: arrondi(i.supplementTtc * signe),
      });
    }
  }

  return [...map.values()];
}

function construireLigne(p: {
  produit: string;
  quantite: number;
  totalHt: number;
  totalTva: number;
  totalTtc: number;
  tauxTva: number | null;
  moyenPaiement: string;
  signe: number;
  supplementTtc?: number;
}): LigneRapport {
  const quantite = p.quantite * p.signe;
  const totalHt = arrondi(p.totalHt * p.signe);
  const montantTva = arrondi(p.totalTva * p.signe);
  const totalTtc = arrondi(p.totalTtc * p.signe);

  return {
    produit: p.produit,
    quantite,
    prixUnitaireTtc: p.quantite > 0 ? arrondi(p.totalTtc / p.quantite) : 0,
    totalHt,
    tauxTva: p.tauxTva,
    montantTva,
    totalTtc,
    supplementTtc: arrondi((p.supplementTtc ?? 0)),
    moyenPaiement: p.moyenPaiement,
  };
}