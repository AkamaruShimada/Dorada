// backend/src/services/stats.service.ts
import prisma from '../prisma/client';

export const getStatsJour = async (date = new Date()) => {
  const debut = new Date(date);
  debut.setHours(0, 0, 0, 0);
  const fin = new Date(debut);
  fin.setDate(fin.getDate() + 1);

  const [encaisse, rembourse, parStatut] = await Promise.all([
    prisma.commande.aggregate({
      _sum: { totalTtc: true },
      _count: true,
      where: { payeeLe: { gte: debut, lt: fin } },
    }),
    prisma.remboursement.aggregate({
      _sum: { montant: true },
      where: { statut: 'REUSSI', traiteLe: { gte: debut, lt: fin } },
    }),
    prisma.commande.groupBy({
      by: ['statut'],
      _count: true,
    }),
  ]);

  const brut = Number(encaisse._sum.totalTtc ?? 0);
  const rbt = Number(rembourse._sum.montant ?? 0);

  return {
    nbCommandes: encaisse._count,
    encaisseBrut: brut,
    rembourse: rbt,
    encaisseNet: brut - rbt, // le chiffre qui compte vraiment
    parStatut: Object.fromEntries(parStatut.map((s) => [s.statut, s._count])),
  };
};