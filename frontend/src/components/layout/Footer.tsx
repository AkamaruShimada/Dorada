// frontend/src/components/layout/Footer.tsx

import { Link } from 'react-router-dom';


const navigation = [
  { label: "Accueil", href: "/" },
  { label: "Menu", href: "/menu" },
  { label: "Contact", href: "/contact" },
];

const legal = [
  { label: "Mentions légales", href: "/mentions-legales" },
  { label: "Confidentialité", href: "/confidentialite" },
  { label: "CGU", href: "/cgu" },
  { label: "CGV", href: "/cgv" },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden border-t border-[#b8892e]/20 bg-[#001311] text-white/80">
      {/* Motif décoratif discret */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10 opacity-[0.04] bg-[repeating-linear-gradient(45deg,#b8892e_0_1px,transparent_1px_24px)]"
      />

      <div className="mx-auto grid max-w-[1200px] gap-12 px-6 py-16 md:grid-cols-3">
        {/* Marque */}
        <div className="text-center md:text-left">
          <p className="font-serif text-2xl text-white">Les Farcis</p>
          <p className="mt-2 font-serif text-base italic text-[#b8892e]">
            Empanadas artisanales
          </p>
          <p className="mt-4 text-sm leading-relaxed">
            Des empanadas inspirées de l'Argentine, préparées chaque jour
            avec passion à La Farlède.
          </p>
        </div>

        {/* Navigation */}
        <nav aria-label="Pied de page" className="text-center">
          <p className="mb-4 text-xs uppercase tracking-[0.3em] text-[#b8892e]">
            Navigation
          </p>
          <ul className="space-y-3 text-sm">
            {navigation.map((item) => (
              <li key={item.href}>
                <Link to={item.href} className="transition hover:text-[#b8892e]">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Contact & informations */}
        <div className="text-center md:text-right">
          <p className="mb-4 text-xs uppercase tracking-[0.3em] text-[#b8892e]">
            Contact
          </p>
          <ul className="space-y-3 text-sm">
            <li>La Farlède, France</li>
            <li>
              <a href="mailto:lesfarcislatelier@gmail.com" className="transition hover:text-[#b8892e]">
                contact@lesfarcis.fr
              </a>
            </li>
            <li>
              <a href="tel:+33744417835" className="transition hover:text-[#b8892e]">
                07 44 41 78 35
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* Barre basse */}
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-[1200px] flex-col items-center justify-between gap-4 px-6 py-6 text-xs md:flex-row">
          <p>© {year} Les Farcis. Tous droits réservés.</p>
          <ul className="flex gap-6">
            {legal.map((item) => (
              <li key={item.href}>
                <Link to={item.href} className="transition hover:text-[#b8892e]">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}