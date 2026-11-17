// src/components/sections/EmpanadaShowcaseSlider.tsx

import { useEffect, useRef, useState } from "react";
import type { Empanada } from "../../types/admin.types";
import { getEmpanadas } from "../../services/empanada.service";
import { calculerTtc, formatPrix } from "../../utils/pricing";

export default function EmpanadaShowcaseSlider() {
  const [empanadas, setEmpanadas] = useState<Empanada[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const sliderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function loadEmpanadas() {
      try {
        setIsLoading(true);
        setError(null);

        const data = await getEmpanadas();
        setEmpanadas(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Une erreur est survenue.",
        );
      } finally {
        setIsLoading(false);
      }
    }

    loadEmpanadas();
  }, []);

  function scrollSlider(direction: "left" | "right") {
    const slider = sliderRef.current;

    if (!slider) return;

    slider.scrollBy({
      left: direction === "left" ? -slider.clientWidth : slider.clientWidth,
      behavior: "smooth",
    });
  }

  if (isLoading) {
    return (
      <section className="bg-primary px-6 py-16 text-center text-cream">
        <p>Découverte de nos empanadas...</p>
      </section>
    );
  }

  return (
    <section className="overflow-hidden bg-primary px-6 py-16 text-cream md:py-24">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex items-end justify-between gap-6">
          <div>
            <p className="mb-2 text-xs uppercase tracking-[.25em] text-secondary">
              Fait maison avec passion
            </p>
            <h2 className="font-serif text-4xl font-semibold md:text-5xl">
              Nos empanadas
            </h2>
          </div>

          <div className="hidden gap-3 sm:flex">
            <button
              type="button"
              onClick={() => scrollSlider("left")}
              aria-label="Afficher les empanadas précédentes"
              className="h-11 w-11 rounded-full border border-secondary/50 text-secondary hover:bg-secondary hover:text-primary"
            >
              ←
            </button>

            <button
              type="button"
              onClick={() => scrollSlider("right")}
              aria-label="Afficher les empanadas suivantes"
              className="h-11 w-11 rounded-full border border-secondary/50 text-secondary hover:bg-secondary hover:text-primary"
            >
              →
            </button>
          </div>
        </div>

        {error && (
          <p role="alert" className="mb-6 text-red-300">
            Impossible de charger les empanadas : {error}
          </p>
        )}

        {!error && empanadas.length === 0 && (
          <p>Aucune empanada à afficher pour le moment.</p>
        )}

        {empanadas.length > 0 && (
          <div
            ref={sliderRef}
            className="flex snap-x snap-mandatory gap-5 overflow-x-auto pb-4 scrollbar-brand"
            aria-label="Découvrez nos empanadas"
          >
            {empanadas.map((empanada) => (
              <article
                key={empanada.id}
                className="group w-[85%] shrink-0 snap-start overflow-hidden border border-secondary/25 bg-cream text-primary shadow-xl sm:w-[48%] lg:w-[32%]"
              >
                <div className="relative h-56 overflow-hidden">
                  <img
                    src={
                      empanada.image_url ||
                      "https://placehold.co/800x600?text=Empanada"
                    }
                    alt={empanada.nom}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  />

                  <span className="absolute right-4 top-4 bg-primary/90 px-4 py-2 text-sm font-semibold text-secondary">
                    {formatPrix(calculerTtc(empanada.prixHt, empanada.tauxTva))}
                  </span>
                </div>

                <div className="p-5">
                  <p className="mb-2 text-xs font-bold uppercase tracking-[.2em] text-secondary">
                    {empanada.type === 'SALEE'?'Salée':empanada.type==='SUCREE'?'Sucrée':'Végétarienne'}
                  </p>

                  <h3 className="font-serif text-2xl font-semibold">
                    {empanada.nom}
                  </h3>

                  <p className="mt-3 min-h-12 text-sm leading-6 text-primary/65">
                    {empanada.description}
                  </p>

                  <div className="mt-5 border-t border-secondary/20 pt-4">
                    <span className="text-xs font-semibold uppercase tracking-widest text-secondary">
                      Préparée artisanalement
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

        {/* Les boutons restent accessibles sur mobile grâce au défilement tactile. */}
        <div className="mt-4 flex justify-center gap-3 sm:hidden">
          <button
            type="button"
            onClick={() => scrollSlider("left")}
            aria-label="Afficher les empanadas précédentes"
            className="h-10 w-10 rounded-full border border-secondary/50 text-secondary"
          >
            ←
          </button>
          <button
            type="button"
            onClick={() => scrollSlider("right")}
            aria-label="Afficher les empanadas suivantes"
            className="h-10 w-10 rounded-full border border-secondary/50 text-secondary"
          >
            →
          </button>
        </div>
      </div>
    </section>
  );
}