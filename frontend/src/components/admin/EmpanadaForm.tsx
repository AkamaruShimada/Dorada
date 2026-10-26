// frontend/src/components/admin/EmpanadaForm.tsx

import { useRef, useState } from 'react';
import type { Empanada, TypeEmpanada } from '../../types/admin.types';
import { usePrice } from '../../hooks/usePrice';

interface EmpanadaFormProps {
  initialData: Empanada | null; // null = mode création
  onSave: (formData: FormData) => void;
  onCancel: () => void;
}

type ImageEtat =
  | { type: 'inchangee' }              // on garde l'image actuelle (ou aucune)
  | { type: 'nouvelle'; file: File }   // nouveau fichier choisi
  | { type: 'supprimee' };             // l'utilisateur a retiré l'image

function EmpanadaForm({ initialData, onSave, onCancel }: EmpanadaFormProps) {
  const [nom, setNom] = useState(initialData?.nom ?? '');
  const [description, setDescription] = useState(initialData?.description ?? '');
  const {
    prixHt,
    tauxTva,
    prixHtTexte,
    prixTtcTexte,
    tauxTvaTexte,
    handlePrixHtChange,
    handlePrixTtcChange,
    handleTauxTvaChange,
  } = usePrice(initialData);
  const [type, setType] = useState<TypeEmpanada>(initialData?.type ?? 'SALEE');
  const [sansGluten, setSansGluten] = useState(initialData?.sansGluten ?? false);
  const [stock, setStock] = useState(initialData?.stock ?? 0);
  const [actif, setActif] = useState(initialData?.actif ?? true);

  const [imageEtat, setImageEtat] = useState<ImageEtat>({ type: 'inchangee' });
  const [imagePreview, setImagePreview] = useState<string | null>(
    initialData?.image_url ?? null,
  );
  const imageInputRef = useRef<HTMLInputElement>(null);

function handleImageChange(event: React.ChangeEvent<HTMLInputElement>) {
  const file = event.target.files?.[0];
  if (!file) return;

  setImageEtat({ type: 'nouvelle', file });
  setImagePreview(URL.createObjectURL(file)); // aperçu local immédiat
}

function handleRemoveImage() {
  setImageEtat({ type: 'supprimee' });
  setImagePreview(null);

    // Permet de sélectionner à nouveau le même fichier ensuite.
  if (imageInputRef.current) {
    imageInputRef.current.value = '';
  }
}

function handleSubmit(event: React.SubmitEvent) {
  event.preventDefault();

    if (prixHt === null || tauxTva === null) {
      Error('Le prix HT et le taux de TVA sont obligatoires.'); // adapte à ton état d'erreur
      return;
    }

  const formData = new FormData();
  formData.append('nom', nom);
  formData.append('description', description);
  formData.append('prixHt', prixHt.toString());
  formData.append('tauxTva', tauxTva.toString())
  formData.append('type', type);
  formData.append('sansGluten', sansGluten.toString());
  formData.append('stock', stock.toString());
  formData.append('actif', actif.toString());
  
  switch (imageEtat.type) {
    case 'nouvelle':
      formData.append('image', imageEtat.file);
      break;
    case 'supprimee':
      formData.append('removeImage', 'true');
      break;
    case 'inchangee':
      // Rien à envoyer : le backend conserve l'image existante
      break;
  }
  
  onSave(formData); // le type change : FormData au lieu de EmpanadaPayload
}

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-primary/50 p-4"
      onClick={onCancel}
    >
      <form
        role="dialog"
        aria-modal="true"
        aria-labelledby="empanada-form-title"
        onSubmit={handleSubmit}
        onClick={(event) => event.stopPropagation()}
        className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-primary/10 bg-surface p-5 text-primary shadow-2xl sm:p-7"
      >
        <div className="mb-6">
          <h2
            id="empanada-form-title"
            className="text-2xl font-bold"
          >
            {initialData ? 'Modifier' : 'Créer'} une empanada
          </h2>
          <p className="mt-1 text-sm opacity-70">
            Renseigne les informations du produit ci-dessous.
          </p>
        </div>

        <div className="space-y-5">
          <div>
            <label
              htmlFor="empanada-nom"
              className="mb-1.5 block text-sm font-semibold"
            >
              Nom
            </label>
            <input
              id="empanada-nom"
              value={nom}
              onChange={(event) => setNom(event.target.value)}
              required
              className="w-full rounded-lg border border-primary/20 bg-surface px-3 py-2.5 outline-none transition placeholder:opacity-50 focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <div>
            <label
              htmlFor="empanada-description"
              className="mb-1.5 block text-sm font-semibold"
            >
              Description
            </label>
            <textarea
              id="empanada-description"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              required
              rows={4}
              className="w-full resize-y rounded-lg border border-primary/20 bg-surface px-3 py-2.5 outline-none transition placeholder:opacity-50 focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label
                htmlFor="empanada-type"
                className="mb-1.5 block text-sm font-semibold"
              >
                Type
              </label>
              <select
                id="empanada-type"
                value={type}
                onChange={(event) =>
                  setType(event.target.value as TypeEmpanada)
                }
                className="w-full rounded-lg border border-primary/20 bg-surface px-3 py-2.5 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
              >
                <option value="SALEE">Salée</option>
                <option value="SUCREE">Sucrée</option>
                <option value="VEGETARIEN">Végétarien</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="empanada-stock"
                className="mb-1.5 block text-sm font-semibold"
              >
                Stock
              </label>
              <input
                id="empanada-stock"
                type="number"
                min="0"
                step="1"
                value={stock}
                onChange={(event) =>
                  setStock(event.target.value === '' ? 0 : Number(event.target.value))
                }
                required
                className="w-full rounded-lg border border-primary/20 bg-surface px-3 py-2.5 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div>
              <label
                htmlFor="empanada-prix-ht"
                className="mb-1.5 block text-sm font-semibold"
              >
                Prix Ht (€)
              </label>
              <input
                id="empanada-prix-ht"
                type="text"
                inputMode='decimal'
                autoComplete='off'
                value={prixHtTexte}
                onChange={(event) => handlePrixHtChange(event.target.value)}
                required
                className="w-full rounded-lg border border-primary/20 bg-surface px-3 py-2.5 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </div>

            <div>
              <label
                htmlFor="empanada-taux-tva"
                className="mb-1.5 block text-sm font-semibold"
              >
                Taux TVA (%)
              </label>
              <input
                id="empanada-taux-tva"
                type="text"
                inputMode='decimal'
                autoComplete='off'
                value={tauxTvaTexte}
                onChange={(event) => handleTauxTvaChange(event.target.value)}
                required
                className="w-full rounded-lg border border-primary/20 bg-surface px-3 py-2.5 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </div>

            <div>
              <label
                htmlFor="empanada-prix-ttc"
                className="mb-1.5 block text-sm font-semibold"
              >
                Prix TTC (€)
              </label>
              <input
                id="empanada-prix-ttc"
                type="text"
                inputMode='decimal'
                autoComplete='off'
                value={prixTtcTexte}
                onChange={(event) => handlePrixTtcChange(event.target.value)}
                required
                className="w-full rounded-lg border border-primary/20 bg-surface px-3 py-2.5 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="empanada-image"
              className="mb-1.5 block text-sm font-semibold"
            >
              Image
            </label>
            <input
              ref={imageInputRef}
              id="empanada-image"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleImageChange}
              className="block w-full cursor-pointer rounded-lg border border-primary/20 bg-surface text-sm file:mr-4 file:cursor-pointer file:border-0 file:bg-primary file:px-4 file:py-2.5 file:font-semibold file:text-surface hover:file:opacity-90"
            />

            {imagePreview && (
              <div className="mt-4">
                <p className="mb-2 text-sm font-medium">Aperçu de l’image</p>

                <div className="flex flex-wrap items-start gap-4">
                  <img
                    src={imagePreview}
                    alt={`Aperçu de ${nom || 'l’empanada'}`}
                    className="h-40 w-40 rounded-lg border border-primary/10 object-cover shadow-sm"
                  />

                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="rounded-lg bg-secondary px-4 py-2 font-semibold text-primary transition hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-offset-2"
                  >
                    Retirer l’image
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="space-y-3 rounded-lg bg-primary/5 p-4">
            <label className="flex cursor-pointer items-center gap-3 text-sm font-medium">
              <input
                type="checkbox"
                checked={sansGluten}
                onChange={(event) => setSansGluten(event.target.checked)}
                className="h-4 w-4 accent-primary"
              />
              Sans gluten
            </label>

            <label className="flex cursor-pointer items-center gap-3 text-sm font-medium">
              <input
                type="checkbox"
                checked={actif}
                onChange={(event) => setActif(event.target.checked)}
                className="h-4 w-4 accent-primary"
              />
              Actif (visible sur le site)
            </label>
          </div>
        </div>

        <div className="mt-7 flex flex-col-reverse gap-3 border-t border-primary/10 pt-5 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-lg border border-primary/20 px-4 py-2.5 font-medium transition hover:bg-primary/5 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
          >
            Annuler
          </button>

          <button
            type="submit"
            className="rounded-lg bg-primary px-4 py-2.5 font-semibold text-surface shadow-sm transition hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
          >
            Enregistrer
          </button>
        </div>
      </form>
    </div>
  );
}

export default EmpanadaForm;