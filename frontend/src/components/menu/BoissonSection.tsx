import type { Boisson } from '../../types/admin.types';
import { calculerTtc } from '../../utils/pricing';
import { stockRestant, type Reservations } from '../../utils/stock';
import ProductCard from '../menu/ProductCard';

type BoissonSectionProps = {
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
}: BoissonSectionProps) {
  if (boissons.length === 0) return null;

  return (
    <section aria-labelledby="section-boissons">
      <h2 id="section-boissons" className="mb-4 text-xl font-bold">
        Boissons
      </h2>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {boissons.map((boisson) => (
          <ProductCard
            key={boisson.id}
            nom={boisson.nom}
            description={boisson.description}
            prixTtc={calculerTtc(boisson.prixHt, boisson.tauxTva)}
            imageUrl={
              boisson.image_url || 'https://placehold.co/800x600?text=Boisson'
            }
            actif={boisson.actif}
            stock={stockRestant(boisson, 'boissons', reservations)}
            badge={boisson.alcool ? 'Alcoolisée' : undefined}
            quantiteDansPanier={quantiteDansPanier(boisson.id)}
            onAdd={() => onAdd(boisson)}
          />
        ))}
      </div>
    </section>
  );
}

export default BoissonSection;