// frontend/src/components/contact/HoraireTable.tsx

const HORAIRES = [
  { jour: 'Lundi', heures: 'Fermé' },
  { jour: 'Mardi', heures: '10h - 14h30' },
  { jour: 'Mercredi', heures: '10h - 14h30' },
  { jour: 'Jeudi', heures: '10h - 14h30' },
  { jour: 'Vendredi', heures: '10h - 14h30' },
  { jour: 'Samedi', heures: 'Fermé' },
  { jour: 'Dimanche', heures: 'Fermé' },
];

function HoraireTable() {
  return (
    <table className="w-full text-sm">
      <tbody>
        {HORAIRES.map((h) => (
          <tr key={h.jour} className="border-b border-primary/10 last:border-0">
            <td className="py-2 font-medium">{h.jour}</td>
            <td className="py-2 text-right opacity-80">{h.heures}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default HoraireTable;