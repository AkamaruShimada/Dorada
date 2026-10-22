import type { Empanada } from '../../types/admin.types';
import { calculerTtc } from '../../utils/pricing';
import ProductCard from '../menu/ProductCard';

type EmpanadaSectionProps = {
  typeLabel: string;
  empanadas: Empanada[];
  quantiteDansPanier: (id: number) => number;
  onAdd: (empanada: Empanada) => void;
};

function EmpanadaSection({
  typeLabel,
  empanadas,
  quantiteDansPanier,
  onAdd,
}: EmpanadaSectionProps) {
  if (empanadas.length === 0) return null;

  return (
    <section aria-label={`Empanadas ${typeLabel.toLowerCase()}`}>
      <h2 className="mb-4 text-xl font-bold">
        Empanadas {typeLabel.toLowerCase()}
      </h2>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {empanadas.map((empanada) => (
          <ProductCard
            key={empanada.id}
            nom={empanada.nom}
            description={empanada.description}
            prixTtc={calculerTtc(empanada.prixHt, empanada.tauxTva)}
            imageUrl={
              empanada.image_url ||
              'https://placehold.co/800x600?text=Empanada'
            }
            actif={empanada.actif}
            stock={empanada.stock}
            badge={empanada.sansGluten ? 'Sans gluten' : undefined}
            quantiteDansPanier={quantiteDansPanier(empanada.id)}
            onAdd={() => onAdd(empanada)}
          />
        ))}
      </div>
    </section>
  );
}

export default EmpanadaSection;