// frontend/src/components/admin/EmpanadaForm.tsx

import { useState } from 'react';
import type { Empanada, TypeEmpanada } from '../../types/admin.types';

interface EmpanadaFormProps {
  initialData: Empanada | null; // null = mode création
  onSave: (formData: FormData) => void;
  onCancel: () => void;
}

function EmpanadaForm({ initialData, onSave, onCancel }: EmpanadaFormProps) {
  const [nom, setNom] = useState(initialData?.nom ?? '');
  const [description, setDescription] = useState(initialData?.description ?? '');
  const [prix, setPrix] = useState(initialData?.prix ?? 0);
  const [type, setType] = useState<TypeEmpanada>(initialData?.type ?? 'SALEE');
  const [sansGluten, setSansGluten] = useState(initialData?.sansGluten ?? false);
  const [stock, setStock] = useState(initialData?.stock ?? 0);
  const [actif, setActif] = useState(initialData?.actif ?? true);

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(
  initialData?.image_url ?? null
);

function handleImageChange(event: React.ChangeEvent<HTMLInputElement>) {
  const file = event.target.files?.[0];
  if (!file) return;

  setImageFile(file);
  setImagePreview(URL.createObjectURL(file)); // aperçu local immédiat
}

function handleSubmit(event: React.SubmitEvent<HTMLFormElement>) {
  event.preventDefault();

  const formData = new FormData();
  formData.append('nom', nom);
  formData.append('description', description);
  formData.append('prix', prix.toString());
  formData.append('type', type);
  formData.append('sansGluten', sansGluten.toString());
  formData.append('stock', stock.toString());
  formData.append('actif', actif.toString());

  if (imageFile) {
    formData.append('image', imageFile);
  }

  onSave(formData); // le type change : FormData au lieu de EmpanadaPayload
}

  return (
    <div className="modal-overlay">
      <form className="modal-content" onSubmit={handleSubmit}>
        <h2>{initialData ? 'Modifier' : 'Créer'} une empanada</h2>

        <label>
          Nom
          <input value={nom} onChange={(e) => setNom(e.target.value)} required />
        </label>

        <label>
          Description
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </label>

        <label>
          Prix (€)
          <input
            type="number"
            step="0.01"
            min="0"
            value={prix}
            onChange={(e) => setPrix(parseFloat(e.target.value))}
            required
          />
        </label>

        <label>
          Type
          <select value={type} onChange={(e) => setType(e.target.value as TypeEmpanada)}>
            <option value="SALEE">Salée</option>
            <option value="SUCREE">Sucrée</option>
            <option value="VEGETARIEN">Végétarien</option>
          </select>
        </label>

        <label>
          Stock
          <input
            type="number"
            min="0"
            value={stock}
            onChange={(e) => setStock(parseInt(e.target.value, 10))}
            required
          />
        </label>

        <label>
          Image
          <input 
            type="file" 
            accept="image/jpeg,image/png,image/webp,image/jpg" 
            onChange={handleImageChange} />
        </label>

        {imagePreview && <img src={imagePreview} alt="Aperçu" style={{ maxWidth: 200 }} />}

        <label>
          <input
            type="checkbox"
            checked={sansGluten}
            onChange={(e) => setSansGluten(e.target.checked)}
          />
          Sans gluten
        </label>

        <label>
          <input
            type="checkbox"
            checked={actif}
            onChange={(e) => setActif(e.target.checked)}
          />
          Actif (visible sur le site)
        </label>

        <div className="modal-actions">
          <button type="button" onClick={onCancel}>
            Annuler
          </button>
          <button type="submit">Enregistrer</button>
        </div>
      </form>
    </div>
  );
}

export default EmpanadaForm;