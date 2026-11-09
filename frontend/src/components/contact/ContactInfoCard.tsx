// frontend/src/components/contact/ContactInfoCard.tsx

import type { ReactNode } from 'react';

interface ContactInfoCardProps {
  icone: ReactNode;
  titre: string;
  children: ReactNode;
}

function ContactInfoCard({ icone, titre, children }: ContactInfoCardProps) {
  return (
    <div className="flex items-start gap-4 rounded-2xl border border-primary/10 bg-surface p-5 shadow-sm">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
        {icone}
      </div>
      <div className="space-y-1">
        <h3 className="font-semibold">{titre}</h3>
        <div className="text-sm opacity-80 text-secondary">{children}</div>
      </div>
    </div>
  );
}

export default ContactInfoCard;