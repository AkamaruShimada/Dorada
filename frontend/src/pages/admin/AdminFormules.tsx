// frontend/src/pages/admin/AdminFormules.tsx

import { useEffect, useState } from 'react';
import type { Formule } from '../../types/admin.types';
import {
  getAllFormules,
  createFormule,
  updateFormule,
  deleteFormule,
} from '../../services/admin/formule.service';
import FormuleForm from '../../components/admin/FormuleForm';
import ConfirmModal from '../../components/admin/ConfirmModal';
import { formatPrix } from '../../utils/pricing';

function AdminFormules() {
  const [formules, setFormules] = useState<Formule[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // null = fermé, Formule = édition, 'new' = création
  const [editingFormule, setEditingFormule] = useState<Formule | 'new' | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Formule | null>(null);

  useEffect(() => {
    loadFormules();
  }, []);

  async function loadFormules() {
    try {
      setIsLoading(true);
      setError(null);
      const data = await getAllFormules();
      setFormules(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
    } finally {
      setIsLoading(false);
    }
  }

  async function handleSave(formData: FormData) {
    try {
      if (editingFormule === 'new') {
        await createFormule(formData);
      } else if (editingFormule) {
        await updateFormule(editingFormule.id, formData);
      }
      setEditingFormule(null);
      await loadFormules();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la sauvegarde');
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return;

    try {
      await deleteFormule(deleteTarget.id);
      setDeleteTarget(null);
      await loadFormules();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la suppression');
    }
  }

  if (isLoading) return <p>Chargement des formules...</p>;

  return (
    <div className="min-h-screen bg-surface p-4 text-primary sm:p-6">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
              Gestion des formules
            </h1>
            <p className="mt-1 text-sm opacity-70">
              Consulte et gère les formules de ta boutique.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setEditingFormule('new')}
            className="inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2.5 font-semibold text-surface shadow-sm transition hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
          >
            + Nouvelle formule
          </button>
        </div>

        {error && (
          <div
            role="alert"
            className="mb-4 rounded-lg border border-secondary/30 bg-secondary/10 px-4 py-3 text-sm text-primary"
          >
            {error}
          </div>
        )}

        {formules.length === 0 ? (
          <div className="rounded-xl border border-primary/10 bg-surface px-6 py-12 text-center shadow-sm">
            <p className="font-medium">Aucune formule enregistrée.</p>
            <p className="mt-1 text-sm opacity-70">
              Ajoute une formule pour la voir apparaître ici.
            </p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-xl border border-primary/10 bg-surface shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[900px] text-left text-sm">
                <thead className="bg-primary text-surface">
                  <tr>
                    <th scope="col" className="px-4 py-3 font-semibold">Nom</th>
                    <th scope="col" className="px-4 py-3 text-center font-semibold">
                      Empanadas
                    </th>
                    <th scope="col" className="px-4 py-3 text-center font-semibold">
                      Extras
                    </th>
                    <th scope="col" className="px-4 py-3 text-right font-semibold">
                      Prix TTC
                    </th>
                    <th scope="col" className="px-4 py-3 font-semibold">
                      URL de l’image
                    </th>
                    <th scope="col" className="px-4 py-3 text-center font-semibold">
                      Statut
                    </th>
                    <th scope="col" className="px-4 py-3 text-right font-semibold">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-primary/10">
                  {formules.map((formule, index) => (
                    <tr
                      key={formule.id}
                      className={`transition hover:bg-secondary/10 ${
                        index % 2 === 1 ? 'bg-primary/[0.03]' : 'bg-surface'
                      }`}
                    >
                      <td className="px-4 py-3 font-medium">{formule.nom}</td>
                      <td className="px-4 py-3 text-center tabular-nums">
                        {formule.nombreEmpanadas}
                      </td>
                      <td className="px-4 py-3 text-center tabular-nums">
                        {formule.nombreExtras}
                      </td>
                      <td className="px-4 py-3 text-right font-medium tabular-nums">
                        {formatPrix(formule.prixTtc)}
                      </td>
                      <td
                        className="max-w-xs truncate px-4 py-3 opacity-75"
                        title={formule.image_url || ''}
                      >
                        {formule.image_url || 'N/A'}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span
                          className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
                            formule.actif
                              ? 'bg-primary/10 text-primary'
                              : 'bg-secondary/20 text-primary'
                          }`}
                        >
                          {formule.actif ? 'Actif' : 'Inactif'}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => setEditingFormule(formule)}
                            className="rounded-md border border-primary/20 px-3 py-1.5 font-medium text-primary transition hover:bg-primary hover:text-surface focus:outline-none focus:ring-2 focus:ring-primary"
                          >
                            Modifier
                          </button>
                          <button
                            type="button"
                            onClick={() => setDeleteTarget(formule)}
                            className="rounded-md bg-secondary px-3 py-1.5 font-medium text-primary transition hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-secondary"
                          >
                            Désactiver
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {editingFormule && (
          <FormuleForm
            initialData={editingFormule === 'new' ? null : editingFormule}
            onSave={handleSave}
            onCancel={() => setEditingFormule(null)}
          />
        )}

        {deleteTarget && (
          <ConfirmModal
            title='Confirmer la désactivation'
            message={`Désactiver "${deleteTarget.nom}" ? Celle-ci sera notifiée comme indisponible au client.`}
            onConfirm={handleDelete}
            onCancel={() => setDeleteTarget(null)}
          />
        )}
      </div>
    </div>
  );
}

export default AdminFormules;