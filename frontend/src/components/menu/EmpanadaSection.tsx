import type { Empanada, TypeEmpanada } from '../../types/admin.types';
import { calculerTtc } from '../../utils/pricing';
import { stockRestant, type Reservations } from '../../utils/stock';
import EmpanadaCard from './EmpanadaCard';

const labels: Record<TypeEmpanada, string> = { 
  SALEE: 'Salées',
  SUCREE: 'Sucrées', 
  VEGETARIEN: 'Végétariennes' 
};

type Props = {
  empanadas: Empanada[];
  reservations: Reservations;
  quantiteDansPanier: (id: number) => number;
  onAdd: (empanada: Empanada) => void;
};

function EmpanadaSection({
  empanadas,
  reservations,
  quantiteDansPanier,
  onAdd,
}: Props) {

  const types: TypeEmpanada[] = ['SALEE', 'SUCREE', 'VEGETARIEN'];
  const groupes = types.map((type) => ({
    type,
    produits: empanadas.filter((e) => e.type === type),
  })).filter((g) => g.produits.length > 0);

  if (!groupes.length) return null;

  return (
    <section aria-labelledby="section-empanadas" className="space-y-10">
      <h2 id="section-empanadas" className="title-ornament text-3xl md:text-4xl">Nos empanadas</h2>
    
      {groupes.map(({ type, produits }) => 
        <div key={type} aria-label={labels[type]}>
          <div className="mb-3 flex items-center gap-4">
            <h3 className="font-serif text-xl font-semibold uppercase tracking-[.14em] text-primary">{labels[type]}</h3>
            <span className="h-px flex-1 bg-secondary/45" />
          </div>
          <div className="grid grid-cols-1 gap-x-5 md:grid-cols-3 md:gap-x-8 lg:grid-cols-6">
            {produits.map((empanada) => 
              <EmpanadaCard 
                key={empanada.id} 
                empanada={empanada} 
                prixTtc={calculerTtc(empanada.prixHt, empanada.tauxTva)} 
                restant={stockRestant(empanada, 'empanadas', reservations)} 
                quantiteDansPanier={quantiteDansPanier(empanada.id)} 
                onAdd={onAdd} 
              />
            )}
          </div>
        </div>
      )}
  
    </section>

  );
}

export default EmpanadaSection;