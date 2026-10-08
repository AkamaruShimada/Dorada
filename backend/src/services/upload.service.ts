// backend/src/services/upload.service.ts

import cloudinary from '../config/cloudinary';

export function uploadImageBuffer(buffer: Buffer, dossier: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: dossier, // ex: "empanadas", "formules", "extras"
        transformation: [{ width: 800, height: 800, crop: 'limit' }], // optimisation auto
      },
      (error, result) => {
        if (error || !result) {
          return reject(error ?? new Error('Échec de l\'upload'));
        }
        resolve(result.secure_url);
      }
    );

    uploadStream.end(buffer);
  });
}

/**
 * Extrait le public_id Cloudinary depuis une URL secure_url complète.
 * Gère les sous-dossiers imbriqués et la présence/absence du segment de version.
 *
 * Exemple :
 * https://res.cloudinary.com/demo/image/upload/v1699999999/formules/menu-du-jour/abc123.jpg
 * -> formules/menu-du-jour/abc123
 */
export function extractPublicIdFromUrl(url: string): string | null {
  const match = url.match(/\/upload\/(?:v\d+\/)?(.+)\.[a-zA-Z0-9]+$/);
  return match ? match[1] : null;
}

export async function deleteImageByUrl(url: string): Promise<void> {
  const publicId = extractPublicIdFromUrl(url);

  if (!publicId) {
    console.warn(`Impossible d'extraire le public_id depuis l'URL : ${url}`);
    return; // on évite de planter toute la requête pour une image qu'on ne peut pas nettoyer
  }

  await cloudinary.uploader.destroy(publicId);
}