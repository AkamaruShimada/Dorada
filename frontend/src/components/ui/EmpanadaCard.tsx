import type { Empanada } from "../../types/admin.types";

// Props typées : ce composant attend un objet "empanada" de type Empanada
interface EmpanadaCardProps {
  empanada: Empanada;
}

export default function EmpanadaCard({ empanada }: EmpanadaCardProps) {
  return (
    <div className="bg-surface rounded-lg p-4">
      <img src={empanada.image_url || "https://placehold.co/600x400"} alt={empanada.nom} className="w-full h-40 object-cover rounded" />
      <h3 className="font-bold text-lg mt-2">{empanada.nom}</h3>
      <h2 className="text-lg mt-2">{empanada.type}</h2>
      <p className="text-sm text-gray-600">{empanada.description}</p>
      <span className="text-gold font-semibold">{empanada.prix.toFixed(2)} €</span>
    </div>
  );
}