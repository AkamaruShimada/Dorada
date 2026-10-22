// frontend/src/components/menu/ProductCard.tsx


type ProductCardProps = {
  nom: string;
  description: string;
  prixTtc: number;
  imageUrl: string;
  actif: boolean;
  stock: number;
  badge?: string;
  quantiteDansPanier: number;
  onAdd: () => void;
};

function ProductCard({
  nom,
  description,
  prixTtc,
  imageUrl,
  actif,
  stock,
  badge,
  quantiteDansPanier,
  onAdd,
}: ProductCardProps) {
  const indisponible = !actif || stock <= 0;
  const stockAtteint = quantiteDansPanier >= stock;

  return (
    <article className="flex flex-col overflow-hidden rounded-xl border border-primary/10 bg-surface shadow-sm">
      <div className="relative aspect-[4/3] bg-primary/5">
        <img src={imageUrl} alt={nom} className="h-full w-full object-cover" />
        {badge && (
          <span className="absolute left-2 top-2 rounded-full bg-surface px-2.5 py-0.5 text-xs font-semibold text-primary shadow">
            {badge}
          </span>
        )}
        {indisponible && (
          <span className="absolute inset-0 flex items-center justify-center bg-surface/70 font-semibold">
            Indisponible
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <h3 className="font-bold">{nom}</h3>
        <p className="line-clamp-2 text-sm opacity-70">{description}</p>

        <div className="mt-auto flex items-center justify-between pt-3">
          <span className="font-semibold tabular-nums">{prixTtc.toFixed(2)} €</span>

          <button
            type="button"
            onClick={onAdd}
            disabled={indisponible || stockAtteint}
            className="rounded-lg bg-primary px-3 py-2 text-sm font-semibold text-surface transition hover:opacity-90 disabled:opacity-40"
          >
            {quantiteDansPanier > 0 ? `Ajouté (${quantiteDansPanier})` : 'Ajouter'}
          </button>
        </div>
      </div>
    </article>
  );
}

export default ProductCard;