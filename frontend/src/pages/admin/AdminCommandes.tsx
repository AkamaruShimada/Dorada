// frontend/src/pages/admin/AdminCommandes.tsx

import { useEffect, useState } from 'react';
import type { Commande, StatutCommande } from '../../types/admin.types';
import {
  getAllCommandesAdmin,
  updateStatutCommande,
} from '../../services/admin/commande.service';
import CommandeDetailModal from '../../components/admin/CommandeDetailModal';
import RemboursementModal from '../../components/admin/RemboursementModal';
import ConfirmModal from '../../components/admin/ConfirmModal';

const STATUT_LABELS: Record<StatutCommande, string> = {
  EN_ATTENTE_PAIEMENT: 'En attente de paiement',
  VALIDEE: 'Validée',
  RECUPEREE: 'Récupérée',
  ANNULEE: 'Annulée',
  EXPIREE: 'Expirée',
  REMBOURSEE: 'Remboursée',
};

const STATUT_STYLES: Record<StatutCommande, string> = {
  EN_ATTENTE_PAIEMENT: 'bg-primary/5 text-primary opacity-70',
  VALIDEE: 'bg-secondary/30 text-primary',
  RECUPEREE: 'bg-primary/10 text-primary',
  ANNULEE: 'bg-primary/10 text-primary line-through',
  EXPIREE: 'bg-primary/5 text-primary opacity-60',
  REMBOURSEE: 'bg-secondary/20 text-primary',
};

const formatPrix = (n: number) => `${n.toFixed(2)} €`;
const formatDate = (iso: string) =>
  new Date(iso).toLocaleString('fr-FR', { dateStyle: 'short', timeStyle: 'short' });

function AdminCommandes() {
  const [commandes, setCommandes] = useState<Commande[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filtreStatut, setFiltreStatut] = useState<StatutCommande | ''>('VALIDEE');

  // Modales : on stocke la commande ciblée, null = fermée
  const [detailTarget, setDetailTarget] = useState<Commande | null>(null);
  const [refundTarget, setRefundTarget] = useState<Commande | null>(null);
  const [statutTarget, setStatutTarget] = useState<{
    commande: Commande;
    statut: StatutCommande;
  } | null>(null);

  useEffect(() => {
    loadCommandes();
  }, [filtreStatut]);

  async function loadCommandes() {
    try {
      setIsLoading(true);
      setError(null);
      const data = await getAllCommandesAdmin(filtreStatut || undefined);
      setCommandes(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
    } finally {
      setIsLoading(false);
    }
  }

  async function handleChangeStatut() {
    if (!statutTarget) return;
    try {
      await updateStatutCommande(statutTarget.commande.id, statutTarget.statut);
      setStatutTarget(null);
      await loadCommandes();
    } catch (err) {
      setStatutTarget(null);
      setError(err instanceof Error ? err.message : 'Erreur lors du changement de statut');
    }
  }

  async function handleRefundDone() {
    setRefundTarget(null);
    setDetailTarget(null);
    await loadCommandes();
  }

  return (
    <div className="min-h-screen bg-surface p-4 text-primary sm:p-6">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
              Gestion des commandes
            </h1>
            <p className="mt-1 text-sm opacity-70">
              Suis, prépare et rembourse les commandes de tes clients.
            </p>
          </div>

          <div>
            <label htmlFor="filtre-statut" className="mb-1.5 block text-sm font-semibold">
              Filtrer par statut
            </label>
            <select
              id="filtre-statut"
              value={filtreStatut}
              onChange={(e) => setFiltreStatut(e.target.value as StatutCommande | '')}
              className="rounded-lg border border-primary/20 bg-surface px-3 py-2.5 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
            >
              <option value="">Toutes</option>
              {(Object.keys(STATUT_LABELS) as StatutCommande[]).map((s) => (
                <option key={s} value={s}>
                  {STATUT_LABELS[s]}
                </option>
              ))}
            </select>
          </div>
        </div>

        {error && (
          <div
            role="alert"
            className="mb-4 rounded-lg border border-secondary/30 bg-secondary/10 px-4 py-3 text-sm text-primary"
          >
            {error}
          </div>
        )}

        {isLoading ? (
          <p>Chargement des commandes...</p>
        ) : commandes.length === 0 ? (
          <div className="rounded-xl border border-primary/10 bg-surface px-6 py-12 text-center shadow-sm">
            <p className="font-medium">Aucune commande pour ce filtre.</p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-xl border border-primary/10 bg-surface shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1000px] text-left text-sm">
                <thead className="bg-primary text-surface">
                  <tr>
                    <th scope="col" className="px-4 py-3 font-semibold">Référence</th>
                    <th scope="col" className="px-4 py-3 font-semibold">Client</th>
                    <th scope="col" className="px-4 py-3 font-semibold">Date de la commande</th>
                    <th scope="col" className="px-4 py-3 font-semibold">Date souhaitée</th>
                    <th scope="col" className="px-4 py-3 font-semibold">Mode</th>
                    <th scope="col" className="px-4 py-3 text-center font-semibold">Code promo</th>
                    <th scope="col" className="px-4 py-3 text-right font-semibold">Total TTC</th>
                    <th scope="col" className="px-4 py-3 text-center font-semibold">Statut</th>
                    <th scope="col" className="px-4 py-3 text-right font-semibold">Actions</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-primary/10">
                  {commandes.map((commande, index) => (
                    <tr
                      key={commande.id}
                      className={`transition hover:bg-secondary/10 ${
                        index % 2 === 1 ? 'bg-primary/[0.03]' : 'bg-surface'
                      }`}
                    >
                      <td className="px-4 py-3 font-mono text-xs font-medium">
                        {commande.reference}
                      </td>
                      <td className="px-4 py-3">
                        <div className="font-medium">{commande.clientNom}</div>
                        <div className="text-xs opacity-70">{commande.clientTelephone}</div>
                      </td>
                      <td className="px-4 py-3 tabular-nums">
                        {formatDate(commande.creeLe)}
                      </td>
                      <td className="px-4 py-3 tabular-nums">
                        {formatDate(commande.dateSouhaitee)}
                      </td>
                      <td className="px-4 py-3">
                        {commande.modeRecuperation === 'LIVRAISON' ? 'Livraison' : 'Retrait'}
                      </td>
                      <td className="px-4 py-3 text-center">
                        {commande.codePromoFige ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-secondary/30 px-2.5 py-1 text-xs font-semibold text-primary">
                            <span className="font-mono">{commande.codePromoFige}</span>
                            {commande.remisePourcent !== null && (
                              <span className="tabular-nums">-{commande.remisePourcent}%</span>
                            )}
                          </span>
                        ) : (
                          <span className="opacity-40">-</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-right font-medium tabular-nums">
                        {commande.remiseTtc > 0 && (
                          <div className="text-xs line-through opacity-50">
                            {formatPrix(commande.totalTtc + commande.remiseTtc)}
                          </div>
                        )}
                        <div>{formatPrix(commande.totalTtc)}</div>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span
                          className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
                            STATUT_STYLES[commande.statut]
                          }`}
                        >
                          {STATUT_LABELS[commande.statut]}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => setDetailTarget(commande)}
                            className="rounded-md border border-primary/20 px-3 py-1.5 font-medium text-primary transition hover:bg-primary hover:text-surface focus:outline-none focus:ring-2 focus:ring-primary"
                          >
                            Détail
                          </button>

                          {commande.statut === 'VALIDEE' && (
                            <button
                              type="button"
                              onClick={() =>
                                setStatutTarget({ commande, statut: 'RECUPEREE' })
                              }
                              className="rounded-md bg-primary px-3 py-1.5 font-medium text-surface transition hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-primary"
                            >
                              Marquer récupérée
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {detailTarget && (
          <CommandeDetailModal
            commande={detailTarget}
            statutLabel={STATUT_LABELS[detailTarget.statut]}
            onClose={() => setDetailTarget(null)}
            onRefund={() => setRefundTarget(detailTarget)}
            onCancel={() =>
              setStatutTarget({ commande: detailTarget, statut: 'ANNULEE' })
            }
          />
        )}

        {refundTarget && (
          <RemboursementModal
            commande={refundTarget}
            onDone={handleRefundDone}
            onCancel={() => setRefundTarget(null)}
          />
        )}

        {statutTarget && (
          <ConfirmModal
            title='Changer le statut'
            message={
              statutTarget.statut === 'ANNULEE'
                ? `Annuler la commande ${statutTarget.commande.reference} ? Attention : cela ne rembourse pas le client, pense à le rembourser d'abord.`
                : `Marquer la commande ${statutTarget.commande.reference} comme récupérée ?`
            }
            onConfirm={handleChangeStatut}
            onCancel={() => setStatutTarget(null)}
          />
        )}
      </div>
    </div>
  );
}

export default AdminCommandes;