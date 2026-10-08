// backend/src/services/test/empanada.service.test.ts

import { describe, it, expect, vi, beforeEach } from 'vitest';

// On mocke le client Prisma complet avant d'importer le service qui s'en sert
vi.mock('../../prisma/client', () => ({
  default: {
    empanada: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
    },
  },
}));

import prisma from '../../prisma/client';
import {
  getAllEmpanadas,
  getEmpanadaById,
  createEmpanada,
  updateEmpanada,
  deleteEmpanada,
} from '../empanada.service';

describe('empanada.service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getAllEmpanadas', () => {
    it('ne récupère que les empanadas actives par défaut', async () => {
      const fakeData = [{ id: 1, nom: 'Boeuf', actif: true }];
      (prisma.empanada.findMany as any).mockResolvedValue(fakeData);

      const result = await getAllEmpanadas();

      expect(prisma.empanada.findMany).toHaveBeenCalledWith({
        where: { actif: true },
        orderBy: { nom: 'asc' },
      });
      expect(result).toEqual(fakeData);
    });

    it('récupère toutes les empanadas (actives + inactives) si includeInactive=true', async () => {
      (prisma.empanada.findMany as any).mockResolvedValue([]);

      await getAllEmpanadas(true);

      expect(prisma.empanada.findMany).toHaveBeenCalledWith({
        where: {},
        orderBy: { nom: 'asc' },
      });
    });
  });

  describe('getEmpanadaById', () => {
    it('retourne l\'empanada si elle existe', async () => {
      const fakeEmpanada = { id: 1, nom: 'Poulet', actif: true };
      (prisma.empanada.findUnique as any).mockResolvedValue(fakeEmpanada);

      const result = await getEmpanadaById(1);

      expect(prisma.empanada.findUnique).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(result).toEqual(fakeEmpanada);
    });

    it('retourne null si l\'empanada n\'existe pas', async () => {
      (prisma.empanada.findUnique as any).mockResolvedValue(null);

      const result = await getEmpanadaById(999);

      expect(result).toBeNull();
    });
  });

  describe('createEmpanada', () => {
    it('crée une empanada avec les données fournies', async () => {
      const inputData = { nom: 'Fromage', prix: 3.5, actif: true };
      const createdEmpanada = { id: 1, ...inputData };
      (prisma.empanada.create as any).mockResolvedValue(createdEmpanada);

      const result = await createEmpanada(inputData as any);

      expect(prisma.empanada.create).toHaveBeenCalledWith({ data: inputData });
      expect(result).toEqual(createdEmpanada);
    });
  });

  describe('updateEmpanada', () => {
    it('met à jour une empanada existante', async () => {
      const updateData = { nom: 'Fromage modifié' };
      const updatedEmpanada = { id: 1, nom: 'Fromage modifié', actif: true };
      (prisma.empanada.update as any).mockResolvedValue(updatedEmpanada);

      const result = await updateEmpanada(1, updateData);

      expect(prisma.empanada.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: updateData,
      });
      expect(result).toEqual(updatedEmpanada);
    });

    it('propage l\'erreur Prisma si l\'id n\'existe pas (P2025)', async () => {
      const prismaError = Object.assign(new Error('Record not found'), {
        code: 'P2025',
      });
      (prisma.empanada.update as any).mockRejectedValue(prismaError);

      await expect(updateEmpanada(999, { nom: 'Test' })).rejects.toMatchObject({
        code: 'P2025',
      });
    });
  });

  describe('deleteEmpanada', () => {
    it('désactive l\'empanada au lieu de la supprimer (soft delete)', async () => {
      const deactivated = { id: 1, nom: 'Boeuf', actif: false };
      (prisma.empanada.update as any).mockResolvedValue(deactivated);

      const result = await deleteEmpanada(1);

      expect(prisma.empanada.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: { actif: false },
      });
      expect(result.actif).toBe(false);
    });
  });
});