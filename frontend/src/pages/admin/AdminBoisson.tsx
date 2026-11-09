// frontend/src/pages/admin/AdminBoissons.tsx

import { useEffect, useState } from 'react';
import type { Boisson } from '../../types/admin.types';
import {
  getAllBoissons,
  createBoisson,
  updateBoisson,
  deleteBoisson,
} from '../../services/admin/boisson.service';
import BoissonForm from '../../components/admin/BoissonForm';
import ConfirmModal from '../../components/admin/ConfirmModal';
import { calculerTtc, formatPrix } from '../../utils/pricing';

function AdminBoissons() {
  const [boissons, setBoissons] = useState<Boisson[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // État du formulaire (null = fermé, Boisson = édition, 'new' = création)
  const [editingBoisson, setEditingBoisson] = useState<Boisson | 'new' | null>(null);

  // État de la modal de confirmation de suppression
  const [deleteTarget, setDeleteTarget] = useState<Boisson | null>(null);

  useEffect(() => {
    loadBoissons();
  }, []);

  async function loadBoissons() {
    try {
      setIsLoading(true);
      setError(null);
      const data = await getAllBoissons();
      setBoissons(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
    } finally {
      setIsLoading(false);
    }
  }

  async function handleSave(formData: FormData) {
    try {
      if (editingBoisson === 'new') {
        await createBoisson(formData);
      } else if (editingBoisson) {
        await updateBoisson(editingBoisson.id, formData);
      }
      setEditingBoisson(null);
      await loadBoissons(); // on recharge la liste après modification
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la sauvegarde');
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return;

    try {
      await deleteBoisson(deleteTarget.id);
      setDeleteTarget(null);
      await loadBoissons();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la suppression');
    }
  }

  if (isLoading) return <p>Chargement des boissons...</p>;

  return (
  <div className="min-h-screen bg-surface p-4 text-primary sm:p-6">
    <div className="mx-auto max-w-7xl">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Gestion des boissons
          </h1>
          <p className="mt-1 text-sm opacity-70">
            Consulte et gère les produits de ta boutique.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setEditingBoisson('new')}
          className="inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2.5 font-semibold text-surface shadow-sm transition hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
        >
          + Nouvelle boisson
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

      {boissons.length === 0 ? (
        <div className="rounded-xl border border-primary/10 bg-surface px-6 py-12 text-center shadow-sm">
          <p className="font-medium">Aucune boisson enregistré.</p>
          <p className="mt-1 text-sm opacity-70">
            Ajoute une boisson pour la voir apparaître ici.
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
                  <th scope="col" className="px-4 py-3 text-right font-semibold">
                    Prix HT
                  </th>
                  <th scope="col" className="px-4 py-3 text-right font-semibold">
                    Taux TVA
                  </th>
                  <th scope="col" className="px-4 py-3 text-right font-semibold">
                    Prix TTC
                  </th>
                  <th scope="col" className="px-4 py-3 text-right font-semibold">
                    Supplément Formule TTC
                  </th>
                  <th scope="col" className="px-4 py-3 text-center font-semibold">
                    Stock
                  </th>
                  <th scope="col" className="px-4 py-3 text-center font-semibold">
                    Alcoolisée
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
                {boissons.map((boisson, index) => (
                  <tr
                    key={boisson.id}
                    className={`transition hover:bg-secondary/10 ${
                      index % 2 === 1 ? 'bg-primary/[0.03]' : 'bg-surface'
                    }`}
                  >
                    <td className="px-4 py-3 font-medium">
                      {boisson.nom}
                    </td>
                    <td className="px-4 py-3 text-right font-medium tabular-nums">
                      {formatPrix(boisson.prixHt)}
                    </td>
                    <td className="px-4 py-3 text-right font-medium tabular-nums">
                      {boisson.tauxTva} %
                    </td>
                    <td className="px-4 py-3 text-right font-medium tabular-nums">
                      {formatPrix(calculerTtc(boisson.prixHt, boisson.tauxTva))}
                    </td>
                    <td className="px-4 py-3 text-right font-medium tabular-nums">
                      {"+" + formatPrix(boisson.supplementFormuleTtc)}
                    </td>
                    <td className="px-4 py-3 text-center tabular-nums">
                      {boisson.stock}
                    </td>
                    <td className="px-4 py-3 text-center">
                      {boisson.alcool ? 'Oui' : 'Non'}
                    </td>
                    <td
                      className="max-w-xs truncate px-4 py-3 opacity-75"
                      title={boisson.image_url || ''}
                    >
                      {boisson.image_url || 'N/A'}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
                          boisson.actif
                            ? 'bg-primary/10 text-primary'
                            : 'bg-secondary/20 text-primary'
                        }`}
                      >
                        {boisson.actif ? 'Actif' : 'Inactif'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => setEditingBoisson(boisson)}
                          className="rounded-md border border-primary/20 px-3 py-1.5 font-medium text-primary transition hover:bg-primary hover:text-surface focus:outline-none focus:ring-2 focus:ring-primary"
                        >
                          Modifier
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeleteTarget(boisson)}
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

      {editingBoisson && (
        <BoissonForm
          initialData={editingBoisson === 'new' ? null : editingBoisson}
          onSave={handleSave}
          onCancel={() => setEditingBoisson(null)}
        />
      )}

      {deleteTarget && (
        <ConfirmModal
          title='Confirmer la désactivation'
          message={`Désactiver "${deleteTarget.nom}" ? Celui-ci sera notifié comme indisponible au client.`}
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </div>
  </div>
);
}

export default AdminBoissons;