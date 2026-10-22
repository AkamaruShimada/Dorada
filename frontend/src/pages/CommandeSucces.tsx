// frontend/src/pages/CommandeSucces.tsx

import { useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';

function CommandeSucces() {
  const [params] = useSearchParams();
  const reference = params.get('ref');
  const { clear } = useCart();

  useEffect(() => {
    clear();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="min-h-screen bg-surface p-6 text-primary">
      <div className="mx-auto max-w-xl rounded-xl border border-primary/10 px-6 py-12 text-center shadow-sm">
        <h1 className="text-2xl font-bold">Merci pour ta commande !</h1>
        {reference && (
          <p className="mt-2">
            Référence : <span className="font-mono font-semibold">{reference}</span>
          </p>
        )}
        <p className="mt-2 text-sm opacity-70">
          Un email de confirmation t’a été envoyé.
        </p>
        <Link
          to="/menu"
          className="mt-6 inline-block rounded-lg bg-primary px-4 py-2.5 font-semibold text-surface transition hover:opacity-90"
        >
          Retour au menu
        </Link>
      </div>
    </div>
  );
}

export default CommandeSucces;