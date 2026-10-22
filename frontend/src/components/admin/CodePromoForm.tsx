// frontend/src/components/admin/CodePromoForm.tsx

import { useState } from 'react';
import type {
  CodePromo,
  CodePromoPayload,
  CodePromoUpdatePayload,
} from '../../types/admin.types';

interface Props {
  // Si fourni : mode modification, sinon mode création
  codePromo?: CodePromo;
  onSubmit: (payload: CodePromoPayload | CodePromoUpdatePayload) => Promise<void>;
  onCancel: () => void;
}

const inputClass =
  'w-full rounded-lg border border-primary/20 bg-surface px-3 py-2.5 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-60';

const PRESETS = [10, 15, 20];

// ISO -> "YYYY-MM-DD" pour <input type="date">
const toDateInput = (iso: string | null | undefined) => (iso ? iso.slice(0, 10) : '');

function CodePromoForm({ codePromo, onSubmit, onCancel }: Props) {
  const isEdit = !!codePromo;

  const [code, setCode] = useState(codePromo?.code ?? '');
  const [pourcentage, setPourcentage] = useState<number>(codePromo?.pourcentage ?? 10);
  const [dateExpiration, setDateExpiration] = useState(toDateInput(codePromo?.dateExpiration));
  const [usagesMax, setUsagesMax] = useState(
    codePromo?.usagesMax != null ? String(codePromo.usagesMax) : '',
  );
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    setError(null);

    const usages = usagesMax ? Number(usagesMax) : null;

    // On ne peut pas descendre sous le nombre d'utilisations déjà consommées
    if (isEdit && usages !== null && usages < codePromo.usagesActuels) {
      setError(
        `La limite ne peut pas être inférieure aux utilisations déjà faites (${codePromo.usagesActuels}).`,
      );
      return;
    }

    setIsSubmitting(true);
    try {
      if (isEdit) {
        await onSubmit({
          dateExpiration: dateExpiration || null,
          usagesMax: usages,
        });
      } else {
        await onSubmit({
          code: code.trim(),
          pourcentage,
          dateExpiration: dateExpiration || null,
          usagesMax: usages,
        });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de l\'enregistrement');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-primary/50 p-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md rounded-2xl border border-primary/10 bg-surface p-6 text-primary shadow-2xl"
      >
        <h2 className="mb-1 text-xl font-bold">
          {isEdit ? 'Modifier le code promo' : 'Nouveau code promo'}
        </h2>
        {isEdit && (
          <p className="mb-5 text-sm opacity-70">
            Le code et la réduction ne sont pas modifiables : crée un nouveau code si besoin.
          </p>
        )}

        {error && (
          <div
            role="alert"
            className="mb-4 rounded-lg border border-secondary/30 bg-secondary/10 px-4 py-3 text-sm"
          >
            {error}
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label htmlFor="code" className="mb-1.5 block text-sm font-semibold">
              Code
            </label>
            <input
              id="code"
              type="text"
              required
              minLength={3}
              maxLength={30}
              pattern="[A-Za-z0-9_\-]+"
              title="Lettres, chiffres, - et _ uniquement"
              value={code}
              disabled={isEdit}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              placeholder="DORADA10"
              className={inputClass}
            />
          </div>

          <div>
            <label htmlFor="pourcentage" className="mb-1.5 block text-sm font-semibold">
              Réduction (%)
            </label>
            {!isEdit && (
              <div className="mb-2 flex gap-2">
                {PRESETS.map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setPourcentage(p)}
                    className={`rounded-md px-3 py-1.5 text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-primary ${
                      pourcentage === p
                        ? 'bg-primary text-surface'
                        : 'border border-primary/20 hover:bg-primary/5'
                    }`}
                  >
                    {p}%
                  </button>
                ))}
              </div>
            )}
            <input
              id="pourcentage"
              type="number"
              required
              min={1}
              max={99}
              step="0.01"
              value={pourcentage}
              disabled={isEdit}
              onChange={(e) => setPourcentage(Number(e.target.value))}
              className={inputClass}
            />
          </div>

          <div>
            <label htmlFor="dateExpiration" className="mb-1.5 block text-sm font-semibold">
              Date d'expiration <span className="font-normal opacity-60">(optionnel)</span>
            </label>
            <input
              id="dateExpiration"
              type="date"
              value={dateExpiration}
              onChange={(e) => setDateExpiration(e.target.value)}
              className={inputClass}
            />
          </div>

          <div>
            <label htmlFor="usagesMax" className="mb-1.5 block text-sm font-semibold">
              Nombre d'utilisations max <span className="font-normal opacity-60">(optionnel)</span>
            </label>
            <input
              id="usagesMax"
              type="number"
              min={isEdit ? Math.max(1, codePromo.usagesActuels) : 1}
              step={1}
              value={usagesMax}
              onChange={(e) => setUsagesMax(e.target.value)}
              placeholder="Illimité"
              className={inputClass}
            />
            {isEdit && (
              <p className="mt-1 text-xs opacity-60">
                Déjà utilisé {codePromo.usagesActuels} fois.
              </p>
            )}
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
            disabled={isSubmitting}
            className="rounded-lg bg-primary px-4 py-2.5 font-semibold text-surface shadow-sm transition hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50"
          >
            {isSubmitting
              ? 'Enregistrement…'
              : isEdit
                ? 'Enregistrer'
                : 'Créer le code'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default CodePromoForm;