// frontend/src/services/codePromo.service

const API_URL = import.meta.env.VITE_API_URL;

export async function verifierCodePromo(
  code: string,
): Promise<{ code: string; pourcentage: number }> {
  const response = await fetch(`${API_URL}/codes-promo/verifier`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ code }),
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.message ?? 'Code promo invalide');
  return data;
}