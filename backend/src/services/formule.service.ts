// backend/src/services/formule.service.ts

import prisma from '../prisma/client';
import { CreateFormuleInput, UpdateFormuleInput } from "../schemas/formule.schema";


export const getAllFormules = async () => {
    return prisma.formule.findMany({
        orderBy: { id: "asc" },
    });
}

export const getFormuleById = async (id: number) => {
    return prisma.formule.findUnique({ where: { id } });
}

export const createFormule = async (data: CreateFormuleInput) => {
    return prisma.formule.create({ data });
}

export const updateFormule = async (id: number, data: UpdateFormuleInput) => {
    return prisma.formule.update({ where: { id }, data });
}

export const deleteFormule = async (id: number) => {
    return prisma.formule.update({
        where: { id },
        data: { actif: false }
    });
}