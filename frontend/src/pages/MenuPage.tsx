// frontend/src/pages/MenuPage.tsx

import { useMemo } from 'react';
import type { Empanada } from '../types/admin.types';
import { useCart } from '../contexts/CartContext';
import { useMenu } from '../hooks/useMenu';
import useCleanCart from '../hooks/useCleanCart';

import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import EmpanadaSection from '../components/menu/EmpanadaSection';
import ExtraSection from '../components/menu/ExtraSection';
import BoissonSection from '../components/menu/BoissonSection';
import FormuleSection from '../components/menu/FormuleSection';

import { reservationsPanier, stockVendableCategorie } from '../utils/stock';

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

  const reservations = useMemo(() => reservationsPanier(items), [items]);

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

  const { empanadas, extras, boissons, formules } = catalogue;

  const stocks = {
    empanadas: stockVendableCategorie(empanadas, 'empanadas', reservations),
    extras: stockVendableCategorie(extras, 'extras', reservations),
    boissons: stockVendableCategorie(boissons, 'boissons', reservations),
  };

  const quantiteDans = (kind: 'empanada' | 'extra' | 'boisson' | 'formule', id: number) =>
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
            boissons={boissons}
            stocks={stocks}
            reservations={reservations}
            quantiteDansPanier={(id) => quantiteDans('formule', id)}
            onAdd={({ formule, empanadas: choixEmpanadas, extras: choixExtras, boissons: choixBoissons }) =>
              addFormule({
                kind: 'formule',
                id: formule.id,
                nom: formule.nom,
                description: formule.description,
                imageUrl: formule.image_url,
                prixTtc: formule.prixTtc,
                nombreEmpanadas: formule.nombreEmpanadas,
                nombreExtras: formule.nombreExtras,
                nombreBoissons: formule.nombreBoissons,
                empanadasChoisies: choixEmpanadas.map((p) => ({ id: p.id, nom: p.nom, supplementFormuleTtc: p.supplementFormuleTtc })),
                extrasChoisis: choixExtras.map((p) => ({ id: p.id, nom: p.nom, supplementFormuleTtc: p.supplementFormuleTtc })),
                boissonsChoisies: choixBoissons.map((p) => ({ id: p.id, nom: p.nom, supplementFormuleTtc: p.supplementFormuleTtc })),
              })
            }
          />

          {groupesParType.map((groupe) => (
            <EmpanadaSection
              key={groupe.type}
              typeLabel={TYPE_LABELS[groupe.type]}
              empanadas={groupe.empanadas}
              reservations={reservations}
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
            reservations={reservations}
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

          <BoissonSection
            boissons={boissons}
            reservations={reservations}
            quantiteDansPanier={(id) => quantiteDans('boisson', id)}
            onAdd={(boisson) =>
              addItem({
                kind: 'boisson',
                id: boisson.id,
                nom: boisson.nom,
                description: boisson.description,
                prixHt: boisson.prixHt,
                tauxTva: boisson.tauxTva,
                imageUrl: boisson.image_url,
                stock: boisson.stock,
              })
            }
          />
          
        </div>
      </main>
    
      <Footer />
    </>
  );
}

export default MenuPage;