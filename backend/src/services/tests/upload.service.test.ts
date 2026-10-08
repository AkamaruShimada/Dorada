// backend/src/services/tests/upload.service.test.ts

import { describe, it, expect, vi, beforeEach } from 'vitest';

// Le chemin doit correspondre à CE QUE upload.service.ts importe, pas à l'emplacement du test
vi.mock('../../config/cloudinary', () => ({
  default: {
    uploader: {
      destroy: vi.fn(),
      upload_stream: vi.fn(),
    },
  },
}));

import { extractPublicIdFromUrl, deleteImageByUrl } from '../upload.service';
import cloudinary from '../../config/cloudinary';

describe('extractPublicIdFromUrl', () => {
  it('extrait le public_id avec un dossier simple et une version', () => {
    const url = 'https://res.cloudinary.com/demo/image/upload/v1699999999/empanadas/abc123.jpg';
    expect(extractPublicIdFromUrl(url)).toBe('empanadas/abc123');
  });

  it('extrait le public_id avec des sous-dossiers imbriqués', () => {
    const url = 'https://res.cloudinary.com/demo/image/upload/v1699999999/formules/menu-du-jour/abc123.jpg';
    expect(extractPublicIdFromUrl(url)).toBe('formules/menu-du-jour/abc123');
  });

  it('extrait le public_id sans segment de version', () => {
    const url = 'https://res.cloudinary.com/demo/image/upload/empanadas/abc123.jpg';
    expect(extractPublicIdFromUrl(url)).toBe('empanadas/abc123');
  });

  it('gère différentes extensions (png, webp)', () => {
    const url = 'https://res.cloudinary.com/demo/image/upload/v1699999999/empanadas/abc123.webp';
    expect(extractPublicIdFromUrl(url)).toBe('empanadas/abc123');
  });

  it('retourne null pour une URL invalide', () => {
    expect(extractPublicIdFromUrl('https://example.com/image.jpg')).toBeNull();
  });
});

describe('deleteImageByUrl', () => {
  // IMPORTANT : on reset le mock avant chaque test pour éviter qu'un test
  // ne "pollue" le compteur d'appels du suivant
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('appelle cloudinary.uploader.destroy avec le bon public_id', async () => {
    const url = 'https://res.cloudinary.com/demo/image/upload/v1699999999/empanadas/abc123.jpg';

    await deleteImageByUrl(url);

    expect(cloudinary.uploader.destroy).toHaveBeenCalledWith('empanadas/abc123');
    expect(cloudinary.uploader.destroy).toHaveBeenCalledTimes(1);
  });

  it('ne plante pas et n\'appelle pas destroy si l\'URL est invalide', async () => {
    const url = 'https://example.com/invalid.jpg';

    await expect(deleteImageByUrl(url)).resolves.not.toThrow();
    expect(cloudinary.uploader.destroy).not.toHaveBeenCalled();
  });
});