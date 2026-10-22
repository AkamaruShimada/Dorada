// frontend/src/components/admin/CommandeDetailModal.tsx

import type { Commande, LigneCommande } from '../../types/admin.types';
import { formatPrix } from '../../utils/pricing';

interface CommandeDetailModalProps {
  commande: Commande;
  statutLabel: string;
  onClose: () => void;
  onRefund: () => void;
  onCancel: () => void;
}

function Lignes({ titre, lignes }: { titre: string; lignes: LigneCommande[] }) {
  if (lignes.length === 0) return null;
  return (
    <div>
      <h3 className="mb-2 text-sm font-semibold">{titre}</h3>
      <ul className="divide-y divide-primary/10 rounded-lg border border-primary/10">
        {lignes.filter((l) => l.commandeFormuleId == null).map((l) => (
          <li key={l.id} className="flex justify-between gap-4 px-3 py-2 text-sm">
            <span>
              {l.quantite} × {l.nomFige}
            </span>
            <span className="tabular-nums">
              {formatPrix(l.totalTtc)}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function CommandeDetailModal({
  commande,
  statutLabel,
  onClose,
  onRefund,
  onCancel,
}: CommandeDetailModalProps) {
  const totalRembourse = commande.remboursements
    .filter((r) => r.statut === 'REUSSI')
    .reduce((somme, r) => somme + r.montant, 0);

  // Le bouton rembourser n'a de sens que si la commande a été payée et qu'il reste du solde
  const peutRembourser =
    ['VALIDEE', 'RECUPEREE'].includes(commande.statut) && totalRembourse < commande.totalTtc;
  const peutAnnuler = commande.statut === 'VALIDEE';

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-primary/50 p-4"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="commande-detail-title"
        onClick={(e) => e.stopPropagation()}
        className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-primary/10 bg-surface p-5 text-primary shadow-2xl sm:p-7"
      >
        <div className="mb-6">
          <h2 id="commande-detail-title" className="text-2xl font-bold">
            Commande {commande.reference}
          </h2>
          <p className="mt-1 text-sm opacity-70">Statut : {statutLabel}</p>
        </div>

        <div className="space-y-5">
          <div className="grid grid-cols-1 gap-3 rounded-lg bg-primary/5 p-4 text-sm sm:grid-cols-2">
            <div>
              <p className="font-semibold">Client</p>
              <p>{commande.clientNom}</p>
              <p>{commande.clientEmail}</p>
              <p>{commande.clientTelephone}</p>
            </div>
            <div>
              <p className="font-semibold">
                {commande.modeRecuperation === 'LIVRAISON' ? 'Livraison' : 'Retrait'}
              </p>
              <p>{new Date(commande.dateSouhaitee).toLocaleString('fr-FR')}</p>
              {commande.adresseLivraison && <p>{commande.adresseLivraison}</p>}
            </div>
          </div>

          <Lignes titre="Empanadas" lignes={commande.empanadas} />
          <Lignes titre="Extras" lignes={commande.extras} />

          {commande.formules.map((f) => (
            <div key={f.id} className="rounded-lg border border-primary/10 p-3">
              <div className="flex justify-between gap-4 text-sm font-semibold">
                <span>{f.quantite} × {f.nomFige}</span>
                <span className="tabular-nums">{formatPrix(f.totalTtc)}</span>
              </div>
              <ul className="mt-2 space-y-1 pl-3 text-sm opacity-80">
                {[...f.empanadasChoisies, ...f.extrasChoisies].map((l) => (
                  <li key={`${l.empanada ? 'emp' : 'ext'}-${l.id}`}>
                    <div className="flex justify-between gap-4 text-sm">
                      <span>{l.quantite} × {l.nomFige}</span>
                      <span className="tabular-nums">{formatPrix(l.totalTtc)} TTC</span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div className="space-y-1 text-right text-sm">
            {commande.remiseTtc > 0 && (
              <>
                <p className="opacity-70">
                  Sous-total TTC : {formatPrix(commande.totalTtc + commande.remiseTtc)}
                </p>
                <p className="font-medium">
                  Code promo {commande.codePromoFige}
                  {commande.remisePourcent !== null && ` (-${commande.remisePourcent}%)`} :{' '}
                  <span className="tabular-nums">-{formatPrix(commande.remiseTtc)}</span>
                </p>
              </>
            )}
            <p className="opacity-70">Total HT : {formatPrix(commande.totalHt)}</p>
            <p className="opacity-70">TVA : {formatPrix(commande.totalTva)}</p>
            <p className="text-base font-bold">Total TTC : {formatPrix(commande.totalTtc)}</p>
          </div>

          {commande.remboursements.length > 0 && (
            <div>
              <h3 className="mb-2 text-sm font-semibold">Remboursements</h3>
              <ul className="divide-y divide-primary/10 rounded-lg border border-primary/10">
                {commande.remboursements.map((r) => (
                  <li key={r.id} className="px-3 py-2 text-sm">
                    <div className="flex justify-between gap-4">
                      <span>
                        {formatPrix(r.montant)} : {r.statut}
                      </span>
                      <span className="opacity-70">
                        {new Date(r.traiteLe ?? r.creeLe).toLocaleDateString('fr-FR')}
                      </span>
                    </div>
                    <p className="text-xs opacity-70">
                      {r.motif} par {r.demandeParNom}
                      {r.commentaire && ` : ${r.commentaire}`}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="mt-7 flex flex-col-reverse gap-3 border-t border-primary/10 pt-5 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-primary/20 px-4 py-2.5 font-medium transition hover:bg-primary/5 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
          >
            Fermer
          </button>

          {peutAnnuler && (
            <button
              type="button"
              onClick={onCancel}
              className="rounded-lg border border-primary/20 px-4 py-2.5 font-medium transition hover:bg-primary/5 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            >
              Annuler la commande
            </button>
          )}

          {peutRembourser && (
            <button
              type="button"
              onClick={onRefund}
              className="rounded-lg bg-secondary px-4 py-2.5 font-semibold text-primary shadow-sm transition hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-offset-2"
            >
              Rembourser
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default CommandeDetailModal;