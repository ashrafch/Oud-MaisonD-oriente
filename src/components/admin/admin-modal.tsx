'use client';

import { X } from 'lucide-react';

type AdminModalProps = {
  title: string;
  description?: string;
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  size?: 'md' | 'lg' | 'xl';
};

const sizes = {
  md: 'max-w-xl',
  lg: 'max-w-3xl',
  xl: 'max-w-5xl'
};

export function AdminModal({ title, description, isOpen, onClose, children, size = 'lg' }: AdminModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-ink/45 p-4">
      <section role="dialog" aria-modal="true" aria-label={title} className={`max-h-[92svh] w-full overflow-hidden rounded border border-ink/10 bg-cream shadow-soft ${sizes[size]}`}>
        <div className="flex items-start justify-between gap-4 border-b border-ink/10 bg-white p-5">
          <div>
            <h2 className="font-serif text-3xl">{title}</h2>
            {description ? <p className="mt-2 text-sm leading-6 text-ink/60">{description}</p> : null}
          </div>
          <button type="button" aria-label="Chiudi modale" className="rounded p-2 text-ink/65 transition hover:bg-mist hover:text-ink" onClick={onClose}>
            <X size={20} />
          </button>
        </div>
        <div className="max-h-[calc(92svh-104px)] overflow-y-auto p-5">
          {children}
        </div>
      </section>
    </div>
  );
}
