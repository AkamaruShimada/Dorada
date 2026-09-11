import type { Empanada } from "../../types"

// Props typées : ce composant attend un objet "empanada" de type Empanada
interface EmpanadaCardProps {
  empanada: Empanada;
}

export default function EmpanadaCard({ empanada }: EmpanadaCardProps) {
  return (
    <div className="bg-white rounded-lg p-4">
      <img src={empanada.image} alt={empanada.nom} className="w-full h-40 object-cover rounded" />
      <h3 className="font-bold text-lg mt-2">{empanada.nom}</h3>
      <p className="text-sm text-gray-600">{empanada.description}</p>
      <span className="text-gold font-semibold">{empanada.prix.toFixed(2)} €</span>
    </div>
  );
}