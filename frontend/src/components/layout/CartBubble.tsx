// frontend/src/components/layout/CartBubble

import { Link, useLocation } from 'react-router-dom';
import { useCart } from '../../contexts/CartContext';
import { formatPrix, totalPanierTtc } from '../../utils/pricing';

export default function CartBubble() {
  const { items } = useCart();
  const { pathname } = useLocation();

  const count = items.reduce((n, item) => n + item.quantite, 0);

  // Masquée si le panier est vide ou si on est déjà sur la page panier
  if (count === 0 || pathname === '/panier') return null;

  return (
    <Link
      to="/panier"
      aria-label={`Voir le panier : ${count} article${count > 1 ? 's' : ''}, ${formatPrix(totalPanierTtc(items))}`}
      className="fixed bottom-5 right-5 z-50 flex h-16 w-16 items-center justify-center
                 rounded-full bg-secondary text-primary shadow-lg shadow-black/30
                 transition-transform active:scale-95 animate-bubble-in md:hidden
                 mb-[env(safe-area-inset-bottom)]"
    >
      {/* Icône panier */}
      <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true">
        <path d="M6 7h12l-1 13H7L6 7z" />
        <path d="M9 7V5a3 3 0 0 1 6 0v2" />
      </svg>

      {/* Pastille du nombre d'articles */}
      <span
        className="absolute -right-1 -top-1 flex h-6 min-w-6 items-center justify-center
                   rounded-full bg-primary px-1.5 text-xs font-bold text-secondary
                   ring-2 ring-secondary"
      >
        {count > 99 ? '99+' : count}
      </span>
    </Link>
  );
}