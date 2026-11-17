// frontend/src/components/sections/TraiteurBanner

import { Link } from 'react-router-dom';

type TraiteurBannerProps = {
  contactHref?: string;
  contactLabel?: string;
  imageUrl?: string;
  imageAlt?: string;
};

export default function TraiteurBanner({
  contactHref = '/contact', contactLabel = 'Demander un devis',
  imageUrl = 'https://res.cloudinary.com/b9qac4kt/image/upload/v1794942165/traiteur_banner.png',
  imageAlt = 'Empanadas préparées pour un événement',
}: TraiteurBannerProps) {
  return (
    <section className="relative isolate overflow-hidden bg-primary text-cream">
      <div aria-hidden className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_20%_50%,rgba(184,133,49,.15),transparent_58%)]" />
      <div className="mx-auto grid min-h-[22rem] max-w-7xl items-center md:grid-cols-[1fr_.85fr]">
        <div className="px-6 py-12 text-center md:px-12 md:text-left">
          <p className="mb-3 text-xs uppercase tracking-[.3em] text-secondary">Pour vos beaux moments</p>
          <h2 className="font-serif text-3xl font-semibold uppercase tracking-[.06em] text-secondary sm:text-4xl">Traiteur &amp; événements</h2>
          <p className="mx-auto mt-4 max-w-xl leading-7 text-cream/80 md:mx-0">Anniversaire, réunion, apéritif, réception ou repas d'entreprise : nous préparons vos empanadas sur commande.</p>
          <Link to={contactHref} className="mt-7 inline-flex items-center gap-3 bg-secondary px-6 py-3 text-sm font-bold uppercase tracking-widest text-primary transition hover:-translate-y-0.5 hover:bg-cream">{contactLabel}<span aria-hidden>↗</span></Link>
        </div>
        <div className="relative h-56 overflow-hidden md:absolute md:inset-y-0 md:right-0 md:h-full md:w-[43%]">
          <img src={imageUrl} alt={imageAlt} className="h-full w-full object-cover [mask-image:linear-gradient(to_right,transparent,black_22%)]" />
        </div>
      </div>
    </section>
  );
}
