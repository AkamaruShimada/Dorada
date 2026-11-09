// frontend/src/components/contact/ContactForm.tsx

import { useState, type FormEvent } from 'react';

export interface ContactFormValues {
  nom: string;
  email: string;
  sujet: string;
  message: string;
}

interface ContactFormProps {
  onSubmit: (values: ContactFormValues) => Promise<void>;
}

const VIDE: ContactFormValues = { nom: '', email: '', sujet: '', message: '' };

function ContactForm({ onSubmit }: ContactFormProps) {
  const [values, setValues] = useState<ContactFormValues>(VIDE);
  const [isSending, setIsSending] = useState(false);
  const [succes, setSucces] = useState(false);
  const [erreur, setErreur] = useState<string | null>(null);

  const handleChange = (champ: keyof ContactFormValues) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
      setValues((prev) => ({ ...prev, [champ]: e.target.value }));

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErreur(null);
    setSucces(false);
    setIsSending(true);
    try {
      await onSubmit(values);
      setValues(VIDE);
      setSucces(true);
    } catch {
      setErreur("Impossible d'envoyer votre message. Réessayez plus tard.");
    } finally {
      setIsSending(false);
    }
  };

  const inputClass =
    'w-full rounded-lg border border-primary/20 bg-surface px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20';

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="contact-nom" className="mb-1 block text-sm font-medium">Nom</label>
          <input id="contact-nom" required value={values.nom} onChange={handleChange('nom')} className={inputClass} />
        </div>
        <div>
          <label htmlFor="contact-email" className="mb-1 block text-sm font-medium">Email</label>
          <input id="contact-email" type="email" required value={values.email} onChange={handleChange('email')} className={inputClass} />
        </div>
      </div>

      <div>
        <label htmlFor="contact-sujet" className="mb-1 block text-sm font-medium">Sujet</label>
        <select id="contact-sujet" required value={values.sujet} onChange={handleChange('sujet')} className={inputClass}>
          <option value="" disabled>Choisir un sujet</option>
          <option value="commande">Question sur une commande</option>
          <option value="remboursement">Remboursement</option>
          <option value="allergies">Allergènes / régime alimentaire</option>
          <option value="autre">Autre</option>
        </select>
      </div>

      <div>
        <label htmlFor="contact-message" className="mb-1 block text-sm font-medium">Message</label>
        <textarea id="contact-message" required rows={5} value={values.message} onChange={handleChange('message')} className={inputClass} />
      </div>

      {succes && <p role="status" className="text-sm text-green-700">Merci, votre message a bien été envoyé.</p>}
      {erreur && <p role="alert" className="text-sm text-red-600">{erreur}</p>}

      <button
        type="submit"
        disabled={isSending}
        className="rounded-lg bg-primary px-5 py-2 font-semibold text-white transition hover:opacity-90 disabled:opacity-50"
      >
        {isSending ? 'Envoi...' : 'Envoyer le message'}
      </button>
    </form>
  );
}

export default ContactForm;