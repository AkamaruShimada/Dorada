// components/menu/FormulesSection.tsx

import { useState } from 'react';
import type { Empanada, Extra, Formule } from '../../types/admin.types';

type FormuleSelection = {
  formule: Formule;
  empanadas: Empanada[];
  extras: Extra[];
};

type FormuleSectionProps = {
  formules: Formule[];
  empanadas: Empanada[];
  extras: Extra[];
  onAdd: (selection: FormuleSelection) => void;
};

function FormuleSection({
  formules,
  empanadas,
  extras,
  onAdd,
}: FormuleSectionProps) {
  const [formuleEnCours, setFormuleEnCours] = useState<Formule | null>(null);
  const [empanadasChoisies, setEmpanadasChoisies] = useState<number[]>([]);
  const [extrasChoisis, setExtrasChoisis] = useState<number[]>([]);

  if (formules.length === 0) return null;

  const empanadasDisponibles = empanadas.filter(
    (produit) => produit.actif && produit.stock > 0,
  );

  const extrasDisponibles = extras.filter(
    (produit) => produit.actif && produit.stock > 0,
  );

  function ouvrirModal(formule: Formule) {
    setFormuleEnCours(formule);
    setEmpanadasChoisies(Array(formule.nombreEmpanadas).fill(0));
    setExtrasChoisis(Array(formule.nombreExtras).fill(0));
  }

  function fermerModal() {
    setFormuleEnCours(null);
    setEmpanadasChoisies([]);
    setExtrasChoisis([]);
  }

  function selectionComplete() {
    return (
      empanadasChoisies.every((id) => id !== 0) &&
      extrasChoisis.every((id) => id !== 0)
    );
  }

  function confirmerSelection() {
    if (!formuleEnCours || !selectionComplete()) return;

    const empanadasSelectionnees = empanadasChoisies.map(
      (id) => empanadasDisponibles.find((produit) => produit.id === id)!,
    );

    const extrasSelectionnes = extrasChoisis.map(
      (id) => extrasDisponibles.find((produit) => produit.id === id)!,
    );

    onAdd({
      formule: formuleEnCours,
      empanadas: empanadasSelectionnees,
      extras: extrasSelectionnes,
    });

    fermerModal();
  }

  return (
    <>
      <section aria-labelledby="section-formules">
        <h2 id="section-formules" className="mb-4 text-xl font-bold">
          Nos formules
        </h2>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {formules.map((formule) => (
            <article key={formule.id} className="rounded-lg bg-white p-4 shadow">
              {formule.image_url && (
                <img
                  src={formule.image_url}
                  alt={formule.nom}
                  className="mb-3 aspect-video w-full rounded object-cover"
                />
              )}

              <h3 className="text-lg font-semibold">{formule.nom}</h3>
              <p>{formule.description}</p>
              <p className="mt-2 font-bold">
                {Number(formule.prixTtc).toFixed(2)} €
              </p>

              <p className="mt-1 text-sm">
                {formule.nombreEmpanadas} empanada(s)
                {formule.nombreExtras > 0 &&
                  ` et ${formule.nombreExtras} extra(s)`}
              </p>

              <button
                type="button"
                className="mt-4 rounded bg-primary px-4 py-2 text-white disabled:opacity-50"
                disabled={!formule.actif}
                onClick={() => ouvrirModal(formule)}
              >
                Choisir
              </button>
            </article>
          ))}
        </div>
      </section>

      {formuleEnCours && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) fermerModal();
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="formule-modal-title"
            className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-xl bg-white p-6"
          >
            <h2 id="formule-modal-title" className="text-xl font-bold">
              Composer : {formuleEnCours.nom}
            </h2>

            {empanadasChoisies.map((choix, index) => (
              <label key={`empanada-${index}`} className="mt-4 block">
                Empanada {index + 1}
                <select
                  className="mt-1 w-full rounded border p-2"
                  value={choix}
                  onChange={(event) => {
                    const nouvelleSelection = [...empanadasChoisies];
                    nouvelleSelection[index] = Number(event.target.value);
                    setEmpanadasChoisies(nouvelleSelection);
                  }}
                >
                  <option value={0}>Choisir une empanada</option>
                  {empanadasDisponibles.map((produit) => (
                    <option key={produit.id} value={produit.id}>
                      {produit.nom}
                    </option>
                  ))}
                </select>
              </label>
            ))}

            {extrasChoisis.map((choix, index) => (
              <label key={`extra-${index}`} className="mt-4 block">
                Extra {index + 1}
                <select
                  className="mt-1 w-full rounded border p-2"
                  value={choix}
                  onChange={(event) => {
                    const nouvelleSelection = [...extrasChoisis];
                    nouvelleSelection[index] = Number(event.target.value);
                    setExtrasChoisis(nouvelleSelection);
                  }}
                >
                  <option value={0}>Choisir un extra</option>
                  {extrasDisponibles.map((produit) => (
                    <option key={produit.id} value={produit.id}>
                      {produit.nom}
                    </option>
                  ))}
                </select>
              </label>
            ))}

            <div className="mt-6 flex justify-end gap-3">
              <button type="button" onClick={fermerModal}>
                Annuler
              </button>

              <button
                type="button"
                className="rounded bg-primary px-4 py-2 text-white disabled:opacity-50"
                disabled={!selectionComplete()}
                onClick={confirmerSelection}
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

export default FormuleSection;