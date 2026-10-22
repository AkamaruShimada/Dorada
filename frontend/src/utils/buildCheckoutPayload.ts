// frontend/src/utils/buildCheckoutPayload

import type { CheckoutPayload } from '../services/menu.service';
import type { CartItem } from '../types/cart.types';

interface ClientInfos {
  clientNom: string;
  clientEmail: string;
  clientTelephone: string;
  modeRecuperation: 'RETRAIT' | 'LIVRAISON';
  adresseLivraison?: string;
  dateSouhaitee: string;
}

export function buildCheckoutPayload(items: CartItem[], client: ClientInfos): CheckoutPayload {
  const empanadas = items
    .filter((i) => i.kind === 'empanada')
    .map((i) => ({ empanadaId: i.id, quantite: i.quantite }));

  const extras = items
    .filter((i) => i.kind === 'extra')
    .map((i) => ({ extraId: i.id, quantite: i.quantite }));

  const formules = items
    .filter((i) => i.kind === 'formule')
    .map((i) => ({
      formuleId: i.id,
      quantite: i.quantite,
      empanadasChoisies: i.empanadasChoisies.map((e) => e.id),
      extrasChoisies: i.extrasChoisis.map((e) => e.id),
    }));

  return { ...client, empanadas: empanadas ?? [], extras: extras ?? [], formules: formules ?? [] };
}