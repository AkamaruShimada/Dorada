import Header from "./components/layout/header"
import Hero from "./components/sections/hero"
import MenuEmpanadas from "./components/sections/MenuEmpanada"

import { useEffect, useState } from 'react';
import { checkHealth } from './services/api';


function App() {

    // On type explicitement ici : soit le message reçu du backend, soit null au départ
  const [statutBackend, setStatutBackend] = useState<string | null>(null);

  useEffect(() => {
    checkHealth()
      .then((data) => setStatutBackend(data.message))
      .catch((error) => setStatutBackend(`Erreur : ${error.message}`));
  }, []);

  return (

    <>
     <Header/>
     <Hero/>
     <MenuEmpanadas/>

         <div>
      {/* Bloc de test temporaire, à retirer une fois la connexion validée */}
      <p>Statut backend : {statutBackend ?? 'chargement...'}</p>

      {/* votre contenu existant en dessous */}
    </div>

    </>
  )
}

export default App
