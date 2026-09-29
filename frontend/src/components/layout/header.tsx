import { useState } from "react";

function Header() {
  const [menuOuvert, setMenuOuvert] = useState<boolean>(false);

  return (
    <header className="bg-primary text-surface">
      <div className="flex items-center justify-between px-6 py-4">

        {/* Logo */}
        <a href="/" className="font-bold text-xl">
          <img src="/images/dorada_logo.png" alt="Logo" className="h-30 w-auto" />
        </a>

        {/* Navigation desktop */}
        <nav className="hidden md:flex gap-6">
          <a href="/menu">Menu</a>
          <a href="/a-propos">À propos</a>
          <a href="/contact">Contact</a>
        </nav>

        {/* Bouton Commander (desktop) */}
        <a
          href="/commander"
          className="hidden md:inline-block bg-secondary text-primary font-semibold px-5 py-2 rounded-md hover:opacity-90 transition"
        >
          Commander
        </a>

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
        <nav className="md:hidden flex flex-col gap-4 px-6 pb-4">
          <a href="/menu">Menu</a>
          <a href="/a-propos">À propos</a>
          <a href="/contact">Contact</a>
          <a
            href="/commander"
            className="bg-secondary text-primary font-semibold px-5 py-2 rounded-md text-center"
          >
            Commander
          </a>
        </nav>
      )}
    </header>
  );
}

export default Header;