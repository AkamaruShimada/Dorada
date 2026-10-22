// frontend/src/pages/admin/AdminDashboard.tsx

import { useEffect, useState } from 'react';
import type { Commande, StatutCommande } from '../../types/admin.types';
import { getStatsJour, type StatsJour } from '../../services/admin/commande.service';
import CommandesTable from '../../components/admin/CommandesTable';
import CommandeDetailModal from '../../components/admin/CommandeDetailModal';
import RemboursementModal from '../../components/admin/RemboursementModal';

const ONGLETS: { statut: StatutCommande; titre: string }[] = [
  { statut: 'VALIDEE', titre: 'À préparer' },
  { statut: 'RECUPEREE', titre: 'Récupérées' },
  { statut: 'REMBOURSEE', titre: 'Remboursées' },
];

const STATUT_LABELS: Partial<Record<StatutCommande, string>> = {
  VALIDEE: 'Validée',
  RECUPEREE: 'Récupérée',
  REMBOURSEE: 'Remboursée',
};

const formatPrix = (n: number) => `${n.toFixed(2)} €`;

function AdminDashboard() {
  const [stats, setStats] = useState<StatsJour | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [onglet, setOnglet] = useState<StatutCommande>('VALIDEE');
  const [detailTarget, setDetailTarget] = useState<Commande | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [refundTarget, setRefundTarget] = useState<Commande | null>(null);

  useEffect(() => {
    getStatsJour()
      .then(setStats)
      .catch((err) => setError(err instanceof Error ? err.message : 'Erreur inconnue'));
  }, [refreshKey]);

  const cartes = stats
    ? [
        { label: 'Commandes du jour', valeur: String(stats.nbCommandes) },
        { label: 'Encaissé brut', valeur: formatPrix(stats.encaisseBrut) },
        { label: 'Remboursé', valeur: formatPrix(stats.rembourse) },
        { label: 'Net du jour', valeur: formatPrix(stats.encaisseNet) },
      ]
    : [];

  return (
    <div className="min-h-screen bg-surface p-4 text-primary sm:p-6">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6">
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Tableau de bord</h1>
          <p className="mt-1 text-sm opacity-70">Vue d'ensemble de ton activité du jour.</p>
        </div>

        {error && (
          <div role="alert" className="mb-4 rounded-lg border border-secondary/30 bg-secondary/10 px-4 py-3 text-sm">
            {error}
          </div>
        )}

        <div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {cartes.map((c) => (
            <div key={c.label} className="rounded-xl border border-primary/10 bg-surface p-4 shadow-sm">
              <p className="text-sm opacity-70">{c.label}</p>
              <p className="mt-1 text-2xl font-bold tabular-nums">{c.valeur}</p>
            </div>
          ))}
        </div>

        <div role="tablist" className="mb-4 flex gap-2 border-b border-primary/10">
          {ONGLETS.map((o) => (
            <button
              key={o.statut}
              role="tab"
              type="button"
              aria-selected={onglet === o.statut}
              onClick={() => setOnglet(o.statut)}
              className={`-mb-px rounded-t-lg px-4 py-2.5 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-primary ${
                onglet === o.statut
                  ? 'border-b-2 border-primary text-primary'
                  : 'opacity-60 hover:opacity-100'
              }`}
            >
              {o.titre}
              {stats?.parStatut[o.statut] !== undefined && ` (${stats.parStatut[o.statut]})`}
            </button>
          ))}
        </div>

        <CommandesTable
          statut={onglet}
          titre={ONGLETS.find((o) => o.statut === onglet)!.titre}
          refreshKey={refreshKey}
          onSelect={setDetailTarget}
          onStatusUpdated={() => setRefreshKey((k) => k + 1)}
        />

        {detailTarget && (
          <CommandeDetailModal
            commande={detailTarget}
            statutLabel={STATUT_LABELS[detailTarget.statut] ?? detailTarget.statut}
            onClose={() => setDetailTarget(null)}
            onRefund={() => {
              setRefundTarget(detailTarget);
              setDetailTarget(null); // ferme le détail pour ne pas empiler deux modales
            }}
            onCancel={() => {}} // à brancher plus tard, voir ci-dessous
          />
        )}

        {refundTarget && (
          <RemboursementModal
            commande={refundTarget}
            onCancel={() => setRefundTarget(null)}
            onDone={() => {
              setRefundTarget(null);
              setRefreshKey((k) => k + 1); // recharge tableau, compteurs et stats
            }}
          />
        )}
      </div>
    </div>
  );
}

export default AdminDashboard;