// backend/src/services/rapport.excel.ts

import ExcelJS from 'exceljs';
import type { RapportVentes, LigneRapport, TotauxRapport, LigneFormule } from './rapport.service';

const FORMAT_EUR = '#,##0.00 "€"';

function feuilleVentes(wb: ExcelJS.Workbook, nom: string, lignes: LigneRapport[], totaux: TotauxRapport) {
  const ws = wb.addWorksheet(nom);
  ws.columns = [
    { header: 'Date', key: 'date', width: 18 },
    { header: 'Réf. transaction', key: 'reference', width: 22 },
    { header: 'Moyen de paiement', key: 'moyenPaiement', width: 20 },
    { header: 'Produit', key: 'produit', width: 40 },
    { header: 'Quantité', key: 'quantite', width: 10 },
    { header: 'Prix avant réduction', key: 'avantReduction', width: 20 },
    { header: 'Réduction', key: 'reduction', width: 12 },
    { header: 'Prix TTC', key: 'totalTtc', width: 12 },
    { header: 'Prix HT', key: 'totalHt', width: 12 },
    { header: 'TVA', key: 'montantTva', width: 12 },
    { header: 'Taux TVA', key: 'tauxTva', width: 10 },
  ];

  for (const l of lignes) {
  const parent = ws.addRow({ ...l, tauxTva: l.tauxTva ? l.tauxTva / 100 : null  });

  const detail = (l as LigneFormule).detail ?? [];
  for (const d of detail) {
    const enfant = ws.addRow({
      produit: `   ↳ ${d.produit}`,
      quantite: d.quantite,
      totalHt: d.totalHt,
      tauxTva: d.tauxTva / 100,
      montantTva: d.montantTva,
      totalTtc: d.totalTtc,
    });
    enfant.font = { italic: true, size: 9, color: { argb: 'FF555555' } };
    }
  }

  ws.getRow(1).font = { bold: true };
  ws.addRow({ produit: 'TOTAL', quantite: totaux.quantite, totalTtc: totaux.totalTtc, totalHt: totaux.totalHt, montantTva: totaux.totalTva }).font = { bold: true };


  // Format monétaire
  ['avantReduction', 'reduction', 'totalTtc', 'totalHt', 'montantTva'].forEach((k) => {
    ws.getColumn(k).numFmt = '#,##0.00 €';
  });
  ws.getColumn('tauxTva').numFmt = '0.0%';
}

export async function genererExcelRapport(rapport: RapportVentes): Promise<Buffer> {
  const wb = new ExcelJS.Workbook();
  wb.creator = 'Dorada';
  wb.created = new Date();

  // Feuille récapitulatif
  const resume = wb.addWorksheet('Résumé');
  resume.columns = [
    { header: 'Indicateur', key: 'indicateur', width: 32 },
    { header: 'Valeur', key: 'valeur', width: 20 },
  ];
  resume.getRow(1).font = { bold: true };
  resume.addRows([
    { indicateur: 'Période', valeur: rapport.periode.label },
    { indicateur: 'Nombre de commandes', valeur: rapport.global.nombreCommandes },
    { indicateur: 'Commandes remboursées', valeur: rapport.global.nombreRemboursees },
    { indicateur: 'Quantité totale vendue', valeur: rapport.global.quantite },
    { indicateur: 'Total HT (€)', valeur: rapport.global.totalHt },
    { indicateur: 'TVA (€)', valeur: rapport.global.totalTva },
    { indicateur: 'Total TTC net (€)', valeur: rapport.global.totalTtc },
  ]);
  resume.getColumn('valeur').numFmt = FORMAT_EUR;

    feuilleVentes(wb, 'Ventes unitaires', rapport.unite.lignes, rapport.unite.totaux);
    feuilleVentes(wb, 'Formules', rapport.formules.lignes, rapport.formules.totaux);

  const arrayBuffer = await wb.xlsx.writeBuffer();
  return Buffer.from(arrayBuffer);
}