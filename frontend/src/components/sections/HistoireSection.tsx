// frontend/src/components/sections/HistoireSection.tsx

interface HistoireSectionProps {
  id?: string;
  imageUrl: string;
  imageAlt?: string;
  titre: string[];        // lignes du titre, ex. ["De l'Argentine", "à La Farlède"]
  paragraphes: string[];
  signature?: string;
}

function HistoireSection({
  id,
  imageUrl,
  imageAlt = '',
  titre,
  paragraphes,
  signature,
}: HistoireSectionProps) {
  return (
    <section id={id} className="scroll-mt-24 bg-surface px-6 py-16 text-primary md:py-24">
      <div className="mx-auto grid max-w-7xl items-center gap-10 md:grid-cols-2">

        {/* Bloc image : à gauche, même traitement que le Hero */}
        <div className="relative">
          <img
            src={imageUrl}
            alt={imageAlt}
            width={800}
            height={600}
            className="w-full rounded-lg object-cover shadow-2xl"
          />
        </div>

        {/* Bloc texte : à droite, centré verticalement */}
        <div className="text-center md:text-left">
          <h2 className="font-serif text-4xl uppercase leading-tight text-secondary md:text-5xl">
            {titre.map((ligne) => (
              <span key={ligne} className="block">{ligne}</span>
            ))}
          </h2>

          <div
            className="mx-auto my-6 h-px w-16 bg-secondary md:mx-0"
            aria-hidden
          />

          <div className="mx-auto max-w-md space-y-4 text-primary/80 md:mx-0">
            {paragraphes.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>

          {signature && (
            <p className="mt-8 font-serif text-3xl italic text-secondary">{signature}</p>
          )}
        </div>

      </div>
    </section>
  );
}

export default HistoireSection;