// frontend/src/components/menu/ProductCard.tsx

import { formatPrix } from '../../utils/pricing';

type Props={
  nom:string;
  description:string;
  prixTtc:number;
  imageUrl:string;
  actif:boolean;
  stock:number;
  badge?:string;
  quantiteDansPanier:number;
  onAdd:()=>void
};

function ProductCard({
  nom,
  description,
  prixTtc,
  imageUrl,
  actif,
  stock,
  badge,
  quantiteDansPanier,
  onAdd
}:Props){
  const off = !actif || stock <= 0;
  return (
    <article className="overflow-hidden rounded border border-secondary/20 bg-cream">
      <img src={imageUrl} alt="" className="h-40 w-full object-cover"/>
      <div className="p-4">
        <h3 className="font-serif text-xl">{nom}</h3>
        <p className="mt-1 text-sm text-primary/65">{description}</p>
        {badge && <p className="mt-2 text-xs text-secondary">{badge}</p>}
        <div className="mt-4 flex items-center justify-between">
          <span className="font-semibold">{formatPrix(prixTtc)}</span>
          <button 
            type="button" 
            onClick={onAdd} 
            disabled={off} 
            className="bg-primary px-3 py-2 text-sm text-cream disabled:opacity-40"
          >
            {off ? 'Indisponible' : quantiteDansPanier ? `+${quantiteDansPanier}` : 'Ajouter'}
          </button>
        </div>
      </div>
    </article>
  );
}

export default ProductCard;