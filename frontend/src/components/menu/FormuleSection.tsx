// components/menu/FormulesSection.tsx

import { useState } from 'react';
import type { Empanada, Extra, Boisson, Formule } from '../../types/admin.types';
import { formatPrix } from '../../utils/pricing';
import { stockRestant, type Categorie, type Reservations } from '../../utils/stock';

type FormuleSelection = {
  formule: Formule;
  empanadas: Empanada[];
  extras: Extra[];
  boissons: Boisson[];
};

type Props = {
  formules: Formule[];
  empanadas: Empanada[];
  extras: Extra[];
  boissons: Boisson[];
  stocks: Record<Categorie, number>;
  reservations: Reservations;
  quantiteDansPanier: (id: number) => number;
  onAdd: (selection: FormuleSelection) => void;
};

type Dispo = {
  disponible: boolean;
  manques: string[];
};

function disponibilite(f:Formule, stocks:Record<Categorie,number>):Dispo { 
  const besoins:Record<Categorie,number>={
    empanadas:f.nombreEmpanadas,
    extras:f.nombreExtras,
    boissons:f.nombreBoissons
  }; 
  
  const manques = (Object.keys(besoins) as Categorie[])
    .filter(c=>besoins[c] > stocks[c])
    .map(c=>`${c} (${stocks[c]}/${besoins[c]})`); 
    return {disponible:!manques.length,manques}; 
}

const selectClass = 'mt-1 w-full rounded border border-primary/20 bg-cream px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-secondary';

function FormuleSection({ 
  formules,
  empanadas, 
  extras, 
  boissons,
  stocks,
  reservations, 
  quantiteDansPanier,
  onAdd }: Props) {

    const [current,setCurrent]=useState<Formule|null>(null);
    const [es,setEs]=useState<number[]>([]);
    const [xs,setXs]=useState<number[]>([]); 
    const [bs,setBs]=useState<number[]>([]);

    const availableE = 
      empanadas.filter(p=>p.actif), 
      availableX=extras.filter(p=>p.actif), 
      availableB=boissons.filter(p=>p.actif);

    const close = () => {
      setCurrent(null);
      setEs([]);
      setXs([]);
      setBs([]);
    };

    const open = (f: Formule) => {
      if (!f.actif || !disponibilite(f,stocks).disponible) return;
      setCurrent(f);
      setEs(Array(f.nombreEmpanadas).fill(0));
      setXs(Array(f.nombreExtras).fill(0));
      setBs(Array(f.nombreBoissons).fill(0));
    };

    const remaining = (p: { id: number; stock: number; actif: boolean }, cat: Categorie, choices: number[], index: number) => {
      return Math.max(stockRestant(p, cat, reservations) - choices.filter((id, i) => id === p.id && i !== index).length, 0);
    };

    const options = <T extends { id: number; nom: string; supplementFormuleTtc: number; stock: number; actif: boolean }>(
      arr: T[],
      cat: Categorie,
      choices: number[],
      setChoices: (v: number[]) => void,
      label: string
    ) => {
      return choices.map((choice, index) => (
        <label key={`${cat}-${index}`} className="mt-3 block text-sm">
          {label} {index + 1}
          <select className={selectClass} value={choice} onChange={e => {
            const next = [...choices];
            next[index] = Number(e.target.value);
            setChoices(next);
          }}>
            <option value={0}>Choisir</option>
            {arr.map(p => ({ p, left: remaining(p, cat, choices, index) }))
              .filter(x => x.left > 0)
              .map(({ p, left }) => (
                <option key={p.id} value={p.id}>
                  {p.nom} ({left} restant{left > 1 ? 's' : ''}){p.supplementFormuleTtc ? ` (+${formatPrix(p.supplementFormuleTtc)})` : ''}
                </option>
              ))}
          </select>
        </label>
      ));
    };

    const confirm = () => {
      if (!current || ![...es, ...xs, ...bs].every(Boolean) || !disponibilite(current,stocks).disponible) return;
      onAdd({
        formule: current,
        empanadas: es.map(id => availableE.find(p => p.id === id)!).filter(Boolean),
        extras: xs.map(id => availableX.find(p => p.id === id)!).filter(Boolean),
        boissons: bs.map(id => availableB.find(p => p.id === id)!).filter(Boolean)
      });
      close();
    };

    if (!formules.length) return null;
    
    return ( 
      <>
        <section aria-labelledby="section-formules">
          <h2 id="section-formules" className="title-ornament mb-8 text-3xl md:text-4xl">
            Nos formules
          </h2>
          
          <div className="mx-auto max-w-md">
            {formules.slice(0,1)
              .map(f=>{const status=disponibilite(f,stocks),off=!f.actif||!status.disponible;
              return ( 
                <article key={f.id} className="overflow-hidden border border-secondary bg-cream shadow-[0_18px_50px_rgba(0,19,17,.1)]">
                    <div className="bg-primary py-2 text-center text-xs font-bold uppercase tracking-[.25em] text-secondary">
                      La plus choisie
                    </div>
                    <div className="relative h-56">
                      <img src={f.image_url||'https://placehold.co/800x600?text=Formule'} 
                        alt={f.nom} 
                        className="h-full w-full object-cover"
                      />
                      {off && 
                      <span className="absolute inset-0 flex items-center justify-center bg-primary/60 font-semibold text-cream">
                        Indisponible
                      </span>}
                      
                    </div>
                    <div className="p-6 text-center">
                      <h3 className="font-serif text-2xl font-semibold uppercase">{f.nom}</h3>
                      <p className="mt-2 text-sm leading-6 text-primary/65">{f.description}</p>
                      <p className="mt-4 font-serif text-2xl font-semibold text-secondary">{formatPrix(f.prixTtc)}</p>
                      {off && 
                        <p role="status" className="mt-2 text-sm text-red-700">
                          {!f.actif?'Formule désactivée':`Stock insuffisant : ${status.manques.join(', ')}`}
                        </p>}
                      <button 
                        className="mt-5 w-full bg-primary px-5 py-3 text-sm font-bold uppercase tracking-[.15em] text-cream transition hover:bg-secondary hover:text-primary disabled:opacity-40"
                        type="button" 
                        disabled={off} 
                        onClick={()=>open(f)} 
                      >
                      {quantiteDansPanier(f.id)>0?`Composer une autre formule · ${quantiteDansPanier(f.id)} au panier`:'Choisir ma formule'}
                      </button>
                    </div>
                  </article>
                )})
              }
              </div>
            </section>
    
    {current && 
    <div className="fixed inset-0 z-50 m-0 flex items-center justify-center bg-primary/70 p-4" 
      role="presentation" 
      onMouseDown={e=>{if(e.target===e.currentTarget)close()}}
    >
      <section role="dialog" aria-modal="true" aria-labelledby="formule-modal-title" className="max-h-[90vh] w-full max-w-lg overflow-y-auto border border-secondary bg-surface p-6 text-primary shadow-2xl">
        <h2 id="formule-modal-title" className="font-serif text-2xl font-semibold">
          Composer : {current.nom}
        </h2>
        
        {options(availableE,'empanadas',es,setEs,'Empanada')}
        {options(availableX,'extras',xs,setXs,'Douceur')}
        {options(availableB,'boissons',bs,setBs,'Boisson')}
        <div className="mt-6 flex justify-end gap-3">
          <button type="button" onClick={close} className="border border-primary/20 px-4 py-2">Annuler</button>
          <button type="button" onClick={confirm} disabled={!([...es,...xs,...bs].every(Boolean))} className="bg-primary px-4 py-2 font-semibold text-cream disabled:opacity-40">Ajouter au panier</button>
        </div>
      </section>
    </div>
    }
  </>
)};

export default FormuleSection;