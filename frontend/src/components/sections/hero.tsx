// src/components/sections/Hero.tsx

import { Link } from 'react-router-dom';

interface HeroProps {
  surtitre?: string;
  titre: string;
  sousTitre: string;
  badges?: string[];
  description: string;
  imageUrl: string;
  imageAlt?: string;
  ctaPrincipal?: { label: string; href: string };
  ctaSecondaire?: { label: string; href: string };
}

function Hero({
  surtitre,
  titre,
  sousTitre,
  badges = [],
  description,
  imageUrl,
  imageAlt = '',
  ctaPrincipal = { label: 'Commander', href: '/menu' },
  ctaSecondaire = { label: 'Découvrir', href: '#histoire' },
}: HeroProps) {
  return (
    <section className="relative isolate min-h-[700px] overflow-hidden bg-primary text-cream sm:min-h-[760px] lg:h-[min(800px,calc(100svh-5rem))] lg:min-h-[640px]">
{/* L'image devient un arrière-plan sur mobile puis une grande image à droite sur desktop. */}
      <img
        src={imageUrl}
        alt={imageAlt}
        className="absolute inset-0 z-0 h-full w-full object-cover object-[center_35%] lg:left-auto lg:w-[61%] lg:object-[center_42%]"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 z-0 bg-gradient-to-t from-primary via-primary/85 to-primary/35 lg:bg-gradient-to-r lg:from-primary lg:via-primary/95 lg:via-40% lg:to-primary/0"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0 opacity-[0.035] bg-[repeating-linear-gradient(45deg,#b88531_0_1px,transparent_1px_26px)]"
      />

        <div className="relative z-10 mx-auto flex min-h-[700px] max-w-[1440px] items-end px-6 pb-16 pt-32 sm:min-h-[760px] sm:px-10 sm:pb-20 lg:h-full lg:min-h-0 lg:items-center lg:px-16 lg:py-16">
        <div className="w-full max-w-[590px] text-center sm:text-left">
          <div aria-hidden="true" className="mb-7 flex items-center justify-center gap-3 text-secondary sm:justify-start">
            <span className="h-px w-10 bg-secondary/70" />
            <span className="text-[10px]">◆</span>
            <span className="h-px w-10 bg-secondary/70" />
          </div>

          {surtitre && (
            <p className="mb-5 flex items-center justify-center gap-3 text-[10px] font-medium uppercase tracking-[0.24em] text-secondary sm:justify-start sm:text-xs sm:tracking-[0.28em]">
              <span aria-hidden="true" className="h-px w-7 bg-secondary/70" />
              {surtitre}
              <span aria-hidden="true" className="h-px w-7 bg-secondary/70" />
            </p>
          )}

          <h1 className="font-serif text-6xl font-semibold uppercase leading-[0.88] tracking-[0.055em] text-cream sm:text-7xl lg:text-[clamp(5rem,8vw,7.5rem)]">
            {titre}
          </h1>
          <p className="mt-5 font-serif text-2xl font-medium uppercase tracking-[0.09em] text-secondary sm:text-3xl">
            {sousTitre}
          </p>

          {badges.length > 0 && (
            <ul className="mt-5 flex flex-wrap justify-center gap-x-3 text-[10px] font-medium uppercase tracking-[0.17em] text-cream/80 sm:justify-start sm:text-[11px] sm:tracking-[0.2em]">
              {badges.map((badge, index) => (
                <li key={badge} className="flex items-center gap-3">
                  {index > 0 && <span aria-hidden="true" className="text-secondary">•</span>}
                  {badge}
                </li>
              ))}
            </ul>
          )}

          <p className="mx-auto mt-7 max-w-md text-sm leading-7 text-cream/85 sm:mx-0 sm:text-base">
            {description}
          </p>

          <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row sm:justify-start">
            <Link
              to={ctaPrincipal.href}
              className="inline-flex min-h-12 items-center justify-center bg-secondary px-7 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-primary transition-colors hover:bg-cream focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-secondary"
            >
              {ctaPrincipal.label}
            </Link>
            <Link
              to={ctaSecondaire.href}
              className="inline-flex min-h-12 items-center justify-center border border-cream/65 px-7 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-cream transition-colors hover:border-secondary hover:bg-primary/30 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-secondary"
            >
              {ctaSecondaire.label}
            </Link>
          </div>
        </div>
      </div>
      <span aria-hidden="true" className="pointer-events-none absolute bottom-7 right-8 z-10 hidden font-serif text-xs uppercase tracking-[0.3em] text-secondary/80 lg:block">
        Fait maison · La Farlède
      </span>
    </section>
  );
}

export default Hero;