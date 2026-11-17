//frontend/src/components/menu/EmpanadaCard.tsx

import type { Empanada } from '../../types/admin.types';
import { formatPrix } from '../../utils/pricing';

type EmpanadaCardProps = { 
    empanada: Empanada; 
    prixTtc: number; 
    restant: number; 
    quantiteDansPanier: number; 
    onAdd: (empanada: Empanada) => void 
};

export default function EmpanadaCard({ empanada, prixTtc, restant, quantiteDansPanier, onAdd }: EmpanadaCardProps) {
  const indisponible = !empanada.actif || restant <= 0;

  return (
    
    <article className="group relative flex items-center gap-4 border-b border-primary/12 py-3 first:border-t md:flex-col md:items-center md:border-0 md:py-4 md:text-center">
        <div className="relative h-[4.25rem] w-[4.25rem] shrink-0 overflow-hidden rounded-full border-2 border-secondary/70 bg-cream md:mb-2 md:h-32 md:w-32 md:border-[3px] md:p-1">

            <img 
              src={empanada.image_url || 'https://placehold.co/400x400?text=Empanada'} 
              alt="" 
              className="h-full w-full rounded-full object-cover transition duration-500 group-hover:scale-105" 
            />

            {indisponible && 
            <span className="absolute inset-0 flex items-center justify-center rounded-full bg-primary/65 px-1 text-center text-[9px] font-semibold uppercase text-cream md:text-xs">
                Épuisé
            </span>}
        </div>

        <div className="min-w-0 flex-1 md:w-full md:flex-none">
            <h3 className="font-serif text-lg font-semibold uppercase leading-tight md:text-xl">{empanada.nom}</h3>
            <p className="mt-1 hidden text-sm leading-5 text-primary/65 md:block">{empanada.description}</p>
            {empanada.sansGluten && 
            <span className="mt-1 inline-block text-[10px] uppercase tracking-wider text-secondary">
                Sans gluten
            </span>}
        </div>

        <span className="shrink-0 font-semibold tabular-nums">{formatPrix(prixTtc)}</span>
        <button 
          type="button"
          onClick={() => onAdd(empanada)} 
          disabled={indisponible} 
          aria-label={`Ajouter ${empanada.nom} au panier`} 
          className="ml-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-secondary text-secondary transition hover:bg-secondary hover:text-primary disabled:cursor-not-allowed disabled:opacity-35 md:absolute md:right-2 md:top-3 md:h-8 md:w-8 md:opacity-0 md:group-hover:opacity-100 md:focus:opacity-100">
            <span aria-hidden className="hidden md:inline">
                +
            </span>
            <span aria-hidden className="md:hidden">
                ›
            </span>
        </button>
        {quantiteDansPanier > 0 && 
        <span className="absolute left-0 top-2 rounded-full bg-primary px-2 py-0.5 text-[10px] font-bold text-cream md:left-1/2 md:top-auto md:bottom-1">
            {quantiteDansPanier} au panier
        </span>}
        
    </article>
  )
}
