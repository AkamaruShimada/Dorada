// frontend/src/pages/admin/AdminEmpanadas.tsx

import { useEffect, useState } from 'react';
import type { Empanada } from '../../types/admin.types';
import {
  getAllEmpanadasAdmin,
  createEmpanada,
  updateEmpanada,
  deleteEmpanada,
} from '../../services/admin/empanada.service';
import EmpanadaForm from '../../components/admin/EmpanadaForm';
import ConfirmModal from '../../components/admin/ConfirmModal';

function AdminEmpanadas() {
  const [empanadas, setEmpanadas] = useState<Empanada[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // État du formulaire (null = fermé, Empanada = édition, 'new' = création)
  const [editingEmpanada, setEditingEmpanada] = useState<Empanada | 'new' | null>(null);

  // État de la modal de confirmation de suppression
  const [deleteTarget, setDeleteTarget] = useState<Empanada | null>(null);

  useEffect(() => {
    loadEmpanadas();
  }, []);

  async function loadEmpanadas() {
    try {
      setIsLoading(true);
      setError(null);
      const data = await getAllEmpanadasAdmin();
      setEmpanadas(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
    } finally {
      setIsLoading(false);
    }
  }

  async function handleSave(formData: FormData) {
    try {
      if (editingEmpanada === 'new') {
        await createEmpanada(formData);
      } else if (editingEmpanada) {
        await updateEmpanada(editingEmpanada.id, formData);
      }
      setEditingEmpanada(null);
      await loadEmpanadas(); // on recharge la liste après modification
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la sauvegarde');
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return;

    try {
      await deleteEmpanada(deleteTarget.id);
      setDeleteTarget(null);
      await loadEmpanadas();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la suppression');
    }
  }

  if (isLoading) return <p>Chargement des empanadas...</p>;

  return (
  <div className="min-h-screen bg-surface p-4 text-primary sm:p-6">
    <div className="mx-auto max-w-7xl">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Gestion des empanadas
          </h1>
          <p className="mt-1 text-sm opacity-70">
            Consulte et gère les produits de ta boutique.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setEditingEmpanada('new')}
          className="inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2.5 font-semibold text-surface shadow-sm transition hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
        >
          + Nouvelle empanada
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

      {empanadas.length === 0 ? (
        <div className="rounded-xl border border-primary/10 bg-surface px-6 py-12 text-center shadow-sm">
          <p className="font-medium">Aucune empanada enregistrée.</p>
          <p className="mt-1 text-sm opacity-70">
            Ajoute une empanada pour la voir apparaître ici.
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-primary/10 bg-surface shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] text-left text-sm">
              <thead className="bg-primary text-surface">
                <tr>
                  <th scope="col" className="px-4 py-3 font-semibold">
                    Nom
                  </th>
                  <th scope="col" className="px-4 py-3 font-semibold">
                    Type
                  </th>
                  <th scope="col" className="px-4 py-3 text-right font-semibold">
                    Prix
                  </th>
                  <th scope="col" className="px-4 py-3 text-center font-semibold">
                    Stock
                  </th>
                  <th scope="col" className="px-4 py-3 text-center font-semibold">
                    Sans gluten
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
                {empanadas.map((empanada, index) => (
                  <tr
                    key={empanada.id}
                    className={`transition hover:bg-secondary/10 ${
                      index % 2 === 1 ? 'bg-primary/[0.03]' : 'bg-surface'
                    }`}
                  >
                    <td className="px-4 py-3 font-medium">
                      {empanada.nom}
                    </td>
                    <td className="px-4 py-3">{empanada.type}</td>
                    <td className="px-4 py-3 text-right font-medium tabular-nums">
                      {empanada.prix.toFixed(2)} €
                    </td>
                    <td className="px-4 py-3 text-center tabular-nums">
                      {empanada.stock}
                    </td>
                    <td className="px-4 py-3 text-center">
                      {empanada.sansGluten ? 'Oui' : 'Non'}
                    </td>
                    <td
                      className="max-w-xs truncate px-4 py-3 opacity-75"
                      title={empanada.image_url || ''}
                    >
                      {empanada.image_url || 'N/A'}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
                          empanada.actif
                            ? 'bg-primary/10 text-primary'
                            : 'bg-secondary/20 text-primary'
                        }`}
                      >
                        {empanada.actif ? 'Actif' : 'Inactif'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => setEditingEmpanada(empanada)}
                          className="rounded-md border border-primary/20 px-3 py-1.5 font-medium text-primary transition hover:bg-primary hover:text-surface focus:outline-none focus:ring-2 focus:ring-primary"
                        >
                          Modifier
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeleteTarget(empanada)}
                          className="rounded-md bg-secondary px-3 py-1.5 font-medium text-primary transition hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-secondary"
                        >
                          Supprimer
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

      {editingEmpanada && (
        <EmpanadaForm
          initialData={editingEmpanada === 'new' ? null : editingEmpanada}
          onSave={handleSave}
          onCancel={() => setEditingEmpanada(null)}
        />
      )}

      {deleteTarget && (
        <ConfirmModal
          message={`Supprimer "${deleteTarget.nom}" ? Cette action est irréversible.`}
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </div>
  </div>
);
}

export default AdminEmpanadas;