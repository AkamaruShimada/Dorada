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

export async function deleteImageByUrl(url: string): Promise<void> {
  // Extrait le public_id depuis l'URL Cloudinary pour pouvoir supprimer l'ancienne image
  const segments = url.split('/');
  const fileName = segments[segments.length - 1];
  const publicId = `${segments[segments.length - 2]}/${fileName.split('.')[0]}`;

  await cloudinary.uploader.destroy(publicId);
}