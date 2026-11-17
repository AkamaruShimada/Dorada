import { useState } from "react";
import { NavLink } from "react-router-dom";
import { useCart } from "../../contexts/CartContext";

const links = [
  { to: "/", label: "Accueil" },
  { to: "/menu", label: "Menu" },
  { to: "/contact", label: "Contact" },
];

function Header() {
  const [open, setOpen] = useState<boolean>(false);
  const { nombreArticles } = useCart();

  const navClass = ({ isActive }: { isActive: boolean }) =>
    `relative py-2 text-sm uppercase tracking-[.12em] transition hover:text-secondary after:absolute after:bottom-0 after:left-0 after:h-px after:bg-secondary after:transition-all ${
      isActive ? "text-secondary after:w-full" : "after:w-0 hover:after:w-full"
    }`;

  return (
    <header className="sticky top-0 z-40 border-b border-secondary/20 bg-primary text-cream">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-3 sm:px-8">

        <NavLink 
          to="/" 
          aria-label="Les Farcis, accueil">
            <img src="https://res.cloudinary.com/b9qac4kt/image/upload/v1794929019/logo_lesfarcis.svg" alt="Les Farcis" className="h-14 w-auto" />
        </NavLink>
        
        <nav aria-label="Navigation principale" className="hidden items-center gap-8 md:flex">
          {links.map((l) => 
            <NavLink 
              key={l.to} 
              to={l.to} 
              className={navClass}
            >
              {l.label}
            </NavLink>
          )}
        </nav>

        <div className="hidden items-center gap-4 md:flex">
          <CartLink count={nombreArticles}/>
          <NavLink 
            className="bg-secondary px-5 py-2 text-primary font-semibold rounded-md hover:opacity-90 transition"
            to="/menu"
          >
            Commander
          </NavLink>
        </div>

        <button 
          type="button" 
          className="flex h-10 w-10 flex-col items-center justify-center gap-1.5 md:hidden" 
          onClick={() => setOpen(!open)} 
          aria-label={open ? 'Fermer le menu' : 'Ouvrir le menu'} 
          aria-expanded={open}
        >
          <span className={`h-px w-6 bg-cream transition ${open ? 'translate-y-[4px] rotate-45' : ''}`} />
          <span className={`h-px w-6 bg-cream transition ${open ? 'opacity-0' : ''}`} />
          <span className={`h-px w-6 bg-cream transition ${open ? '-translate-y-[4px] -rotate-45' : ''}`} />
        </button>

      </div>
        {open && 
        <nav aria-label="Navigation mobile" className="flex flex-col items-center gap-3 border-t border-secondary/20 px-6 py-5 md:hidden">
          {links.map((l) => 
            <NavLink 
              key={l.to} 
              to={l.to} 
              onClick={() => setOpen(false)} 
              className={navClass}>{l.label}
            </NavLink>)}
          <div className="mt-2 flex items-center gap-5">
            <CartLink count={nombreArticles}/>
            <NavLink 
              to="/menu" 
              onClick={() => setOpen(false)} 
              className="bg-secondary px-5 py-2.5 text-xs font-bold uppercase tracking-widest text-primary">
                Commander
              </NavLink>
          </div>
        </nav>}
      </header>
    )
}

function CartLink({ count }: { count: number }) { 
  return (
    <NavLink 
      className="relative rounded p-2 hover:bg-cream/10"
      to="/panier" 
      aria-label={`Panier, ${count} article${count !== 1 ? 's' : ''}`} 
    >  
      <svg 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="1.6" 
        className="h-6 w-6" 
        aria-hidden="true"
      >  
        <circle cx="9" cy="21" r="1"/>
        <circle cx="20" cy="21" r="1"/>
        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
      </svg>
      
      {count > 0 && 
      <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-secondary px-1 text-[10px] font-bold text-primary">
        {count}
      </span>}
    </NavLink> 
  )
} 

export default Header;