// components/menu/FormulesSection.tsx

import { useState } from 'react';
import type { Empanada, Extra, Boisson, Formule } from '../../types/admin.types';
import { stockRestant, type Categorie, type Reservations } from '../../utils/stock';

type FormuleSelection = {
  formule: Formule;
  empanadas: Empanada[];
  extras: Extra[];
  boissons: Boisson[];
};

type FormuleSectionProps = {
  formules: Formule[];
  empanadas: Empanada[];
  extras: Extra[];
  boissons: Boisson[];
  stocks: Record<Categorie, number>;
  reservations: Reservations;
  quantiteDansPanier: (id: number) => number;
  onAdd: (selection: FormuleSelection) => void;
};

type Disponibilite = {
  disponible: boolean;
  manques: string[];
};

function verifierDisponibiliteFormule(
  formule: Formule,
  stocks: Record<Categorie, number>,
): Disponibilite {
  const besoins: Record<Categorie, number> = {
    empanadas: formule.nombreEmpanadas,
    extras: formule.nombreExtras,
    boissons: formule.nombreBoissons,
  };

  const manques = (Object.keys(besoins) as Categorie[])
    .filter((cat) => besoins[cat] > stocks[cat])
    .map((cat) => `${cat} (${stocks[cat]}/${besoins[cat]})`);

  return { disponible: manques.length === 0, manques };
}

function FormuleSection({ 
  formules,
  empanadas, 
  extras, 
  boissons,
  stocks,
  reservations, 
  quantiteDansPanier,
  onAdd }: FormuleSectionProps) {
  const [formuleEnCours, setFormuleEnCours] = useState<Formule | null>(null);
  const [empanadasChoisies, setEmpanadasChoisies] = useState<number[]>([]);
  const [extrasChoisis, setExtrasChoisis] = useState<number[]>([]);
  const [boissonsChoisies, setBoissonsChoisies] = useState<number[]>([]);

  if (formules.length === 0) return null;

  const empanadasDisponibles = empanadas.filter((p) => p.actif);
  const extrasDisponibles = extras.filter((p) => p.actif);
  const boissonsDisponibles = boissons.filter((p) => p.actif);

  function ouvrirModal(formule: Formule) {
    const dispo = verifierDisponibiliteFormule(formule, stocks);
    if (!formule.actif || !dispo.disponible) return;
    
    setFormuleEnCours(formule);
    setEmpanadasChoisies(Array(formule.nombreEmpanadas).fill(0));
    setExtrasChoisis(Array(formule.nombreExtras).fill(0));
    setBoissonsChoisies(Array(formule.nombreBoissons).fill(0));
  }

  function fermerModal() {
    setFormuleEnCours(null);
    setEmpanadasChoisies([]);
    setExtrasChoisis([]);
    setBoissonsChoisies([]);
  }

  function selectionComplete() {
    return empanadasChoisies.every((id) => id !== 0) && extrasChoisis.every((id) => id !== 0) && boissonsChoisies.every((id) => id !== 0);
  }

  function confirmerSelection() {
    if (!formuleEnCours || !selectionComplete()) return;

    // Le panier a pu changer pendant que la modale était ouverte
    const dispo = verifierDisponibiliteFormule(formuleEnCours, stocks);
    if (!dispo.disponible) {
      fermerModal();
      return;
    }

    onAdd({
      formule: formuleEnCours,
      empanadas: empanadasChoisies.map((id) => empanadasDisponibles.find((p) => p.id === id)!),
      extras: extrasChoisis.map((id) => extrasDisponibles.find((p) => p.id === id)!),
      boissons: boissonsChoisies.map((id) => boissonsDisponibles.find((p) => p.id === id)!),
    });

    fermerModal();
  }

  /** Restant d'un produit pour un select donné : stock - panier - autres choix de la modale */
  function restantPourChoix(
    produit: { id: number; stock: number; actif: boolean },
    cat: Categorie,
    reservations: Reservations,
    choixModale: number[],
    indexExclu: number,
  ): number {
    const base = stockRestant(produit, cat, reservations);
    const dejaModale = choixModale.filter((id, i) => id === produit.id && i !== indexExclu).length;
    return Math.max(base - dejaModale, 0);
  }

  return (
    <>
      <section aria-labelledby="section-formules">
        <h2 id="section-formules" className="mb-4 text-xl font-bold">
          Nos formules
        </h2>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {formules.map((formule) => {
            const dispo = verifierDisponibiliteFormule(
              formule,
              stocks,
            );
            return (
              <FormuleCard
              key={formule.id}
              formule={formule}
              disponibilite={dispo}
              quantiteDansPanier={quantiteDansPanier(formule.id)}
              onAdd={() => ouvrirModal(formule)}
              />
            )
          })}
        </div>
      </section>

      {formuleEnCours && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-primary/50 p-4 m-0"
          role="presentation"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) fermerModal();
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="formule-modal-title"
            className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-primary/10 bg-surface p-6 text-primary shadow-2xl"
          >
            <h2 id="formule-modal-title" className="text-xl font-bold">
              Composer : {formuleEnCours.nom}
            </h2>

            {empanadasChoisies.map((choix, index) => (
              <label key={`empanada-${index}`} className="mt-4 block text-sm font-medium">
                Empanada {index + 1}
                <select
                  className={selectClass}
                  value={choix}
                  onChange={(e) => {
                    const next = [...empanadasChoisies];
                    next[index] = Number(e.target.value);
                    setEmpanadasChoisies(next);
                  }}
                >
                  <option value={0}>Choisir une empanada</option>
                  {empanadasDisponibles
                  .map((p) => ({
                    p,
                    restant: restantPourChoix(p, 'empanadas', reservations, empanadasChoisies, index),
                  }))
                  .filter(({ restant }) => restant > 0)
                  .map(({ p, restant }) => (
                    <option key={p.id} value={p.id}>
                      {p.nom} ({restant} restant(s)) {p.supplementFormuleTtc ? `(+${p.supplementFormuleTtc.toFixed(2)} €)` : ''}
                    </option>
                  ))}
                </select>
              </label>
            ))}

            {extrasChoisis.map((choix, index) => (
              <label key={`extra-${index}`} className="mt-4 block text-sm font-medium">
                Extra {index + 1}
                <select
                  className={selectClass}
                  value={choix}
                  onChange={(e) => {
                    const next = [...extrasChoisis];
                    next[index] = Number(e.target.value);
                    setExtrasChoisis(next);
                  }}
                >
                  <option value={0}>Choisir un extra</option>
                  {extrasDisponibles
                  .map((p) => ({
                    p,
                    restant: restantPourChoix(p, 'extras', reservations, extrasChoisis, index),
                  }))
                  .filter(({ restant }) => restant > 0)
                  .map(({ p, restant }) => (
                    <option key={p.id} value={p.id}>
                      {p.nom} ({restant} restant(s)) {p.supplementFormuleTtc ? `(+${p.supplementFormuleTtc.toFixed(2)} €)` : ''}
                    </option>
                  ))}
                </select>
              </label>
            ))}

            {boissonsChoisies.map((choix, index) => (
              <label key={`boisson-${index}`} className="mt-4 block text-sm font-medium">
                Boisson {index + 1}
                <select
                  className={selectClass}
                  value={choix}
                  onChange={(e) => {
                    const next = [...boissonsChoisies];
                    next[index] = Number(e.target.value);
                    setBoissonsChoisies(next);
                  }}
                >
                  <option value={0}>Choisir une boisson</option>
                  {boissonsDisponibles
                    .map((p) => ({
                      p,
                      restant: restantPourChoix(p, 'boissons', reservations, boissonsChoisies, index),
                    }))
                    .filter(({ restant }) => restant > 0)
                    .map(({ p, restant }) => (
                      <option key={p.id} value={p.id}>
                        {p.nom} ({restant} restant(s)) {p.supplementFormuleTtc ? `(+${p.supplementFormuleTtc.toFixed(2)} €)` : ''}

                      </option>
                    ))}
                </select>
              </label>
            ))}

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={fermerModal}
                className="rounded-lg border border-primary/20 px-4 py-2.5 font-medium transition hover:bg-primary/5"
              >
                Annuler
              </button>

              <button
                type="button"
                onClick={confirmerSelection}
                disabled={!selectionComplete()}
                className="rounded-lg bg-primary px-4 py-2.5 font-semibold text-surface transition hover:opacity-90 disabled:opacity-40"
              >
                Ajouter au panier
              </button>
            </div>
          </section>
        </div>
      )}
    </>
  );
}

const selectClass =
  'mt-1 w-full rounded-lg border border-primary/20 bg-surface px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary';

type FormuleCardProps = {
  formule: Formule;
  disponibilite: Disponibilite;
  quantiteDansPanier: number;
  onAdd: () => void;
};

function FormuleCard({ 
  formule, 
  disponibilite, 
  quantiteDansPanier,
  onAdd 
}: FormuleCardProps) {
  const indisponible = !formule.actif || !disponibilite.disponible;
  const motif = !formule.actif 
    ? 'Formule désactivée'
    : `Stock insuffisant : ${disponibilite.manques.join(', ')}`;

  return (
    <article className="flex flex-col overflow-hidden rounded-xl border border-primary/10 bg-surface shadow-sm">
      <div className="relative aspect-[4/3] bg-primary/5">
        <img
          src={formule.image_url || 'https://placehold.co/800x600?text=Formule'}
          alt={formule.nom}
          className="h-full w-full object-cover"
        />
        <span className="absolute left-2 top-2 rounded-full bg-surface px-2.5 py-0.5 text-xs font-semibold text-primary shadow">
          Formule
        </span>
        {indisponible && (
          <span className="absolute inset-0 flex items-center justify-center bg-surface/70 font-semibold">
            Indisponible
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <h3 className="font-bold">{formule.nom}</h3>
        <p className="line-clamp-2 text-sm opacity-70">{formule.description}</p>

        {indisponible && (
          <p role="status" className="text-xs font-medium text-red-600">
            {motif}
          </p>
        )}

        <div className="mt-auto flex items-center justify-between pt-3">
          <span className="font-semibold tabular-nums">
            {Number(formule.prixTtc).toFixed(2)} €
          </span>

          <button
            type="button"
            onClick={onAdd}
            disabled={indisponible}
            className="rounded-lg bg-primary px-3 py-2 text-sm font-semibold text-surface transition hover:opacity-90 disabled:opacity-40"
          >
            {quantiteDansPanier > 0 ? `Ajouté (${quantiteDansPanier})` : 'Ajouter'}
          </button>
        </div>
      </div>
    </article>
  );
}

export default FormuleSection;