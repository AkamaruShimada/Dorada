// frontend/src/components/sections/Reassurance.tsx

const items = [
  { title: <>Fait maison<br />chaque jour</>, label: 'Fait maison chaque jour', icon: <><path d="M12 3v3m0 12v3M5.64 5.64l2.12 2.12m8.48 8.48 2.12 2.12M3 12h3m12 0h3M5.64 18.36l2.12-2.12m8.48-8.48 2.12-2.12"/><circle cx="12" cy="12" r="4"/></> },
  { title: <>Ingrédients<br />sélectionnés</>, label: 'Ingrédients sélectionnés', icon: <><path d="M12 21s-7-4.35-7-11a4 4 0 0 1 7-2.65A4 4 0 0 1 19 10c0 6.65-7 11-7 11Z"/><path d="M12 7c-1 2-1 5 0 8"/></> },
  { title: <>Recettes<br />authentiques</>, label: 'Recettes authentiques', icon: <><path d="M4 7h16M6 4h12M5 7l1 13h12l1-13"/><path d="M9 11c1-1 2-1 3 0s2 1 3 0"/></> },
  { title: <>Passion &amp;<br />savoir-faire</>, label: 'Passion et savoir-faire', icon: <><path d="M12 3 14.8 8.7 21 9.6l-4.5 4.4 1.1 6.2L12 17.3l-5.6 2.9 1.1-6.2L3 9.6l6.2-.9L12 3Z"/><path d="m9.5 11.8 1.6 1.6 3.5-3.5"/></> },
];

export default function Reassurance() {
    return (
      <section className="bg-cream px-5 py-14 text-primary md:py-16">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-x-5 gap-y-9 md:grid-cols-4 md:gap-8">
            {items.map((item) => 
                <div key={item.label} className="flex flex-col items-center text-center">
                    <span className="mb-4 flex h-14 w-14 items-center justify-center rounded-full border border-secondary/60 text-secondary">
                        <svg 
                          viewBox="0 0 24 24" 
                          fill="none" 
                          stroke="currentColor" 
                          strokeWidth="1.35" 
                          strokeLinecap="round" 
                          strokeLinejoin="round" 
                          className="h-7 w-7" 
                          aria-hidden="true"
                        >
                            {item.icon}
                        </svg>
                    </span>
                    <p className="font-serif text-lg font-semibold leading-tight">{item.title}</p>
                </div>
            )}
        </div>
      </section>
    )
}
