import type { Boisson } from '../../types/admin.types';
import { calculerTtc, formatPrix } from '../../utils/pricing';
import { stockRestant, type Reservations } from '../../utils/stock';

type Props = {
  boissons: Boisson[];
  reservations: Reservations;
  quantiteDansPanier: (id: number) => number;
  onAdd: (boisson: Boisson) => void;
};

function BoissonSection({
  boissons,
  reservations,
  quantiteDansPanier,
  onAdd,
}: Props) {
  if (boissons.length === 0) return null;

  return (
    <section aria-labelledby="section-boissons">
      <h2 id="section-boissons" className="mb-5 font-serif text-2xl font-semibold uppercase tracking-widest">
        Boissons
      </h2>
      <ul className="divide-y divide-primary/15">
        {boissons.map((boisson) => { 
          const restant = stockRestant(boisson, 'boissons', reservations); 
          const off = !boisson.actif || restant <= 0; 
          
          return (
            <li key={boisson.id} className="flex items-center gap-3 py-3 first:pt-0">
              <img src={boisson.image_url || 'https://placehold.co/160x160?text=Boisson'} alt="" className="h-14 w-14 rounded-full border border-secondary/50 object-cover"/>
              <div className="min-w-0 flex-1">
                <h3 className="font-serif text-lg font-semibold">{boisson.nom}</h3>
                <p className="text-xs leading-5 text-primary/65">{boisson.description}</p>
              </div>
              <span className="text-sm font-semibold tabular-nums">{formatPrix(calculerTtc(boisson.prixHt, boisson.tauxTva))}</span>
              <button 
                className="rounded-full border border-secondary px-2.5 py-1 text-secondary hover:bg-secondary hover:text-primary disabled:opacity-35"
                type="button" 
                disabled={off} 
                onClick={() => onAdd(boisson)} 
                aria-label={`Ajouter ${boisson.nom} au panier`}
              >
                {quantiteDansPanier(boisson.id) ? `+${quantiteDansPanier(boisson.id)}` : '+'}
              </button>
            </li>
          )})
        }
      </ul>
    </section>
  ) 
}

export default BoissonSection;