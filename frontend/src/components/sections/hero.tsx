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
    <section className="relative isolate h-[800px] max-h-[100vh] min-h-[600px] overflow-hidden bg-[#001311] text-white">
      {/* Fond décoratif */}
      <div
        aria-hidden
        className="absolute inset-0 -z-30 bg-[radial-gradient(circle_at_25%_50%,rgba(184,137,46,0.10),transparent_55%)]"
      />
      <div
        aria-hidden
        className="absolute inset-0 -z-30 opacity-[0.04] bg-[repeating-linear-gradient(45deg,#b8892e_0_1px,transparent_1px_24px)]"
      />

        <div className="relative mx-auto grid h-full max-w-[1600px] grid-cols-1 lg:grid-cols-[1fr_minmax(0,1100px)_1fr]">
          {/* Colonne gauche : texte */}
          <div className="flex items-center px-6 lg:px-10">
            <div className="max-w-md text-center lg:text-left">
              <div className="max-w-xl text-center md:text-left">
                {surtitre && (
                  <p className="mb-4 text-xs uppercase tracking-[0.3em] text-secondary">{surtitre}</p>
                )}

                <h1 className="font-serif text-5xl font-bold leading-tight md:text-6xl">{titre}</h1>
                <p className="mt-2 font-serif text-2xl italic text-secondary md:text-3xl">{sousTitre}</p>

                {badges.length > 0 && (
                  <ul className="mt-6 flex flex-wrap justify-center gap-x-4 gap-y-1 text-xs uppercase tracking-widest text-white/70 md:justify-start">
                    {badges.map((b) => (
                      <li key={b} className="after:ml-4 after:content-['•'] last:after:content-none">
                        {b}
                      </li>
                    ))}
                  </ul>
                )}

                <p className="mx-auto mt-6 max-w-md text-white/80 md:mx-0">{description}</p>

                <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row md:justify-start">
                  <Link
                    to={ctaPrincipal.href}
                    className="rounded-sm bg-secondary px-7 py-3 text-sm font-semibold uppercase tracking-wider text-dark transition hover:opacity-90"
                  >
                    {ctaPrincipal.label}
                  </Link>
                  <Link
                    to={ctaSecondaire.href}
                    className="rounded-sm border border-white/40 px-7 py-3 text-sm font-semibold uppercase tracking-wider transition hover:bg-white/10"
                  >
                    {ctaSecondaire.label}
                  </Link>
                </div>
              </div>
          </div>
        </div>

    {/* Colonne centrale : image */}
        <div className="relative h-full">
          <img
            src={imageUrl}
            alt={imageAlt}
            className="absolute inset-0 h-full w-full object-cover object-[center_30%] [mask-image:linear-gradient(to_right,transparent,black_6%,black_94%,transparent)]"
          />
        </div>

        {/* Colonne droite : décor */}
        <div className="hidden lg:flex flex-col items-center justify-center gap-6 px-6">
          <div className="h-px w-12 bg-[#b8892e]/60" />
          <p className="font-serif text-xs italic tracking-[0.3em] text-[#b8892e]/80">
            AUTHENTIQUE
          </p>
          <div className="h-px w-12 bg-[#b8892e]/60" />
        </div>
      </div>
    </section>
  );
}

export default Hero;