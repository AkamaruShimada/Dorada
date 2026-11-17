// frontend/src/components/sections/HistoireSection.tsx

import { useState } from "react";

interface HistoireSectionProps {
  id?: string;
  imageUrl: string;
  imageAlt?: string;
  titre: string[];        // lignes du titre, ex. ["De l'Argentine", "à La Farlède"]
  paragraphes: string[];
  signature?: string;
}

function HistoireSection({
  id,
  imageUrl,
  imageAlt = '',
  titre,
  paragraphes,
  signature,
}: HistoireSectionProps) {

  const [expanded,setExpanded]=useState(false);
  return (
    <section id={id} className="scroll-mt-24 bg-surface px-5 py-12 text-primary md:px-8 md:py-24">
      <div className="mx-auto grid max-w-7xl grid-cols-[35%_1fr] items-center gap-4 md:grid-cols-2 md:gap-14">
        <div className="relative max-h-48 overflow-hidden rounded-sm md:max-h-none md:overflow-visible md:rounded-none">
          <img 
            src={imageUrl} 
            alt={imageAlt} 
            width={800} 
            height={600} 
            className="h-40 w-full object-cover shadow-lg md:h-auto md:max-h-[42rem] md:rounded-sm"
          />
        </div>
        
        <div className="text-left">
          <h2 className="font-serif text-xl font-semibold uppercase leading-tight text-secondary sm:text-2xl md:text-5xl">
            {titre.map(l=><span key={l} className="block">{l}</span>)}
          </h2>
          
          <div aria-hidden className="my-3 h-px w-9 bg-secondary md:my-6 md:w-16"/>
          <div className={`space-y-2 text-xs leading-relaxed text-primary/80 sm:text-sm md:max-w-xl md:space-y-4 md:text-base ${expanded?'':'[&>p]:line-clamp-2'} md:[&>p]:line-clamp-none`}>
            {paragraphes.map((p,i) => <p key={i} className={!expanded&&i>0?'line-clamp-2 md:line-clamp-none':''}>{p}</p>)}
          </div>
          
          {paragraphes.length > 1 && 
          <button 
            type="button" 
            aria-expanded={expanded} 
            onClick={()=>setExpanded(!expanded)} 
            className="mt-2 text-xs font-semibold text-secondary underline underline-offset-4 md:hidden"
          >
            {expanded?'Lire moins':'Lire la suite'}
          </button>}
          
          {signature && 
          <p className="mt-3 font-serif text-xl italic text-secondary md:mt-8 md:text-3xl">
            {signature}
          </p>}
        </div>
      </div>
    </section>
  ) 
}

export default HistoireSection;