// frontend/components/sections/PageBanner

import { Link } from 'react-router-dom';

type PageBannerProps = {
  eyebrow?: string;
  title: string;
  subtitle: string;
  imageUrl: string;
  imageAlt?: string;
  cta?: { label: string; href: string };
};

function PageBanner({ eyebrow, title, subtitle, imageUrl, imageAlt = '', cta }: PageBannerProps) {
  return (

    <section className="relative isolate overflow-hidden bg-primary text-cream">
      <div aria-hidden className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_18%_50%,rgba(184,133,49,.18),transparent_60%)]" />
      <div className="mx-auto grid min-h-[25rem] max-w-7xl items-center md:grid-cols-[1fr_.9fr]">
        <div className="relative z-10 px-6 py-14 text-center md:px-12 md:text-left">
          {eyebrow && <p className="mb-3 text-xs uppercase tracking-[.32em] text-secondary">{eyebrow}</p>}
          <h1 className="font-serif text-4xl font-semibold uppercase leading-[.98] tracking-[.04em] text-secondary sm:text-5xl md:text-6xl">{title}</h1>
          <p className="mx-auto mt-5 max-w-lg font-serif text-xl italic text-cream/85 md:mx-0 md:text-2xl">{subtitle}</p>
          {cta && <Link to={cta.href} className="mt-7 inline-flex border border-secondary bg-secondary px-6 py-3 text-sm font-semibold uppercase tracking-widest text-primary transition hover:bg-transparent hover:text-secondary">{cta.label}</Link>}
        </div>
        <div className="relative h-56 overflow-hidden md:absolute md:inset-y-0 md:right-0 md:h-full md:w-[49%]">
          <img src={imageUrl} alt={imageAlt} className="h-full w-full object-cover object-center md:[mask-image:linear-gradient(to_right,transparent,black_20%)]" />
          <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-primary/35 to-transparent md:hidden" />
        </div>
      </div>
    </section>
  );
}

export default PageBanner;