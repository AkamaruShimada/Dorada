import { useState } from "react";
import { useCart } from "../../contexts/CartContext";

function Header() {
  const [menuOuvert, setMenuOuvert] = useState<boolean>(false);
  const { nombreArticles } = useCart();

  return (
    <header className="bg-primary text-surface">
      <div className="flex items-center justify-around px-6 py-4">

        {/* Logo */}
        <a href="/" className="font-bold text-xl">
          <img src="https://res.cloudinary.com/b9qac4kt/image/upload/v1794151836/logo-lesfarcis.png" alt="Logo" className="h-30 w-auto" />
        </a>

        {/* Navigation desktop */}
        <nav className="hidden md:flex gap-6">
          <a href="/">Accueil</a>
          <a href="/menu">Menu</a>
          <a href="/contact">Contact</a>
        </nav>

        {/* Actions desktop : Panier + Commander */}
        <div className="hidden md:flex items-center gap-4">
          <BoutonPanier nombre={nombreArticles} />

          <a
            href="/menu"
            className="bg-secondary text-primary font-semibold px-5 py-2 rounded-md hover:opacity-90 transition"
            hidden
          >
            Commander
          </a>
        </div>

        {/* Bouton burger (mobile uniquement) */}
        <button
          className="md:hidden flex flex-col gap-1"
          onClick={() => setMenuOuvert(!menuOuvert)}
          aria-label="Ouvrir le menu"
          aria-expanded={menuOuvert}
        >
          <span className="w-6 h-0.5 bg-surface"></span>
          <span className="w-6 h-0.5 bg-surface"></span>
          <span className="w-6 h-0.5 bg-surface"></span>
        </button>
      </div>

      {/* Menu mobile déroulant */}
      {menuOuvert && (
        <nav className="md:hidden flex flex-col items-center gap-4 px-6 pb-4">
          <a href="/">Accueil</a>
          <a href="/menu">Menu</a>
          <a href="/contact">Contact</a>

          <div className="flex items-center gap-4">
            <BoutonPanier nombre={nombreArticles} />
            <a
              href="/menu"
              className="flex-1 bg-secondary text-primary font-semibold px-5 py-2 rounded-md text-center"
              hidden
            >
              Commander
            </a>
          </div>
        </nav>
      )}
    </header>
  );
}

interface BoutonPanierProps {
  nombre: number;
}

function BoutonPanier({ nombre }: BoutonPanierProps) {
  return (
    <a
      href="/panier"
      aria-label={`Panier, ${nombre} article${nombre > 1 ? "s" : ""}`}
      className="relative inline-flex items-center justify-center p-2 rounded-md hover:bg-surface/10 transition"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-6 w-6"
        aria-hidden="true"
      >
        <circle cx="9" cy="21" r="1" />
        <circle cx="20" cy="21" r="1" />
        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
      </svg>

      {nombre > 0 && (
        <span className="absolute -top-1 -right-1 flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-secondary px-1 text-xs font-bold text-primary">
          {nombre}
        </span>
      )}
    </a>
  );
}

export default Header;