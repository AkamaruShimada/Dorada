// backend/src/controllers/rapport.controller.ts

import type { Request, Response } from 'express';
import { genererRapport, type TypeRapport } from '../services/rapport.service';
import { genererExcelRapport } from '../services/rapport.excel';
import {
  periodeHebdomadaire,
  periodeMensuelle,
  periodePersonnalisee,
  type Periode,
} from '../utils/rapport.dates';

const DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;

function resoudrePeriode(req: Request): { type: TypeRapport; periode: Periode } {
  const type = req.params.type as TypeRapport;
  const { date, debut, fin } = req.query as Record<string, string | undefined>;

  if (type === 'personnalise') {
    if (!debut || !fin || !DATE_REGEX.test(debut) || !DATE_REGEX.test(fin)) {
      throw new Error('Paramètres debut et fin requis au format YYYY-MM-DD');
    }
    return { type, periode: periodePersonnalisee(debut, fin) };
  }

  const ref = date ? new Date(`${date}T12:00:00`) : new Date();
  if (isNaN(ref.getTime())) throw new Error('Date invalide');

  const periode = type === 'hebdomadaire'
    ? periodeHebdomadaire(ref)
    : periodeMensuelle(ref);

  return { type, periode };
}

export const getRapport = async (req: Request, res: Response) => {
  try {
    const { type, periode } = resoudrePeriode(req);
    const rapport = await genererRapport(periode, type);
    res.status(200).json(rapport);
  } catch (error) {
    const message = (error as Error).message;
    const estErreurClient = /invalide|requis|doit être/.test(message);
    console.error(error);
    res.status(estErreurClient ? 400 : 500).json({
      message: estErreurClient ? message : 'Erreur serveur',
    });
  }
};

export const exporterRapportExcel = async (req: Request, res: Response) => {
  try {
    const { type, periode } = resoudrePeriode(req);
    const rapport = await genererRapport(periode, type);
    const buffer = await genererExcelRapport(rapport);

    const nomFichier = `rapport-${type}-${periode.debut.toISOString().slice(0, 10)}.xlsx`;

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename="${nomFichier}"`);
    res.setHeader('Content-Length', buffer.length);
    res.status(200).send(buffer);
  } catch (error) {
    const message = (error as Error).message;
    const estErreurClient = /invalide|requis|doit être/.test(message);
    console.error(error);
    res.status(estErreurClient ? 400 : 500).json({
      message: estErreurClient ? message : 'Erreur serveur',
    });
  }
};