// frontend/src/pages/admin/AdminCodesPromo.tsx

import { useEffect, useMemo, useState } from 'react';
import type {
  CodePromo,
  CodePromoPayload,
  CodePromoUpdatePayload,
} from '../../types/admin.types';
import {
  createCodePromo,
  getAllCodesPromo,
  updateCodePromo,
} from '../../services/admin/codePromo.service';
import CodePromoForm from '../../components/admin/CodePromoForm';
import ConfirmModal from '../../components/admin/ConfirmModal';

type StatutCode = 'ACTIF' | 'DESACTIVE' | 'EXPIRE' | 'EPUISE';

const STATUT_LABELS: Record<StatutCode, string> = {
  ACTIF: 'Actif',
  DESACTIVE: 'Désactivé',
  EXPIRE: 'Expiré',
  EPUISE: 'Épuisé',
};

const STATUT_STYLES: Record<StatutCode, string> = {
  ACTIF: 'bg-secondary/30 text-primary',
  DESACTIVE: 'bg-primary/10 text-primary line-through',
  EXPIRE: 'bg-primary/5 text-primary opacity-60',
  EPUISE: 'bg-primary/5 text-primary opacity-60',
};

const formatDate = (iso: string | null) =>
  iso ? new Date(iso).toLocaleDateString('fr-FR') : '-';

// Un seul endroit pour déterminer le statut réel d'un code
function getStatut(c: CodePromo): StatutCode {
  if (!c.actif) return 'DESACTIVE';
  if (c.dateExpiration && new Date(c.dateExpiration) < new Date()) return 'EXPIRE';
  if (c.usagesMax !== null && c.usagesActuels >= c.usagesMax) return 'EPUISE';
  return 'ACTIF';
}

function AdminCodesPromo() {
  const [codes, setCodes] = useState<CodePromo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filtreStatut, setFiltreStatut] = useState<StatutCode | ''>('');

  // Modales : on stocke la cible, null = fermée
  const [showCreate, setShowCreate] = useState(false);
  const [editTarget, setEditTarget] = useState<CodePromo | null>(null);
  const [disableTarget, setDisableTarget] = useState<CodePromo | null>(null);

  useEffect(() => {
    loadCodes();
  }, []);

  async function loadCodes() {
    try {
      setIsLoading(true);
      setError(null);
      setCodes(await getAllCodesPromo());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
    } finally {
      setIsLoading(false);
    }
  }

  // Le filtre est appliqué côté front : pas d'appel API à chaque changement
  const codesFiltres = useMemo(
    () => (filtreStatut ? codes.filter((c) => getStatut(c) === filtreStatut) : codes),
    [codes, filtreStatut],
  );

  async function handleCreate(payload: CodePromoPayload | CodePromoUpdatePayload) {
    // Si ça throw, le formulaire affiche l'erreur et reste ouvert
    await createCodePromo(payload as CodePromoPayload);
    setShowCreate(false);
    await loadCodes();
  }

  async function handleEdit(payload: CodePromoPayload | CodePromoUpdatePayload) {
    if (!editTarget) return;
    await updateCodePromo(editTarget.id, payload as CodePromoUpdatePayload);
    setEditTarget(null);
    await loadCodes();
  }

  async function handleToggleActif(c: CodePromo) {
    try {
      setError(null);
      await updateCodePromo(c.id, { actif: !c.actif });
      await loadCodes();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la mise à jour');
    }
  }

  async function handleConfirmDisable() {
    if (!disableTarget) return;
    const target = disableTarget;
    setDisableTarget(null);
    await handleToggleActif(target);
  }

  return (
    <div className="min-h-screen bg-surface p-4 text-primary sm:p-6">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Codes promo</h1>
            <p className="mt-1 text-sm opacity-70">
              Crée, modifie et désactive les codes de réduction de tes clients.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
            <div>
              <label htmlFor="filtre-statut" className="mb-1.5 block text-sm font-semibold">
                Filtrer par statut
              </label>
              <select
                id="filtre-statut"
                value={filtreStatut}
                onChange={(e) => setFiltreStatut(e.target.value as StatutCode | '')}
                className="rounded-lg border border-primary/20 bg-surface px-3 py-2.5 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
              >
                <option value="">Tous</option>
                {(Object.keys(STATUT_LABELS) as StatutCode[]).map((s) => (
                  <option key={s} value={s}>
                    {STATUT_LABELS[s]}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="button"
              onClick={() => setShowCreate(true)}
              className="rounded-lg bg-primary px-4 py-2.5 font-semibold text-surface shadow-sm transition hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            >
              Nouveau code
            </button>
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
          <p>Chargement des codes promo...</p>
        ) : codesFiltres.length === 0 ? (
          <div className="rounded-xl border border-primary/10 bg-surface px-6 py-12 text-center shadow-sm">
            <p className="font-medium">Aucun code promo pour ce filtre.</p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-xl border border-primary/10 bg-surface shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[800px] text-left text-sm">
                <thead className="bg-primary text-surface">
                  <tr>
                    <th scope="col" className="px-4 py-3 font-semibold">Code</th>
                    <th scope="col" className="px-4 py-3 text-right font-semibold">Réduction</th>
                    <th scope="col" className="px-4 py-3 text-right font-semibold">Utilisations</th>
                    <th scope="col" className="px-4 py-3 text-right font-semibold">Expiration</th>
                    <th scope="col" className="px-4 py-3 text-center font-semibold">Statut</th>
                    <th scope="col" className="px-4 py-3 text-right font-semibold">Actions</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-primary/10">
                  {codesFiltres.map((c, index) => {
                    const statut = getStatut(c);
                    return (
                      <tr
                        key={c.id}
                        className={`transition hover:bg-secondary/10 ${
                          index % 2 === 1 ? 'bg-primary/[0.03]' : 'bg-surface'
                        }`}
                      >
                        <td className="px-4 py-3 font-mono text-xs font-medium">{c.code}</td>
                        <td className="px-4 py-3 text-right font-medium tabular-nums">
                          -{c.pourcentage}%
                        </td>
                        <td className="px-4 py-3 text-right tabular-nums">
                          {c.usagesActuels}
                          {c.usagesMax !== null ? ` / ${c.usagesMax}` : ' / ∞'}
                        </td>
                        <td className="px-4 py-3 text-right tabular-nums">{formatDate(c.dateExpiration)}</td>
                        <td className="px-4 py-3 text-center">
                          <span
                            className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${STATUT_STYLES[statut]}`}
                          >
                            {STATUT_LABELS[statut]}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex justify-end gap-2">
                            <button
                              type="button"
                              onClick={() => setEditTarget(c)}
                              className="rounded-md border border-primary/20 px-3 py-1.5 font-medium text-primary transition hover:bg-primary hover:text-surface focus:outline-none focus:ring-2 focus:ring-primary"
                            >
                              Modifier
                            </button>

                            {c.actif ? (
                              <button
                                type="button"
                                onClick={() => setDisableTarget(c)}
                                className="rounded-md bg-primary px-3 py-1.5 font-medium text-surface transition hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-primary"
                              >
                                Désactiver
                              </button>
                            ) : (
                              <button
                                type="button"
                                onClick={() => handleToggleActif(c)}
                                className="rounded-md bg-primary px-3 py-1.5 font-medium text-surface transition hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-primary"
                              >
                                Activer
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {showCreate && (
          <CodePromoForm onSubmit={handleCreate} onCancel={() => setShowCreate(false)} />
        )}

        {editTarget && (
          <CodePromoForm
            codePromo={editTarget}
            onSubmit={handleEdit}
            onCancel={() => setEditTarget(null)}
          />
        )}

        {disableTarget && (
          <ConfirmModal
            title="Désactiver le code"
            message={`Désactiver le code ${disableTarget.code} ? Les clients ne pourront plus l'utiliser, mais les commandes déjà passées ne sont pas affectées.`}
            onConfirm={handleConfirmDisable}
            onCancel={() => setDisableTarget(null)}
          />
        )}
      </div>
    </div>
  );
}

export default AdminCodesPromo;