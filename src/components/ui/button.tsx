import Link from 'next/link';
import { cn } from '@/lib/utils/cn';

type ButtonProps = {
  href?: string;
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost';
  className?: string;
};

export function Button({ href, children, variant = 'primary', className }: ButtonProps) {
  const classes = cn(
    'inline-flex min-h-11 items-center justify-center rounded px-5 text-sm font-semibold transition focus-ring',
    variant === 'primary' && 'bg-oud text-white hover:bg-bark',
    variant === 'secondary' && 'border border-ink/15 bg-cream text-ink hover:bg-mist',
    variant === 'ghost' && 'text-ink hover:bg-mist',
    className
  );
  if (href) return <Link className={classes} href={href}>{children}</Link>;
  return <button className={classes}>{children}</button>;
}
