// frontend/src/components/admin/RemboursementModal.tsx

import { useState } from 'react';
import type { Commande, MotifRemboursement } from '../../types/admin.types';
import { rembourserCommande } from '../../services/admin/commande.service';

interface RemboursementModalProps {
  commande: Commande;
  onDone: () => void;
  onCancel: () => void;
}

function RemboursementModal({ commande, onDone, onCancel }: RemboursementModalProps) {
  // Solde restant : total moins ce qui est déjà remboursé ou en cours
  const dejaReserve = commande.remboursements
    .filter((r) => r.statut !== 'ECHOUE')
    .reduce((somme, r) => somme + r.montant, 0);
  const reste = Math.round((commande.totalTtc - dejaReserve) * 100) / 100;

  const [montant, setMontant] = useState(reste.toFixed(2));
  const [motif, setMotif] = useState<MotifRemboursement>('STOCK_INSUFFISANT');
  const [commentaire, setCommentaire] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (isSubmitting) return; // garde-fou contre le double-clic
    if (!commentaire.trim()) {
      setError('Le commentaire est obligatoire');
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);
      await rembourserCommande(commande.id, {
        montant: Number(montant),
        motif,
        commentaire: commentaire.trim(),
      });
      onDone();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors du remboursement');
      setIsSubmitting(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-primary/50 p-4"
      onClick={onCancel}
    >
      <form
        role="dialog"
        aria-modal="true"
        aria-labelledby="refund-title"
        onSubmit={handleSubmit}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md rounded-2xl border border-primary/10 bg-surface p-6 text-primary shadow-2xl"
      >
        <h2 id="refund-title" className="text-xl font-bold">
          Rembourser {commande.reference}
        </h2>
        <p className="mt-1 text-sm opacity-70">
          Maximum remboursable : {reste.toFixed(2)} €
        </p>

        {error && (
          <div
            role="alert"
            className="mt-4 rounded-lg border border-secondary/30 bg-secondary/10 px-4 py-3 text-sm"
          >
            {error}
          </div>
        )}

        <div className="mt-5 space-y-4">
          <div>
            <label htmlFor="refund-montant" className="mb-1.5 block text-sm font-semibold">
              Montant (€)
            </label>
            <input
              id="refund-montant"
              type="number"
              step="0.01"
              min="0.01"
              max={reste}
              value={montant}
              onChange={(e) => setMontant(e.target.value)}
              required
              className="w-full rounded-lg border border-primary/20 bg-surface px-3 py-2.5 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <div>
            <label htmlFor="refund-motif" className="mb-1.5 block text-sm font-semibold">
              Motif
            </label>

            
            <select
              id="refund-motif"
              value={motif}
              onChange={(e) => setMotif(e.target.value as MotifRemboursement)}
              className="w-full rounded-lg border border-primary/20 bg-surface px-3 py-2.5 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
            >
              <option value="STOCK_INSUFFISANT">Rupture de stock</option>
              <option value="CAPACITE_DEPASSEE">Capacité dépassée</option>
              <option value="ERREUR_COMMANDE">Erreur de commande</option>
              <option value="GESTE_COMMERCIAL">Geste Commercial</option>
              <option value="AUTRE">Autre</option>
            </select>
          </div>


          <div>
            <label htmlFor="refund-commentaire" className="mb-1.5 block text-sm font-semibold">
              Commentaire
            </label>
            <textarea
              id="refund-commentaire"
              value={commentaire}
              onChange={(e) => setCommentaire(e.target.value)}
              rows={3}
              required
              maxLength={500}
              className="w-full resize-y rounded-lg border border-primary/20 bg-surface px-3 py-2.5 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </div>
        </div>

        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onCancel}
            disabled={isSubmitting}
            className="rounded-lg border border-primary/20 px-4 py-2.5 font-medium transition hover:bg-primary/5 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50"
          >
            Annuler
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-lg bg-secondary px-4 py-2.5 font-semibold text-primary shadow-sm transition hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-offset-2 disabled:opacity-50"
          >
            {isSubmitting ? 'Remboursement...' : 'Confirmer le remboursement'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default RemboursementModal;