// frontend/src/pages/CGVPage.tsx

import LegalLayout, { LegalSection } from '../components/legal/LegalLayout';
import { LEGAL } from '../constants/legal';

function CGVPage() {
  return (
    <LegalLayout titre="Conditions générales de vente" dateMiseAJour={LEGAL.dateMiseAJour}>
      <LegalSection titre="1. Champ d'application">
        <p>
          Les présentes conditions s'appliquent à toutes les commandes passées sur le site{' '}
          {LEGAL.nomSite} par des consommateurs. Elles sont acceptées avant toute validation
          de commande.
        </p>
      </LegalSection>

      <LegalSection titre="2. Produits">
        <p>
          Les produits proposés (empanadas, extras, boissons, formules) sont décrits sur le site
          avec leurs caractéristiques essentielles. Les photographies sont non contractuelles.
        </p>
        <p>
          Les produits sont préparés artisanalement dans la limite des stocks disponibles. Un
          produit indiqué « indisponible » ne peut être commandé.
        </p>
      </LegalSection>

      <LegalSection titre="3. Prix">
        <p>
          Les prix sont exprimés en euros, toutes taxes comprises (TVA incluse). Les frais
          éventuels de livraison ou de retrait sont précisés avant la validation.
        </p>
        <p>L'éditeur se réserve le droit de modifier ses prix à tout moment. Le prix applicable est celui affiché lors de la commande.</p>
      </LegalSection>

      <LegalSection titre="4. Commande">
        <p>
          Le client sélectionne ses produits, renseigne ses coordonnées et son créneau de
          retrait, puis valide sa commande. Un email de confirmation lui est adressé.
        </p>
        <p>
          L'éditeur peut refuser une commande pour motif légitime (stock insuffisant, erreur de
          prix, anomalie).
        </p>
      </LegalSection>

      <LegalSection titre="5. Paiement">
        <p>
          Le paiement s'effectue en ligne via la plateforme sécurisée Stripe, au moment de la
          commande. Les moyens de paiement acceptés sont affichés lors du processus de commande.
        </p>
        <p>
          La commande est considérée comme ferme et définitive après confirmation du paiement.
        </p>
      </LegalSection>

      <LegalSection titre="6. Retrait des commandes">
        <p>
          Les commandes sont à retirer à l'adresse indiquée, au créneau choisi. Le client doit
          se présenter avec son numéro de commande. Une commande non retirée dans les délais
          pourra être annulée.
        </p>
      </LegalSection>

      <LegalSection titre="7. Annulation et modification">
        <p>
          Toute demande d'annulation ou de modification doit être adressée à{' '}
          <a href={`mailto:${LEGAL.email}`} className="underline">{LEGAL.email}</a> ou par
          téléphone au {LEGAL.telephone}, avant la préparation de la commande.
        </p>
        <p>
          Les produits alimentaires préparés sur commande et personnalisés ne sont pas
          remboursables, sauf erreur de l'éditeur ou produit non conforme.
        </p>
      </LegalSection>

      <LegalSection titre="8. Remboursement">
        <p>
          En cas de produit non conforme ou d'erreur de préparation, le client peut obtenir un
          remboursement ou un échange, après vérification, en contactant l'éditeur dans un délai
          raisonnable après le retrait.
        </p>
        <p>
          Le remboursement est effectué sur le moyen de paiement utilisé lors de la commande.
        </p>
      </LegalSection>

      <LegalSection titre="9. Allergènes">
        <p>
          Les empanadas sont préparées dans un environnement où peuvent être présents des
          allergènes (gluten, œufs, lait, fruits à coque, etc.). Le client doit signaler toute
          allergie lors de la commande. L'éditeur ne peut garantir l'absence totale de traces.
        </p>
      </LegalSection>

      <LegalSection titre="10. Responsabilité">
        <p>
          La responsabilité de l'éditeur est limitée au montant de la commande concernée, sauf
          dispositions légales contraires.
        </p>
      </LegalSection>

      <LegalSection titre="11. Données personnelles">
        <p>
          Les données collectées lors de la commande sont traitées conformément à notre{' '}
          <a href="/confidentialite" className="underline">politique de confidentialité</a>.
        </p>
      </LegalSection>

      <LegalSection titre="12. Médiation et litiges">
        <p>
          En cas de litige, le client peut contacter l'éditeur en priorité. Conformément au
          Code de la consommation, il peut également recourir gratuitement à un médiateur de la
          consommation.
        </p>
        <p>
          À défaut de résolution amiable, les tribunaux de {LEGAL.tribunal} sont compétents.
        </p>
      </LegalSection>

      <LegalSection titre="13. Droit applicable">
        <p>Les présentes conditions sont régies par le droit français.</p>
      </LegalSection>
    </LegalLayout>
  );
}

export default CGVPage;