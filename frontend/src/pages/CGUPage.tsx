// frontend/src/pages/CGUPage.tsx

import LegalLayout, { LegalSection } from '../components/legal/LegalLayout';
import { LEGAL } from '../constants/legal';

function CGUPage() {
  return (
    <LegalLayout titre="Conditions générales d'utilisation" dateMiseAJour={LEGAL.dateMiseAJour}>
      <LegalSection titre="1. Objet">
        <p>
          Les présentes conditions régissent l'accès et l'utilisation du site {LEGAL.nomSite},
          édité par {LEGAL.nomEntreprise}. L'accès au site implique leur acceptation pleine et
          entière.
        </p>
      </LegalSection>

      <LegalSection titre="2. Accès au site">
        <p>
          Le site est accessible gratuitement à tout utilisateur disposant d'un accès à
          Internet. L'éditeur peut suspendre ou modifier tout ou partie du site, notamment pour
          maintenance, sans préavis ni indemnisation.
        </p>
      </LegalSection>

      <LegalSection titre="3. Compte utilisateur">
        <p>
          Certaines fonctionnalités (commande, suivi, espace administrateur) nécessitent un
          compte. L'utilisateur s'engage à fournir des informations exactes et à préserver la
          confidentialité de ses identifiants. Toute activité réalisée depuis un compte est
          réputée effectuée par son titulaire.
        </p>
      </LegalSection>

      <LegalSection titre="4. Commandes">
        <p>
          Les commandes passées sur le site sont soumises aux{' '}
          <a href="/cgv" className="underline">conditions générales de vente</a>. Les prix
          sont affichés en euros, TVA comprise.
        </p>
      </LegalSection>

      <LegalSection titre="5. Comportements interdits">
        <p>L'utilisateur s'engage à ne pas :</p>
        <ul className="list-disc space-y-1 pl-6">
          <li>perturber le fonctionnement du site ;</li>
          <li>tenter d'accéder à des zones réservées sans autorisation ;</li>
          <li>diffuser de contenus illicites ou portant atteinte aux droits de tiers ;</li>
          <li>utiliser le site à des fins frauduleuses.</li>
        </ul>
      </LegalSection>

      <LegalSection titre="6. Responsabilité">
        <p>
          L'éditeur met en œuvre les moyens raisonnables pour assurer l'exactitude des
          informations publiées, sans garantie d'exhaustivité. Il ne saurait être tenu
          responsable des dommages liés à l'utilisation du site, à une indisponibilité
          technique ou à la présence de virus.
        </p>
      </LegalSection>

      <LegalSection titre="7. Propriété intellectuelle">
        <p>
          Les éléments du site sont protégés par le droit de la propriété intellectuelle. Toute
          reproduction sans autorisation écrite préalable est interdite.
        </p>
      </LegalSection>

      <LegalSection titre="8. Données personnelles">
        <p>
          Le traitement des données est décrit dans notre{' '}
          <a href="/confidentialite" className="underline">politique de confidentialité</a>.
        </p>
      </LegalSection>

      <LegalSection titre="9. Modification des conditions">
        <p>
          L'éditeur peut modifier les présentes conditions à tout moment. Les modifications
          prennent effet dès leur publication sur le site.
        </p>
      </LegalSection>

      <LegalSection titre="10. Droit applicable">
        <p>
          Les présentes conditions sont soumises au droit français. À défaut de résolution
          amiable, compétence est attribuée aux tribunaux de {LEGAL.tribunal}, sous réserve
          des règles protectrices du consommateur.
        </p>
      </LegalSection>
    </LegalLayout>
  );
}

export default CGUPage;