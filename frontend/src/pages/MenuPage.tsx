import type { Empanada } from '../types/admin.types';
import { useCart } from '../contexts/CartContext';
import { useMenu } from '../hooks/useMenu';
import useCleanCart from '../hooks/useCleanCart';

import Header from '../components/layout/Header';
import EmpanadaSection from '../components/menu/EmpanadaSection';
import ExtraSection from '../components/menu/ExtraSection';
import FormuleSection from '../components/menu/FormuleSection';

const TYPE_LABELS: Record<Empanada['type'], string> = {
  SALEE: 'Salées',
  SUCREE: 'Sucrées',
  VEGETARIEN: 'Végétariennes',
};

const ORDRE_TYPES: Empanada['type'][] = ['SALEE', 'SUCREE', 'VEGETARIEN'];

function MenuPage() {
  const { catalogue, isLoading, error, reload } = useMenu();
  const { items, addItem, addFormule } = useCart();

  useCleanCart(catalogue);

  if (isLoading) return <p className="p-6">Chargement du menu...</p>;

  if (error) {
    return (
      <div className="p-6">
        <p role="alert">{error}</p>
        <button type="button" onClick={reload} className="mt-3 underline">
          Réessayer
        </button>
      </div>
    );
  }

  if (!catalogue) return null;

  const { empanadas, extras, formules } = catalogue;

  const quantiteDans = (kind: 'empanada' | 'extra', id: number) =>
    items.find((i) => i.kind === kind && i.id === id)?.quantite ?? 0;

  const groupesParType = ORDRE_TYPES.map((type) => ({
    type,
    empanadas: empanadas.filter((e) => e.type === type),
  })).filter((g) => g.empanadas.length > 0);

  return (
    <>
      <Header />

      <main className="min-h-screen bg-surface p-4 text-primary sm:p-6">
        <div className="mx-auto max-w-7xl space-y-10">
          <header>
            <h1 className="text-3xl font-bold tracking-tight">Notre menu</h1>
            <p className="mt-1 text-sm opacity-70">
              Les produits marqués « indisponible » reviennent bientôt.
            </p>
          </header>

          <FormuleSection
            formules={formules}
            empanadas={empanadas}
            extras={extras}
            onAdd={({ formule, empanadas: choixEmpanadas, extras: choixExtras }) =>
              addFormule({
                kind: 'formule',
                id: formule.id,
                nom: formule.nom,
                description: formule.description,
                imageUrl: formule.image_url,
                prixTtc: formule.prixTtc,
                nombreEmpanadas: formule.nombreEmpanadas,
                nombreExtras: formule.nombreExtras,
                empanadasChoisies: choixEmpanadas.map((p) => ({ id: p.id, nom: p.nom })),
                extrasChoisis: choixExtras.map((p) => ({ id: p.id, nom: p.nom })),
              })
            }
          />

          {groupesParType.map((groupe) => (
            <EmpanadaSection
              key={groupe.type}
              typeLabel={TYPE_LABELS[groupe.type]}
              empanadas={groupe.empanadas}
              quantiteDansPanier={(id) => quantiteDans('empanada', id)}
              onAdd={(empanada) =>
                addItem({
                  kind: 'empanada',
                  id: empanada.id,
                  nom: empanada.nom,
                  description: empanada.description,
                  prixHt: empanada.prixHt,
                  tauxTva: empanada.tauxTva,
                  imageUrl: empanada.image_url,
                  stock: empanada.stock,
                })
              }
            />
          ))}

          <ExtraSection
            extras={extras}
            quantiteDansPanier={(id) => quantiteDans('extra', id)}
            onAdd={(extra) =>
              addItem({
                kind: 'extra',
                id: extra.id,
                nom: extra.nom,
                description: extra.description,
                prixHt: extra.prixHt,
                tauxTva: extra.tauxTva,
                imageUrl: extra.image_url,
                stock: extra.stock,
              })
            }
          />
        </div>
      </main>
    </>
  );
}

export default MenuPage;