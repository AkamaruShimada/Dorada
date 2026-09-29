// src/services/empanadaService.ts

import { empanadas } from "../data/empanadas";
import type { Empanada } from "../types";

// Cette fonction fait semblant d'être asynchrone (comme un vrai appel API)
// pour que le composant qui l'utilise soit déjà écrit "à la bonne forme"
export async function getEmpanadas(): Promise<Empanada[]> {
  return empanadas;
}