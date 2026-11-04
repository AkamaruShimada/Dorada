// frontend/src/components/admin/RapportModal.tsx

import { Fragment, useEffect, useState } from 'react';
import {
  getRapport,
  telechargerRapportExcel,
  type RapportVentes,
  type TypeRapport,
  type LigneRapport,
  type ParamsPeriode,
  type LigneFormule
} from '../../services/admin/rapport.service';

interface RapportModalProps {
  typeInitial: TypeRapport;
  onClose: () => void;
}

const formatPrix = (n: number) => `${n.toFixed(2)} €`;
const aujourdhui = () => new Date().toLocaleDateString('en-CA'); // YYYY-MM-DD local

const TITRES: Record<TypeRapport, string> = {
  hebdomadaire: 'Rapport hebdomadaire',
  mensuel: 'Rapport mensuel',
  personnalise: 'Rapport personnalisé',
};

function RapportModal({ typeInitial, onClose }: RapportModalProps) {
  const [type, setType] = useState<TypeRapport>(typeInitial);
  const [dateRef, setDateRef] = useState(aujourdhui());
  const [debut, setDebut] = useState(aujourdhui());
  const [fin, setFin] = useState(aujourdhui());
  const [rapport, setRapport] = useState<RapportVentes | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [exporting, setExporting] = useState(false);

  const params = (): ParamsPeriode =>
    type === 'personnalise' ? { debut, fin } : { date: dateRef };

  useEffect(() => {
    if (type === 'personnalise' && (!debut || !fin)) return;
    if (type === 'personnalise' && fin < debut) {
      setError('La date de fin doit être après la date de début');
      setRapport(null);
      return;
    }

    setLoading(true);
    setError(null);
    getRapport(type, params())
      .then(setRapport)
      .catch((err) => setError(err instanceof Error ? err.message : 'Erreur inconnue'))
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type, dateRef, debut, fin]);

  function decaler(sens: -1 | 1) {
    const d = new Date(`${dateRef}T12:00:00`);
    if (type === 'hebdomadaire') d.setDate(d.getDate() + sens * 7);
    else d.setMonth(d.getMonth() + sens);
    setDateRef(d.toLocaleDateString('en-CA'));
  }

  async function exporter() {
    setExporting(true);
    try {
      await telechargerRapportExcel(type, params());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Échec du téléchargement');
    } finally {
      setExporting(false);
    }
  }

  const inputClass =
    'rounded-lg border border-primary/20 bg-surface px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary';
  const boutonClass =
    'rounded-lg border border-primary/20 px-3 py-2 text-sm font-medium transition hover:bg-primary/5 disabled:opacity-50';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-primary/50 p-4" onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="rapport-title"
        onClick={(e) => e.stopPropagation()}
        className="max-h-[90vh] w-full max-w-5xl overflow-y-auto rounded-2xl border border-primary/10 bg-surface p-5 text-primary shadow-2xl sm:p-7"
      >
        {/* Sélecteur de type */}
        <div className="mb-4 inline-flex rounded-lg border border-primary/20 p-1">
          {(['hebdomadaire', 'mensuel', 'personnalise'] as TypeRapport[]).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setType(t)}
              className={`rounded-md px-3 py-1.5 text-sm font-medium transition ${
                type === t ? 'bg-primary text-surface' : 'hover:bg-primary/5'
              }`}
            >
              {t === 'hebdomadaire' ? 'Semaine' : t === 'mensuel' ? 'Mois' : 'Plage libre'}
            </button>
          ))}
        </div>

        <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 id="rapport-title" className="text-2xl font-bold">{TITRES[type]}</h2>
            <p className="mt-1 text-sm opacity-70">{rapport?.periode.label ?? '…'}</p>
          </div>

          {type !== 'personnalise' ? (
            <div className="flex items-center gap-2">
              <button type="button" onClick={() => decaler(-1)} className={boutonClass}>←</button>
              <input
                type={type === 'mensuel' ? 'month' : 'date'}
                value={type === 'mensuel' ? dateRef.slice(0, 7) : dateRef}
                onChange={(e) =>
                  setDateRef(type === 'mensuel' ? `${e.target.value}-01` : e.target.value)
                }
                className={inputClass}
              />
              <button type="button" onClick={() => decaler(1)} className={boutonClass}>→</button>
            </div>
          ) : (
            <div className="flex flex-wrap items-center gap-2">
              <label className="text-sm">
                Du{' '}
                <input type="date" value={debut} onChange={(e) => setDebut(e.target.value)} className={inputClass} />
              </label>
              <label className="text-sm">
                au{' '}
                <input type="date" value={fin} min={debut} onChange={(e) => setFin(e.target.value)} className={inputClass} />
              </label>
              <button
                type="button"
                onClick={() => { setDebut(aujourdhui()); setFin(aujourdhui()); }}
                className={boutonClass}
              >
                Aujourd’hui
              </button>
            </div>
          )}
        </div>

        {error && (
          <div role="alert" className="mb-4 rounded-lg border border-secondary/30 bg-secondary/10 px-4 py-3 text-sm">
            {error}
          </div>
        )}

        {loading && <p className="text-sm opacity-70">Chargement…</p>}

        {rapport && !loading && (
          <div className="space-y-8">
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
              <Carte label="Ventes (quantité)" valeur={String(rapport.global.quantite)} />
              <Carte label="Total HT" valeur={formatPrix(rapport.global.totalHt)} />
              <Carte label="TVA" valeur={formatPrix(rapport.global.totalTva)} />
              <Carte label="Total TTC net" valeur={formatPrix(rapport.global.totalTtc)} />
            </div>

            <TableauLignes titre="Ventes à l’unité" lignes={rapport.unite.lignes} totaux={rapport.unite.totaux} />
            <TableauLignes titre="Ventes de formules" lignes={rapport.formules.lignes} totaux={rapport.formules.totaux} />
          </div>
        )}

        <div className="mt-7 flex items-center justify-between gap-3 border-t border-primary/10 pt-5">
          <button
            type="button"
            onClick={exporter}
            disabled={!rapport || exporting}
            className="rounded-lg bg-primary px-4 py-2.5 font-semibold text-surface transition hover:opacity-90 disabled:opacity-50"
          >
            {exporting ? 'Export…' : 'Télécharger Excel'}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-primary/20 px-4 py-2.5 font-medium transition hover:bg-primary/5"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
}

function Carte({ label, valeur }: { label: string; valeur: string }) {
  return (
    <div className="rounded-xl border border-primary/10 bg-surface p-4 shadow-sm">
      <p className="text-sm opacity-70">{label}</p>
      <p className="mt-1 text-xl font-bold tabular-nums">{valeur}</p>
    </div>
  );
}

function TableauLignes({
  titre,
  lignes,
  totaux,
}: {
  titre: string;
  lignes: LigneRapport[];
  totaux: { quantite: number; totalHt: number; totalTva: number; totalTtc: number };
}) {
  const entetes = ['Produit', 'Qté', 'PU TTC', 'Total HT', 'TVA %', 'Montant TVA', 'Total TTC', 'Paiement'];

  return (
    <section>
      <h3 className="mb-3 text-lg font-semibold">{titre}</h3>
      {lignes.length === 0 ? (
        <p className="text-sm opacity-70">Aucune vente sur cette période.</p>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-primary/10 shadow-sm">
          <table className="w-full text-sm">
            <thead className="bg-primary text-left text-surface">
              <tr>
                {entetes.map((h) => (
                  <th key={h} className="whitespace-nowrap px-4 py-3 font-semibold">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
            {lignes.map((l, i) => (
                <Fragment key={i}>
                <tr className="border-t border-primary/10 odd:bg-primary/[0.03]">
                    <td className="px-4 py-3 font-medium">{l.produit}</td>
                    <td className="px-4 py-3 tabular-nums">{l.quantite}</td>
                    <td className="px-4 py-3 tabular-nums">{formatPrix(l.prixUnitaireTtc)}</td>
                    <td className="px-4 py-3 tabular-nums">{formatPrix(l.totalHt)}</td>
                    <td className="px-4 py-3 tabular-nums">
                    {l.tauxTva !== null ? `${l.tauxTva}%` : '—'}
                    </td>
                    <td className="px-4 py-3 tabular-nums">{formatPrix(l.montantTva)}</td>
                    <td className="px-4 py-3 font-semibold tabular-nums">{formatPrix(l.totalTtc)}</td>
                    <td className="px-4 py-3">{l.moyenPaiement}</td>
                </tr>

                {'detail' in l &&
                    (l as LigneFormule).detail.map((d) => (
                    <tr
                        key={`${i}-${d.produit}-${d.tauxTva}`}
                        className="bg-primary/[0.03] text-xs"
                    >
                        <td className="px-8 py-2">↳ {d.produit}</td>
                        <td className="px-4 py-2 tabular-nums">{d.quantite}</td>
                        <td className="px-4 py-2" />
                        <td className="px-4 py-2 tabular-nums">{formatPrix(d.totalHt)}</td>
                        <td className="px-4 py-2 tabular-nums">{d.tauxTva}%</td>
                        <td className="px-4 py-2 tabular-nums">{formatPrix(d.montantTva)}</td>
                        <td className="px-4 py-2 tabular-nums">{formatPrix(d.totalTtc)}</td>
                        <td className="px-4 py-2" />
                    </tr>
                    ))}
                </Fragment>
            ))}
            </tbody>
            <tfoot className="border-t-2 border-primary/20 font-bold">
              <tr>
                <td className="px-4 py-3">Total</td>
                <td className="px-4 py-3 tabular-nums">{totaux.quantite}</td>
                <td className="px-4 py-3" />
                <td className="px-4 py-3 tabular-nums">{formatPrix(totaux.totalHt)}</td>
                <td className="px-4 py-3" />
                <td className="px-4 py-3 tabular-nums">{formatPrix(totaux.totalTva)}</td>
                <td className="px-4 py-3 tabular-nums">{formatPrix(totaux.totalTtc)}</td>
                <td className="px-4 py-3" />
              </tr>
            </tfoot>
          </table>
        </div>
      )}
    </section>
  );
}

export default RapportModal;