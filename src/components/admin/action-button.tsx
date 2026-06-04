'use client';

type ActionButtonProps = {
  label: string;
  icon: React.ReactNode;
  onClick?: () => void;
  tone?: 'neutral' | 'brand' | 'danger' | 'success';
  disabled?: boolean;
};

const tones = {
  neutral: 'border-ink/10 text-ink hover:bg-mist',
  brand: 'border-oud/20 text-oud hover:bg-oud/8',
  danger: 'border-oud/20 text-oud hover:bg-oud/8',
  success: 'border-sage/20 text-sage hover:bg-sage/10'
};

export function ActionButton({ label, icon, onClick, tone = 'neutral', disabled = false }: ActionButtonProps) {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className={`inline-flex min-h-10 items-center justify-center gap-2 rounded border bg-white px-3 text-xs font-semibold transition disabled:cursor-not-allowed disabled:opacity-55 ${tones[tone]}`}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}
