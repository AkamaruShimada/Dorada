// frontend/src/components/admin/CommandesTable.tsx
import { useEffect, useMemo, useState } from 'react';
import type { Commande, Remboursement, StatutCommande } from '../../types/admin.types';
import { getAllCommandesAdmin, updateStatutCommande } from '../../services/admin/commande.service';

// Affiche le prix barré quand une remise a été appliquée
const PrixAvecRemise = ({ commande }: { commande: Commande }) => {
  if (commande.remiseTtc <= 0) {
    return <>{formatPrix(commande.totalTtc)}</>;
  }
  return (
    <div className="flex flex-col items-end">
      <span className="text-xs line-through opacity-50">
        {formatPrix(commande.totalTtc + commande.remiseTtc)}
      </span>
      <span className="font-semibold">{formatPrix(commande.totalTtc)}</span>
    </div>
  );
};

const formatPrix = (n: number) => `${n.toFixed(2)} €`;
const formatDate = (iso: string) =>
  new Date(iso).toLocaleString('fr-FR', { dateStyle: 'short', timeStyle: 'short' });

// Total remboursé hors remboursements échoués
const totalRembourse = (rs: Remboursement[]) =>
  rs.filter((r) => r.statut !== 'ECHOUE').reduce((s, r) => s + Number(r.montant), 0);

const aRemboursementEnAttente = (rs: Remboursement[]) =>
  rs.some((r) => r.statut === 'EN_COURS');


type Props = {
  statut: StatutCommande;
  titre: string;
  refreshKey?: number; // incrémenter pour forcer un rechargement
  onSelect?: (commande: Commande) => void;
  onStatusUpdated?: () => void;
};

function CommandesTable({ statut, titre, refreshKey = 0, onSelect, onStatusUpdated }: Props) {
  const [commandes, setCommandes] = useState<Commande[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let annule = false; // évite de mettre à jour un composant démonté
    setIsLoading(true);
    setError(null);

    getAllCommandesAdmin(statut)
      .then((data) => !annule && setCommandes(data))
      .catch((err) => !annule && setError(err instanceof Error ? err.message : 'Erreur inconnue'))
      .finally(() => !annule && setIsLoading(false));

    return () => {
      annule = true;
    };
  }, [statut, refreshKey]);
  
    // La colonne n'apparaît que si au moins une commande a un remboursement
    const afficherColonneRemboursement = useMemo(
        () => commandes.some((c) => (c.remboursements?.length ?? 0) > 0),
        [commandes],
    );

    const afficherColonneCodePromo = useMemo(
        () => commandes.some((c) => c.codePromoFige),
        [commandes],
    );

    async function handleRecuperation(id: number) {
        try {
        setUpdatingId(id);
        setError(null);
        await updateStatutCommande(id, 'RECUPEREE');
        onStatusUpdated?.();
        } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'Erreur inconnue');
        } finally {
        setUpdatingId(null);
        }
    }

  return (
    <section>
      <h2 className="mb-3 text-lg font-semibold">
        {titre} ({commandes.length})
      </h2>

      {error && (
        <div role="alert" className="mb-4 rounded-lg border border-secondary/30 bg-secondary/10 px-4 py-3 text-sm">
          {error}
        </div>
      )}

      {isLoading ? (
        <p>Chargement...</p>
      ) : commandes.length === 0 ? (
        <div className="rounded-xl border border-primary/10 bg-surface px-6 py-10 text-center shadow-sm">
          <p className="font-medium">Aucune commande.</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-primary/10 bg-surface shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px] text-left text-sm">
              <thead className="bg-primary text-surface">
                <tr>
                  <th scope="col" className="px-4 py-3 font-semibold">Référence</th>
                  <th scope="col" className="px-4 py-3 font-semibold">Client</th>
                  <th scope="col" className="px-4 py-3 font-semibold">Date souhaitée</th>
                  <th scope="col" className="px-4 py-3 font-semibold">Créée le</th>
                  <th scope="col" className="px-4 py-3 font-semibold">Total TTC</th>
                  {afficherColonneCodePromo && (<th scope="col" className="px-4 py-3 text-center font-semibold">Code promo</th>)}
                  {afficherColonneRemboursement && <th scope="col" className="px-4 py-3 font-semibold">Remboursement</th>}
                  <th scope="col" className="px-4 py-3 text-right font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-primary/10">
                {commandes.map((c, i) => {
                    const rembourse = totalRembourse(c.remboursements ?? []);
                    const enAttente = aRemboursementEnAttente(c.remboursements ?? []);
    
                    return (
                  <tr key={c.id} className={`transition hover:bg-secondary/10 ${i % 2 === 1 ? 'bg-primary/[0.03]' : 'bg-surface'}`}>
                    <td className="px-4 py-3 font-mono text-xs font-medium">{c.reference}</td>
                    <td className="px-4 py-3">
                      <div className="font-medium">{c.clientNom}</div>
                      <div className="text-xs opacity-70">{c.clientTelephone}</div>
                    </td>
                    <td className="px-4 py-3 tabular-nums">{formatDate(c.dateSouhaitee)}</td>
                    <td className="px-4 py-3 tabular-nums">{formatDate(c.creeLe)}</td>
                    {afficherColonneCodePromo && (
                        <td className="px-4 py-3 text-center">
                            {c.codePromoFige ? (
                            <span className="inline-flex rounded-full bg-secondary/30 px-2.5 py-1 font-mono text-xs font-semibold text-primary">
                                {c.codePromoFige}
                                {c.remisePourcent !== null && ` -${c.remisePourcent}%`}
                            </span>
                            ) : (
                            <span className="opacity-40" aria-label="Aucun code promo">—</span>
                            )}
                        </td>
                    )}
                    <td className="px-4 py-3 text-right font-medium tabular-nums">
                    <PrixAvecRemise commande={c} />
                    </td>
                    {afficherColonneRemboursement && (
                      <td className="px-4 py-3 text-right font-medium tabular-nums" >
                        {(c.remboursements?.length ?? 0) > 0 ? (
                          <span
                            className={`inline-block rounded-full px-2 py-0.5 text-xs font-semibold ${
                              enAttente
                                ? 'bg-orange-100 text-orange-700'
                                : 'bg-red-100 text-red-700'
                            }`}
                            title={
                              enAttente
                                ? 'Remboursement en cours de traitement'
                                : 'Remboursement effectué'
                            }
                          >
                            − {formatPrix(rembourse)}
                            {enAttente && ' (en cours)'}
                          </span>
                        ) : (
                          <span className="opacity-40" aria-label="Aucun remboursement">
                            —
                          </span>
                        )}
                      </td>
                    )}
                    <td className="px-4 py-3">
                      <div className="flex justify-end">
                        <button
                          type="button"
                          onClick={() => onSelect?.(c)}
                          className="rounded-md border border-primary/20 px-3 py-1.5 font-medium transition hover:bg-primary hover:text-surface focus:outline-none focus:ring-2 focus:ring-primary"
                        >
                          Détail
                        </button>
                        {c.statut === 'VALIDEE' && (
                            <button
                            type="button"
                            onClick={() => handleRecuperation(c.id)}
                            disabled={updatingId === c.id}
                            className="rounded-md bg-primary px-3 py-1.5 font-medium text-surface transition hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-primary disabled:cursor-not-allowed disabled:opacity-50"
                            >
                            {updatingId === c.id ? 'Mise à jour...' : 'Récupérée'}
                            </button>
                        )}
                      </div>
                    </td>
                  </tr>
                )})}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </section>
  );
}

export default CommandesTable;