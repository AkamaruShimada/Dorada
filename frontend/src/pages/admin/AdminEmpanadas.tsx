// frontend/src/pages/admin/AdminEmpanadas.tsx

import { useEffect, useState } from 'react';
import type { Empanada, EmpanadaPayload } from '../../types/admin.types';
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
    <div className="admin-page">
      <div className="admin-page-header">
        <h1>Gestion des empanadas</h1>
        <button onClick={() => setEditingEmpanada('new')}>
          + Nouvelle empanada
        </button>
      </div>

      {error && <p className="error-banner">{error}</p>}

      <table className="admin-table">
        <thead>
          <tr>
            <th>Nom</th>
            <th>Type</th>
            <th>Prix</th>
            <th>Stock</th>
            <th>Sans gluten</th>
            <th>Actif</th>
            <th>URL de l'image</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {empanadas.map((empanada) => (
            <tr key={empanada.id}>
              <td>{empanada.nom}</td>
              <td>{empanada.type}</td>
              <td>{empanada.prix.toFixed(2)} €</td>
              <td>{empanada.stock}</td>
              <td>{empanada.sansGluten ? 'Oui' : 'Non'}</td>
              <td>{empanada.image_url || 'N/A'}</td>
              <td>
                <span className={empanada.actif ? 'badge-actif' : 'badge-inactif'}>
                  {empanada.actif ? 'Actif' : 'Inactif'}
                </span>
              </td>
              <td>
                <button onClick={() => setEditingEmpanada(empanada)}>
                  Modifier
                </button>
                <button onClick={() => setDeleteTarget(empanada)}>
                  Supprimer
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {empanadas.length === 0 && <p>Aucune empanada enregistrée.</p>}

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
  );
}

export default AdminEmpanadas;