// backend/src/middlewares/upload.middleware.ts

import multer from 'multer';

// On garde le fichier en mémoire (buffer), pas sur le disque du serveur
// car on le transfère directement à Cloudinary
const storage = multer.memoryStorage();

const fileFilter = (
  req: Express.Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  const typesAutorises = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];

  if (typesAutorises.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Format de fichier non supporté. Utilisez JPEG, JPG, PNG ou WebP.'));
  }
};

export const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 Mo max
});