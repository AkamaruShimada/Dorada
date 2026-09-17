// frontend/src/services/api.ts

const API_URL = import.meta.env.VITE_API_URL;

// Type générique pour la réponse de /api/health
// On le définit ici en attendant d'avoir un dossier de types partagés plus complet
interface HealthResponse {
  status: string;
  message: string;
}

export async function checkHealth(): Promise<HealthResponse> {
  const response = await fetch(`${API_URL}/api/health`);

  if (!response.ok) {
    throw new Error('Le serveur backend ne répond pas correctement');
  }

  return response.json();
}