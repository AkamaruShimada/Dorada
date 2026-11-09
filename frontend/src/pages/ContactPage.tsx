// frontend/src/pages/ContactPage.tsx

import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import ContactForm, { type ContactFormValues } from '../components/contact/ContactForm';
import ContactInfoCard from '../components/contact/ContactInfoCard';
import HoraireTable from '../components/contact/HoraireTable';

async function envoyerMessage(values: ContactFormValues): Promise<void> {
  // Branchement à faire : appel à ton API (ex. POST /api/contact)
  // Pour l'instant on simule un délai pour tester l'UI
  await new Promise((resolve) => setTimeout(resolve, 800));
  console.log('Message contact :', values);
}

function ContactPage() {
  return (
    <>
      <Header />

      <main className="min-h-screen bg-surface p-4 text-primary sm:p-6">
        <div className="mx-auto max-w-7xl space-y-10">
          <header>
            <h1 className="text-3xl font-bold tracking-tight">Contactez-nous</h1>
            <p className="mt-1 text-sm opacity-70">
              Une question sur votre commande, un allergène, un événement ? Écrivez-nous.
            </p>
          </header>

          <div className="grid gap-8 lg:grid-cols-3">
            {/* Colonne infos */}
            <section className="space-y-4 lg:col-span-1">
              <ContactInfoCard icone={<span aria-hidden>📍</span>} titre="Adresse">
                <p>1 Rue de la Gare, 83210 La Farlède</p>
              </ContactInfoCard>

              <ContactInfoCard icone={<span aria-hidden>📞</span>} titre="Téléphone">
                <a href="tel:+33744417835" className="underline">07 44 41 78 35</a>
              </ContactInfoCard>

              <ContactInfoCard icone={<span aria-hidden>✉️</span>} titre="Email">
                <a href="mailto:lesfarcislatelier@gmail.com" className="underline">lesfarcislatelier@gmail.com</a>
              </ContactInfoCard>

              <div className="rounded-2xl border border-primary/10 bg-surface p-5 shadow-sm">
                <h3 className="mb-3 font-semibold">Horaires</h3>
                <HoraireTable />
              </div>
            </section>

            {/* Colonne formulaire */}
            <section className="rounded-2xl border border-primary/10 bg-surface p-6 shadow-sm lg:col-span-2">
              <h2 className="mb-4 text-xl font-semibold">Envoyez-nous un message</h2>
              <ContactForm onSubmit={envoyerMessage} />
            </section>
          </div>
        </div>
      </main>

      <Footer/>
    </>
  );
}

export default ContactPage;