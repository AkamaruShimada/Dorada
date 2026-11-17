import type { Extra } from '../../types/admin.types';
import { calculerTtc, formatPrix } from '../../utils/pricing';
import { stockRestant, type Reservations } from '../../utils/stock';

type Props = {
  extras: Extra[];
  reservations: Reservations;
  quantiteDansPanier: (id: number) => number;
  onAdd: (extra: Extra) => void;
};

function ExtraSection({
  extras,
  reservations,
  quantiteDansPanier,
  onAdd,
}: Props) {
  if (extras.length === 0) return null;

  return (
    
    <section aria-labelledby="section-extras">
      <h2 id="section-extras" 
        className="mb-5 font-serif text-2xl font-semibold uppercase tracking-widest">
          Douceurs maison
      </h2>
      
      <ul className="divide-y divide-primary/15">
        {extras.map((extra) => { 
            const restant = stockRestant(extra, 'extras', reservations); 
            const off = !extra.actif || restant <= 0;
            
            return (
              <li key={extra.id} className="flex items-center gap-3 py-3 first:pt-0">
                <img src={extra.image_url || 'https://placehold.co/160x160?text=Douceur'} 
                  alt="" 
                  className="h-14 w-14 rounded-full border border-secondary/50 object-cover"
                />
  
              <div className="min-w-0 flex-1">
                <h3 className="font-serif text-lg font-semibold">{extra.nom}</h3>
                <p className="text-xs leading-5 text-primary/65">{extra.description}</p>
              </div>
              
              <span className="text-sm font-semibold tabular-nums">{formatPrix(calculerTtc(extra.prixHt, extra.tauxTva))}</span>
              <button 
                type="button" 
                disabled={off} 
                onClick={() => onAdd(extra)} 
                aria-label={`Ajouter ${extra.nom} au panier`} 
                className="rounded-full border border-secondary px-2.5 py-1 text-secondary hover:bg-secondary hover:text-primary disabled:opacity-35">
                  {quantiteDansPanier(extra.id) ? `+${quantiteDansPanier(extra.id)}` : '+'}
                </button>
                </li> 
            )
          }
        )}
      </ul>
    </section>
    )
}

export default ExtraSection;