// frontend/src/pages/HomePage.tsx

import Header from "../components/layout/Header"
import Footer from "../components/layout/Footer"
import Hero from "../components/sections/Hero"
import HistoireSection from "../components/sections/HistoireSection"
import SliderEmpanada from "../components/sections/SliderEmpanada"

function HomePage() {

    return (
        <>
        
        <Header/>
        <Hero
        surtitre="De l'Argentine à La Farlède"
        titre="Les Farcis"
        sousTitre="Empanadas artisanales"
        badges={['Généreuses', 'Dorées', 'Faites maison']}
        description="Des empanadas inspirées de l'Argentine, préparées chaque jour avec passion à La Farlède."
        imageUrl="https://res.cloudinary.com/b9qac4kt/image/upload/v1794149844/Home_Presentation.png"
        imageAlt="Empanadas dorées garnies de viande"
        ctaPrincipal={{ label: 'Commander', href: '/menu' }}
        ctaSecondaire={{ label: 'Découvrir', href: '#histoire' }}
      />

      <HistoireSection
        id="histoire"
        imageUrl="https://res.cloudinary.com/b9qac4kt/image/upload/v1794153803/History_Section.png"
        imageAlt="Maxime préparant des empanadas"
        titre={["De l'Argentine", 'à La Farlède']}
        paragraphes={[
          "Je m'appelle Maxime. Après avoir passé deux ans de ma vie en Argentine, c'est là-bas que j'ai découvert l'art de cuisiner des empanadas.",
          "De retour en France, j'ai eu envie de partager cette passion avec les habitants de La Farlède et des environs.",
          'Toutes nos empanadas sont faites maison chaque jour, avec des ingrédients sélectionnés avec soin et des recettes authentiques.',
        ]}
        signature="Maxime"
      />
        <SliderEmpanada/>
        <Footer/>
        </>
    )
}

export default HomePage
