// src/components/sections/EmpanadaShowcaseSlider.tsx

import { useEffect, useRef, useState } from "react";
import type { Empanada } from "../../types/admin.types";
import { getEmpanadas } from "../../services/empanada.service";

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
      <section className="bg-[#102820] px-6 py-16 text-center text-[#f5eddd]">
        <p>Découverte de nos empanadas...</p>
      </section>
    );
  }

  return (
    <section className="overflow-hidden bg-[#102820] px-6 py-16 text-[#f5eddd] md:py-24">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex items-end justify-between gap-6">
          <div>
            <p className="mb-2 text-sm font-semibold uppercase tracking-[0.25em] text-[#c49a52]">
              Fait maison avec passion
            </p>
            <h2 className="font-serif text-4xl font-bold md:text-5xl">
              Nos empanadas
            </h2>
          </div>

          <div className="hidden gap-3 sm:flex">
            <button
              type="button"
              onClick={() => scrollSlider("left")}
              aria-label="Afficher les empanadas précédentes"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-[#c49a52]/50 text-[#c49a52] transition hover:bg-[#c49a52] hover:text-[#102820]"
            >
              ←
            </button>

            <button
              type="button"
              onClick={() => scrollSlider("right")}
              aria-label="Afficher les empanadas suivantes"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-[#c49a52]/50 text-[#c49a52] transition hover:bg-[#c49a52] hover:text-[#102820]"
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
            className="flex snap-x snap-mandatory gap-5 overflow-x-auto pb-4"
            aria-label="Découvrez nos empanadas"
          >
            {empanadas.map((empanada) => (
              <article
                key={empanada.id}
                className="group w-[85%] shrink-0 snap-start overflow-hidden rounded-2xl border border-[#c49a52]/25 bg-[#f5eddd] text-[#18251e] shadow-xl sm:w-[48%] lg:w-[32%]"
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

                  <span className="absolute right-4 top-4 rounded-full bg-[#102820]/90 px-4 py-2 text-sm font-semibold text-[#e0bd79]">
                    {empanada.prix.toFixed(2)} €
                  </span>
                </div>

                <div className="p-5">
                  <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-[#9b7539]">
                    {empanada.type}
                  </p>

                  <h3 className="font-serif text-2xl font-bold">
                    {empanada.nom}
                  </h3>

                  <p className="mt-3 min-h-12 text-sm leading-6 text-[#596057]">
                    {empanada.description}
                  </p>

                  <div className="mt-5 border-t border-[#d8cfbd] pt-4">
                    <span className="text-xs font-semibold uppercase tracking-widest text-[#9b7539]">
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
            className="h-10 w-10 rounded-full border border-[#c49a52]/50 text-[#c49a52]"
          >
            ←
          </button>
          <button
            type="button"
            onClick={() => scrollSlider("right")}
            aria-label="Afficher les empanadas suivantes"
            className="h-10 w-10 rounded-full border border-[#c49a52]/50 text-[#c49a52]"
          >
            →
          </button>
        </div>
      </div>
    </section>
  );
}