// src/components/sections/MenuEmpanadas.tsx

import { empanadas } from "../../data/empanadas";
import EmpanadaCard from "../ui/EmpanadaCard";

function MenuEmpanadas() {
  return (
    <section className="bg-primary py-16 px-6">
      <h2 className="text-center text-secondary text-3xl font-bold mb-10">
        Nos Empanadas
      </h2>

      {/* Grid responsive : 1 colonne mobile, 3 colonnes desktop */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
        {empanadas.map((empanada) => (
          <EmpanadaCard key={empanada.id} empanada={empanada} />
        ))}
      </div>
    </section>
  );
}

export default MenuEmpanadas;