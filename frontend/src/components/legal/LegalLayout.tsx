// frontend/src/components/legal/LegalLayout.tsx

import type { ReactNode } from 'react';
import Header from '../layout/Header';
import Footer from '../layout/Footer';

interface LegalLayoutProps {
  titre: string;
  dateMiseAJour: string;
  children: ReactNode;
}

function LegalLayout({ titre, dateMiseAJour, children }: LegalLayoutProps) {
  return (
    <>
      <Header />

      <main className="min-h-screen bg-surface p-4 text-primary sm:p-6">
        <div className="mx-auto max-w-4xl space-y-8">
          <header>
            <h1 className="text-3xl font-bold tracking-tight">{titre}</h1>
            <p className="mt-1 text-sm opacity-70">Dernière mise à jour : {dateMiseAJour}</p>
          </header>

          <article className="space-y-8 rounded-2xl border border-primary/10 bg-surface p-6 shadow-sm sm:p-8">
            {children}
          </article>
        </div>
      </main>

      <Footer />
    </>
  );
}

export function LegalSection({ titre, children }: { titre: string; children: ReactNode }) {
  return (
    <section className="space-y-3 leading-relaxed">
      <h2 className="text-xl font-semibold">{titre}</h2>
      {children}
    </section>
  );
}

export default LegalLayout;