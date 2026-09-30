// src/components/sections/MenuEmpanadas.tsx

import { useEffect, useState } from "react";
import type { Empanada } from "../../types/admin.types";
import { getEmpanadas } from "../../services/empanada.service";
import EmpanadaCard from "../ui/EmpanadaCard";

function MenuEmpanadas() {
  const [empanadas, setEmpanadas] = useState<Empanada[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadEmpanadas();
  }, []);

  async function loadEmpanadas() {
    try {
      setIsLoading(true);
      setError(null);
      const data = await getEmpanadas();
      setEmpanadas(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
    } finally {
      setIsLoading(false);
    }
  }

  if (isLoading) return <p>Chargement des empanadas...</p>;

  return (
    <section className="bg-primary px-6 py-16 md:py-24">
      <div className="max-w-6xl mx-auto flex flex-col items-center gap-10">
        <h1 className="text-4xl md:text-5xl font-bold text-secondary mb-4">
          Nos Empanadas
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {empanadas.map((empanada) => (
            <EmpanadaCard key={empanada.id} empanada={empanada} />
          ))}
        </div>
      </div>

      {error && <p className="error-banner">{error}</p>}
    </section>
  );
}

export default MenuEmpanadas;