// frontend/src/pages/ConfidentialitePage.tsx

import LegalLayout, { LegalSection } from '../components/legal/LegalLayout';
import { LEGAL } from '../constants/legal';

function ConfidentialitePage() {
  return (
    <LegalLayout titre="Politique de confidentialité" dateMiseAJour={LEGAL.dateMiseAJour}>
      <LegalSection titre="1. Responsable du traitement">
        <p>
          Le responsable du traitement des données est {LEGAL.nomEntreprise}, joignable à
          l'adresse <a href={`mailto:${LEGAL.email}`} className="underline">{LEGAL.email}</a>.
        </p>
      </LegalSection>

      <LegalSection titre="2. Données collectées">
        <ul className="list-disc space-y-1 pl-6">
          <li><strong>Formulaire de contact :</strong> nom, adresse email, message.</li>
          <li><strong>Commandes :</strong> nom, email, téléphone, adresse de retrait, historique de commande.</li>
          <li><strong>Compte administrateur :</strong> identifiants et informations de profil.</li>
          <li><strong>Paiement :</strong> les données bancaires sont traitées directement par notre prestataire Stripe. Nous ne stockons aucun numéro de carte.</li>
          <li><strong>Données techniques :</strong> adresse IP, navigateur, cookies strictement nécessaires au fonctionnement du site.</li>
        </ul>
      </LegalSection>

      <LegalSection titre="3. Finalités et bases légales">
        <ul className="list-disc space-y-1 pl-6">
          <li>Traiter et suivre les commandes (exécution du contrat).</li>
          <li>Répondre aux messages envoyés via le formulaire (intérêt légitime).</li>
          <li>Gérer les comptes utilisateurs (exécution du contrat).</li>
          <li>Respecter les obligations comptables et fiscales (obligation légale).</li>
          <li>Assurer la sécurité du site (intérêt légitime).</li>
        </ul>
      </LegalSection>

      <LegalSection titre="4. Durée de conservation">
        <ul className="list-disc space-y-1 pl-6">
          <li>Messages de contact : {LEGAL.delaiRetentionDonnees}.</li>
          <li>Commandes et factures : 10 ans (obligation comptable).</li>
          <li>Comptes utilisateurs : {LEGAL.delaiRetentionCompte}.</li>
        </ul>
      </LegalSection>

      <LegalSection titre="5. Destinataires">
        <p>
          Les données sont destinées à {LEGAL.nomEntreprise}. Elles peuvent être transmises
          à nos sous-traitants techniques (hébergeur, prestataire de paiement Stripe,
          service d'envoi d'emails), strictement dans la limite de leurs besoins.
        </p>
      </LegalSection>

      <LegalSection titre="6. Transferts hors Union européenne">
        <p>
          Si certains sous-traitants sont situés hors de l'Union européenne, des garanties
          appropriées sont mises en place (clauses contractuelles types de la Commission
          européenne ou décision d'adéquation).
        </p>
      </LegalSection>

      <LegalSection titre="7. Vos droits">
        <p>
          Conformément au RGPD et à la loi Informatique et Libertés, vous disposez des droits
          d'accès, de rectification, d'effacement, de limitation, d'opposition et de
          portabilité de vos données. Vous pouvez également retirer votre consentement à tout
          moment.
        </p>
        <p>
          Pour exercer ces droits, écrivez-nous à{' '}
          <a href={`mailto:${LEGAL.email}`} className="underline">{LEGAL.email}</a>. Vous
          pouvez aussi introduire une réclamation auprès de la CNIL (
          <a href="https://www.cnil.fr" target="_blank" rel="noreferrer" className="underline">cnil.fr</a>).
        </p>
      </LegalSection>

      <LegalSection titre="8. Cookies">
        <p>
          Le site utilise uniquement des cookies strictement nécessaires à son fonctionnement
          (panier, session, authentification). Ils ne nécessitent pas de consentement. Aucun
          cookie publicitaire ou de mesure d'audience n'est déposé sans votre accord.
        </p>
      </LegalSection>

      <LegalSection titre="9. Sécurité">
        <p>
          Nous mettons en œuvre des mesures techniques et organisationnelles adaptées pour
          protéger vos données contre tout accès non autorisé, altération ou perte.
        </p>
      </LegalSection>
    </LegalLayout>
  );
}

export default ConfidentialitePage;