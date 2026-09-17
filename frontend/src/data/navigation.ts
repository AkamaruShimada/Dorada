// src/data/navigation.ts

export interface NavLink {
  label: string;
  href: string;
}

export const navLinks: NavLink[] = [
  { label: 'Accueil', href: '/' },
  { label: 'Nos Empanadas', href: '/empanadas' },
  { label: 'Formules', href: '/formules' },
  { label: 'Traiteur', href: '/traiteur' },
  { label: 'Contact', href: '/contact' },
];