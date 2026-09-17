// src/components/sections/Hero.tsx

function Hero() {
  return (
    <section className="bg-surface px-6 py-16 md:py-24">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-10">

        {/* Bloc texte */}
        <div className="flex-1 text-center md:text-left">
          <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4">
            Titre principal ici
          </h1>
          <p className="text-lg text-primary/80 mb-6">
            Sous-titre ou description courte du restaurant.
          </p>
          <a
            href="/commander"
            className="inline-block bg-secondary text-primary font-semibold px-6 py-3 rounded-md hover:opacity-90 transition"
          >
            Commander
          </a>
        </div>

        {/* Bloc image — à retirer si non utilisé, juste supprimer ce <div> */}
        <div className="flex-1">
          <img
            src="https://placehold.co/600x400"
            alt="Placeholder"
            className="rounded-lg w-full object-cover"
          />
        </div>

      </div>
    </section>
  );
}

export default Hero;