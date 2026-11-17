// frontend/src/pages/MenuPage.tsx

import { useMemo } from 'react';
import type { Empanada, Extra, Boisson } from '../types/admin.types';
import type { ProduitCartItem } from '../types/cart.types.ts';
import { useCart } from '../contexts/CartContext';
import { useMenu } from '../hooks/useMenu';
import useCleanCart from '../hooks/useCleanCart';

import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';

import PageBanner from '../components/sections/PageBanner';
import TraiteurBanner from '../components/sections/TraiteurBanner';
import Reassurance from '../components/sections/Reassurance';

import EmpanadaSection from '../components/menu/EmpanadaSection';
import ExtraSection from '../components/menu/ExtraSection';
import BoissonSection from '../components/menu/BoissonSection';
import FormuleSection from '../components/menu/FormuleSection';

import { reservationsPanier, stockVendableCategorie } from '../utils/stock';

function toCartItem(
  kind: ProduitCartItem['kind'], 
  produit: Empanada | Extra | Boisson
): Omit<ProduitCartItem, 'quantite'> {
  return { 
    kind, 
    id: produit.id, 
    nom: produit.nom, 
    description: produit.description, 
    prixHt: produit.prixHt,
    tauxTva: produit.tauxTva, 
    imageUrl: produit.image_url, 
    stock: produit.stock 
  };
}

function MenuPage() {
  const { catalogue, isLoading, error, reload } = useMenu();
  const { items, addItem, addFormule } = useCart();

  useCleanCart(catalogue);

  const reservations = useMemo(() => reservationsPanier(items), [items]);

  const quantites = useMemo(() => {
    const map = new Map<string, number>();
    for (const item of items) {
      const key = `${item.kind}:${item.id}`;
      map.set(key, (map.get(key) ?? 0) + item.quantite);
    }
    return map;
  }, [items]);

  const quantiteDans = (kind: 'empanada' | 'extra' | 'boisson' | 'formule', id: number) => 
    quantites.get(`${kind}:${id}`) ?? 0;

  if (isLoading) return <><Header /><main className="bg-surface p-8 text-center">Chargement du menu…</main><Footer /></>;
  if (error) return <><Header /><main className="bg-surface p-8 text-center"><p role="alert">{error}</p><button type="button" onClick={reload} className="mt-3 underline">Réessayer</button></main><Footer /></>;
  if (!catalogue) return <><Header /><main className="min-h-[40vh] bg-surface" /><Footer /></>;

  const { empanadas, extras, boissons, formules } = catalogue;

  const stocks = {
    empanadas: stockVendableCategorie(empanadas, 'empanadas', reservations),
    extras: stockVendableCategorie(extras, 'extras', reservations),
    boissons: stockVendableCategorie(boissons, 'boissons', reservations),
  };

  return (
    <>
      <Header />

      <main className="bg-surface text-primary">
        <PageBanner 
          title="Nos produits / et formules" 
          subtitle="Des empanadas artisanales pour chaque envie." 
          imageUrl="https://res.cloudinary.com/b9qac4kt/image/upload/v1794940965/home_banner.png" 
          imageAlt="Empanadas artisanales dorées" 
        />
        
        <Reassurance/>
        <div className="mx-auto max-w-7xl space-y-16 px-5 py-14 sm:px-8 md:py-20">

          <EmpanadaSection
            empanadas={empanadas}
            reservations={reservations}
            quantiteDansPanier={(id) => quantiteDans('empanada', id)}
            onAdd={(p) => addItem(toCartItem('empanada', p))}
          />

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

          <div className="grid gap-10 md:grid-cols-2 md:gap-12">
            <div>
              <ExtraSection
                extras={extras}
                reservations={reservations}
                quantiteDansPanier={(id) => quantiteDans('extra', id)}
                onAdd={(p) => addItem(toCartItem('extra', p))}
                />
            </div>
            
            <div className="border-t border-secondary/40 pt-8 md:border-l md:border-t-0 md:pl-12 md:pt-0">
              <BoissonSection
                boissons={boissons}
                reservations={reservations}
                quantiteDansPanier={(id) => quantiteDans('boisson', id)}
                onAdd={(p) => addItem(toCartItem('boisson', p))}
              />
            </div>
          </div>
        </div>
        <TraiteurBanner/>
      </main>
    
      <Footer />
    </>
  );
}

export default MenuPage;