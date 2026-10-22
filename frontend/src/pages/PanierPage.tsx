import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart, getLigneId } from '../contexts/CartContext';
import { createCommande } from '../services/menu.service';
import { verifierCodePromo } from '../services/codePromo.service';
import type { ModeRecuperation } from '../types/admin.types';
import type { CartItem } from '../types/cart.types';
import { calculerTtc, totalLigneTtc, formatPrix } from '../utils/pricing';
import { DELAI_MINIMUM_MINUTES } from '../utils/commande.config';
import {
  getCreneauxPourJour,
  getJoursDisponibles,
  formatHeure,
} from '../utils/creneaux';

import { isProduit, isFormule, type ProduitCartItem } from '../types/cart.types';

const inputClass =
  'w-full rounded-lg border border-primary/20 bg-surface px-3 py-2.5 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20';

/** Prix TTC unitaire, quel que soit le type de ligne */
const prixUnitaireTtc = (item: CartItem): number =>
  item.kind === 'formule' ? item.prixTtc : calculerTtc(item.prixHt, item.tauxTva);

/** Total TTC d'une ligne */
const totalLigne = (item: CartItem): number =>
  item.kind === 'formule'
    ? item.prixTtc * item.quantite
    : totalLigneTtc(item.prixHt, item.tauxTva, item.quantite);

function PanierPage() {
  const { items, totalTtc, setQuantite, remove } = useCart();

  const [clientNom, setClientNom] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [clientTelephone, setClientTelephone] = useState('');
  const [mode, setMode] = useState<ModeRecuperation>('RETRAIT');
  const [adresse, setAdresse] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [codeSaisi, setCodeSaisi] = useState('');
  const [promoAppliquee, setPromoAppliquee] = useState<{ code: string; pourcentage: number } | null>(null);
  const [promoError, setPromoError] = useState<string | null>(null);
  const [promoLoading, setPromoLoading] = useState(false);

  const jours = useMemo(() => getJoursDisponibles(), []);
  const [jourChoisi, setJourChoisi] = useState('');
  const [creneauChoisi, setCreneauChoisi] = useState(''); // ISO string

  const creneaux = useMemo(
    () => (jourChoisi ? getCreneauxPourJour(jourChoisi) : []),
    [jourChoisi],
  );

  const handleAppliquerPromo = async () => {
    if (!codeSaisi.trim() || promoLoading) return;
    setPromoLoading(true);
    setPromoError(null);
    try {
      const promo = await verifierCodePromo(codeSaisi);
      setPromoAppliquee(promo);
    } catch (err) {
      setPromoAppliquee(null);
      setPromoError(err instanceof Error ? err.message : 'Code promo invalide');
    } finally {
      setPromoLoading(false);
    }
  };

  const handleRetirerPromo = () => {
    setPromoAppliquee(null);
    setCodeSaisi('');
    setPromoError(null);
  };

  // Estimation d'affichage uniquement : le serveur recalcule le montant réel
  const remiseEstimee = promoAppliquee
    ? Math.round(totalTtc * promoAppliquee.pourcentage) / 100
    : 0;
  const totalApresRemise = totalTtc - remiseEstimee;

  function handleJourChange(key: string) {
    setJourChoisi(key);
    setCreneauChoisi(''); // le créneau précédent n'est plus valable
  }

  async function handleSubmit(event: React.SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isSubmitting || items.length === 0) return;

    if (!creneauChoisi) {
      setError('Choisis un créneau.');
      return;
    }

    // Revalidation : le client a pu rester longtemps sur la page
    const minimum = Date.now() + DELAI_MINIMUM_MINUTES * 60 * 1000;
    if (new Date(creneauChoisi).getTime() < minimum) {
      setError('Ce créneau n’est plus disponible, merci d’en choisir un autre.');
      setCreneauChoisi('');
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);

      const { checkoutUrl } = await createCommande({
        clientNom,
        clientEmail,
        clientTelephone,
        modeRecuperation: mode,
        adresseLivraison: mode === 'LIVRAISON' ? adresse : undefined,
        dateSouhaitee: new Date(creneauChoisi).toISOString(),
        codePromo: promoAppliquee?.code,

        empanadas: items
          .filter((i): i is ProduitCartItem => isProduit(i) && i.kind === 'empanada')
          .map((i) => ({ empanadaId: i.id, quantite: i.quantite })),

        extras: items
          .filter((i): i is ProduitCartItem => isProduit(i) && i.kind === 'extra')
          .map((i) => ({ extraId: i.id, quantite: i.quantite })),

        formules: items.
          filter(isFormule)
          .map((i) => ({
            formuleId: i.id,
            quantite: i.quantite,
            empanadasChoisies: i.empanadasChoisies.map((e) => e.id),
            extrasChoisies: i.extrasChoisis.map((e) => e.id),
          })),
      });

      // On NE vide PAS le panier ici : le client peut annuler sur Stripe.
      // Le vidage se fait sur la page de succès.
      window.location.href = checkoutUrl;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la commande');
      setIsSubmitting(false);
    }
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-surface p-6 text-primary">
        <div className="mx-auto max-w-xl rounded-xl border border-primary/10 px-6 py-12 text-center shadow-sm">
          <p className="font-medium">Ton panier est vide.</p>
          <Link
            to="/menu"
            className="mt-4 inline-block rounded-lg bg-primary px-4 py-2.5 font-semibold text-surface transition hover:opacity-90"
          >
            Voir le menu
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface p-4 text-primary sm:p-6">
      <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[1fr_420px]">
        <section aria-labelledby="panier-title">
          <h1 id="panier-title" className="mb-4 text-2xl font-bold">
            Mon panier
          </h1>

          <ul className="divide-y divide-primary/10 rounded-xl border border-primary/10 shadow-sm">
            {items.map((item) => {
              const ligneId = getLigneId(item);
              const estFormule = item.kind === 'formule';
              const max = estFormule ? 100 : item.stock;

              return (
                <li key={ligneId} className="flex flex-wrap items-center gap-4 p-4">
                  {item.imageUrl ? (
                    <img src={item.imageUrl} alt="" className="h-16 w-16 rounded-lg object-cover" />
                  ) : (
                    <div className="h-16 w-16 rounded-lg bg-primary/5" />
                  )}

                  <div className="min-w-0 flex-1">
                    <p className="font-medium">{item.nom}</p>
                    <p className="text-sm opacity-70">
                      {formatPrix(prixUnitaireTtc(item))} l’unité
                    </p>

                    {item.kind === 'formule' && (
                      <div className="mt-2 text-sm opacity-75">
                        {item.empanadasChoisies.length > 0 && (
                          <p>
                            Empanadas :{' '}
                            {item.empanadasChoisies.map((p) => p.nom).join(', ')}
                          </p>
                        )}
                        {item.extrasChoisis.length > 0 && (
                          <p>
                            Extras : {item.extrasChoisis.map((p) => p.nom).join(', ')}
                          </p>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      aria-label={`Retirer une unité de ${item.nom}`}
                      onClick={() => setQuantite(ligneId, item.quantite - 1)}
                      className="h-8 w-8 rounded-md border border-primary/20 font-bold transition hover:bg-primary hover:text-surface"
                    >
                      −
                    </button>

                    <span className="w-6 text-center tabular-nums" aria-live="polite">
                      {item.quantite}
                    </span>

                    <button
                      type="button"
                      aria-label={`Ajouter une unité de ${item.nom}`}
                      onClick={() => setQuantite(ligneId, item.quantite + 1)}
                      disabled={item.quantite >= max}
                      className="h-8 w-8 rounded-md border border-primary/20 font-bold transition hover:bg-primary hover:text-surface disabled:cursor-not-allowed disabled:opacity-30"
                    >
                      +
                    </button>
                  </div>

                  <p className="w-24 text-right font-semibold tabular-nums">
                    {formatPrix(totalLigne(item))}
                  </p>

                  <button
                    type="button"
                    aria-label={`Supprimer ${item.nom} du panier`}
                    onClick={() => remove(ligneId)}
                    className="rounded-md px-2 py-1 text-sm opacity-60 transition hover:opacity-100"
                  >
                    ✕
                  </button>
                </li>
              );
            })}
          </ul>

          <div className="mt-4">
            <label htmlFor="codePromo" className="mb-1 block text-sm font-medium">
              Code promo
            </label>

            {promoAppliquee ? (
              <div className="flex items-center justify-between rounded-lg border border-primary/20 bg-surface px-3 py-2.5">
                <span className="text-sm">
                  <strong>{promoAppliquee.code}</strong> : -{promoAppliquee.pourcentage}%
                </span>
                <button
                  type="button"
                  onClick={handleRetirerPromo}
                  className="rounded-md px-2 py-1 text-sm opacity-60 transition hover:opacity-100"
                >
                  Retirer
                </button>
              </div>
            ) : (
              <div className="flex gap-2">
                <input
                  id="codePromo"
                  type="text"
                  value={codeSaisi}
                  onChange={(e) => setCodeSaisi(e.target.value.toUpperCase())}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAppliquerPromo();
                    }
                  }}
                  placeholder="DORADA10"
                  className="w-full rounded-lg border border-primary/20 bg-surface px-3 py-2.5 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
                <button
                  type="button"
                  onClick={handleAppliquerPromo}
                  disabled={promoLoading || !codeSaisi.trim()}
                  className="rounded-lg bg-primary px-4 py-2.5 font-semibold text-surface transition hover:opacity-90 disabled:opacity-50"
                >
                  {promoLoading ? '…' : 'Appliquer'}
                </button>
              </div>
            )}

            {promoError && (
              <p role="alert" className="mt-1 text-sm text-red-600">
                {promoError}
              </p>
            )}
          </div>

          {promoAppliquee && (
            <p className="text-sm">
              Remise ({promoAppliquee.pourcentage}%) : -{formatPrix(remiseEstimee)}
            </p>
          )}
          <p>Total TTC : {formatPrix(totalApresRemise)}</p>
        </section>

        <form onSubmit={handleSubmit} className="h-fit space-y-4 rounded-xl border border-primary/10 p-5 shadow-sm">
          <h2 className="text-xl font-bold">Tes informations</h2>

          {error && (
            <div role="alert" className="rounded-lg border border-secondary/30 bg-secondary/10 px-4 py-3 text-sm">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="client-nom" className="mb-1.5 block text-sm font-semibold">Nom</label>
            <input id="client-nom" value={clientNom} onChange={(e) => setClientNom(e.target.value)} required autoComplete="name" className={inputClass} />
          </div>

          <div>
            <label htmlFor="client-email" className="mb-1.5 block text-sm font-semibold">Email</label>
            <input id="client-email" type="email" value={clientEmail} onChange={(e) => setClientEmail(e.target.value)} required autoComplete="email" className={inputClass} />
          </div>

          <div>
            <label htmlFor="client-tel" className="mb-1.5 block text-sm font-semibold">Téléphone</label>
            <input id="client-tel" type="tel" value={clientTelephone} onChange={(e) => setClientTelephone(e.target.value)} required autoComplete="tel" className={inputClass} />
          </div>

          <fieldset>
            <legend className="mb-1.5 text-sm font-semibold">Récupération</legend>
            <div className="flex gap-4">
              {(['RETRAIT', 'LIVRAISON'] as const).map((m) => (
                <label key={m} className="flex cursor-pointer items-center gap-2 text-sm">
                  <input type="radio" name="mode" checked={mode === m} onChange={() => setMode(m)} className="accent-primary" />
                  {m === 'RETRAIT' ? 'Retrait sur place' : 'Livraison'}
                </label>
              ))}
            </div>
          </fieldset>

          {mode === 'LIVRAISON' && (
            <div>
              <label htmlFor="client-adresse" className="mb-1.5 block text-sm font-semibold">Adresse de livraison</label>
              <textarea id="client-adresse" value={adresse} onChange={(e) => setAdresse(e.target.value)} required rows={2} className={inputClass} />
            </div>
          )}

          <div>
            <label htmlFor="jour" className="mb-1.5 block text-sm font-semibold">Jour</label>
            <select id="jour" value={jourChoisi} onChange={(e) => handleJourChange(e.target.value)} required className={inputClass}>
              <option value="" disabled>Choisir un jour</option>
              {jours.map((j) => (
                <option key={j.key} value={j.key}>{j.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="creneau" className="mb-1.5 block text-sm font-semibold">Heure</label>
            <select id="creneau" value={creneauChoisi} onChange={(e) => setCreneauChoisi(e.target.value)} required disabled={!jourChoisi} className={`${inputClass} disabled:opacity-50`}>
              <option value="" disabled>Choisir une heure</option>
              {creneaux.map((c) => (
                <option key={c.toISOString()} value={c.toISOString()}>
                  {formatHeure(c)}
                </option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-lg bg-primary px-4 py-3 font-semibold text-surface shadow-sm transition hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50"
          >
            {isSubmitting ? 'Redirection vers le paiement…' : `Payer ${formatPrix(totalApresRemise)}`}
          </button>
        </form>
      </div>
    </div>
  );
}

export default PanierPage;