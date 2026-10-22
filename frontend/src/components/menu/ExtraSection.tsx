import type { Extra } from '../../types/admin.types';
import { calculerTtc } from '../../utils/pricing';
import ProductCard from '../menu/ProductCard';

type ExtraSectionProps = {
  extras: Extra[];
  quantiteDansPanier: (id: number) => number;
  onAdd: (extra: Extra) => void;
};

function ExtraSection({
  extras,
  quantiteDansPanier,
  onAdd,
}: ExtraSectionProps) {
  if (extras.length === 0) return null;

  return (
    <section aria-labelledby="section-extras">
      <h2 id="section-extras" className="mb-4 text-xl font-bold">
        Extras
      </h2>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {extras.map((extra) => (
          <ProductCard
            key={extra.id}
            nom={extra.nom}
            description={extra.description}
            prixTtc={calculerTtc(extra.prixHt, extra.tauxTva)}
            imageUrl={
              extra.image_url || 'https://placehold.co/800x600?text=Extra'
            }
            actif={extra.actif}
            stock={extra.stock}
            quantiteDansPanier={quantiteDansPanier(extra.id)}
            onAdd={() => onAdd(extra)}
          />
        ))}
      </div>
    </section>
  );
}

export default ExtraSection;