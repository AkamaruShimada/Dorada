// frontend/src/pages/MentionsLegalesPage.tsx

import LegalLayout, { LegalSection } from '../components/legal/LegalLayout';
import { LEGAL } from '../constants/legal';

function MentionsLegalesPage() {
  return (
    <LegalLayout titre="Mentions légales" dateMiseAJour={LEGAL.dateMiseAJour}>
      <LegalSection titre="1. Éditeur du site">
        <p>Le site {LEGAL.nomSite} est édité par :</p>
        <ul className="list-disc space-y-1 pl-6">
          <li>Nom / raison sociale : {LEGAL.nomEntreprise}</li>
          <li>Statut : {LEGAL.statutJuridique}</li>
          <li>SIRET : {LEGAL.siret}</li>
          <li>Adresse : {LEGAL.adresse}</li>
          <li>Téléphone : <a href={`tel:${LEGAL.telephone.replace(/\s/g, '')}`} className="underline">{LEGAL.telephone}</a></li>
          <li>Email : <a href={`mailto:${LEGAL.email}`} className="underline">{LEGAL.email}</a></li>
        </ul>
        <p>Directeur de la publication : {LEGAL.directeurPublication}</p>
      </LegalSection>

      <LegalSection titre="2. Hébergement">
        <p>
          Le site est hébergé par {LEGAL.hebergeur.nom}, {LEGAL.hebergeur.adresse}.
        </p>
      </LegalSection>

      <LegalSection titre="3. Propriété intellectuelle">
        <p>
          L'ensemble des contenus du site (textes, photographies, logo, charte graphique,
          recettes) est protégé par le droit de la propriété intellectuelle. Toute
          reproduction, même partielle, sans autorisation écrite préalable est interdite.
        </p>
      </LegalSection>

      <LegalSection titre="4. Responsabilité">
        <p>
          L'éditeur s'efforce d'assurer l'exactitude des informations diffusées sur le site
          mais ne peut garantir leur exhaustivité. Il ne saurait être tenu responsable des
          dommages résultant d'une indisponibilité du site ou de l'utilisation des
          informations qui y figurent.
        </p>
      </LegalSection>

      <LegalSection titre="5. Liens externes">
        <p>
          Le site peut contenir des liens vers des sites tiers. L'éditeur n'exerce aucun
          contrôle sur ces sites et décline toute responsabilité quant à leur contenu.
        </p>
      </LegalSection>

      <LegalSection titre="6. Données personnelles">
        <p>
          Le traitement des données personnelles est détaillé dans notre{' '}
          <a href="/confidentialite" className="underline">politique de confidentialité</a>.
        </p>
      </LegalSection>

      <LegalSection titre="7. Droit applicable">
        <p>
          Les présentes mentions sont soumises au droit français. En cas de litige, compétence
          est attribuée aux tribunaux de {LEGAL.tribunal}.
        </p>
      </LegalSection>
    </LegalLayout>
  );
}

export default MentionsLegalesPage;