import React from 'react';
import { cn } from './cn';

/* ---------------------------------- Card --------------------------------- */

export function Card({
  className,
  padded = true,
  ...rest
}: React.HTMLAttributes<HTMLDivElement> & { padded?: boolean }) {
  return (
    <div
      className={cn('bg-surface border border-line rounded-card', padded && 'p-4 sm:p-5', className)}
      {...rest}
    />
  );
}

/* --------------------------------- Inputs -------------------------------- */

const field =
  'w-full bg-surface text-fg border border-line-strong rounded-ctl px-3 text-sm ' +
  'placeholder:text-muted transition-colors hover:border-muted ' +
  'focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/25 ' +
  'disabled:opacity-50 disabled:cursor-not-allowed';

export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  function Input({ className, ...rest }, ref) {
    return <input ref={ref} className={cn(field, 'h-10', className)} {...rest} />;
  }
);

export const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(function Textarea({ className, ...rest }, ref) {
  return <textarea ref={ref} className={cn(field, 'py-2.5 leading-relaxed resize-none', className)} {...rest} />;
});

/* --------------------------------- Badge --------------------------------- */

type Tone = 'neutral' | 'accent' | 'success' | 'warning' | 'danger' | 'info';

const tones: Record<Tone, string> = {
  neutral: 'bg-sunken text-muted',
  accent: 'bg-accent-soft text-accent',
  success: 'bg-success-soft text-success',
  warning: 'bg-warning-soft text-warning',
  danger: 'bg-danger-soft text-danger',
  info: 'bg-info-soft text-info',
};

export function Badge({
  tone = 'neutral',
  className,
  ...rest
}: React.HTMLAttributes<HTMLSpanElement> & { tone?: Tone }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium whitespace-nowrap',
        tones[tone],
        className
      )}
      {...rest}
    />
  );
}

/* ---------------------------------- Tabs --------------------------------- */

export interface TabItem<T extends string> {
  id: T;
  label: string;
  icon?: React.ReactNode;
}

/** Horizontally scrollable segmented tabs. */
export function Tabs<T extends string>({
  items,
  value,
  onChange,
  label,
  className,
}: {
  items: TabItem<T>[];
  value: T;
  onChange: (id: T) => void;
  label: string;
  className?: string;
}) {
  return (
    <div
      role="tablist"
      aria-label={label}
      className={cn('flex items-center gap-1 overflow-x-auto no-scrollbar', className)}
    >
      {items.map((item) => {
        const selected = item.id === value;
        return (
          <button
            key={item.id}
            type="button"
            role="tab"
            aria-selected={selected}
            onClick={() => onChange(item.id)}
            className={cn(
              'inline-flex items-center gap-2 h-9 px-3 rounded-ctl text-sm font-medium whitespace-nowrap transition-colors shrink-0',
              selected ? 'bg-accent-soft text-accent' : 'text-muted hover:text-fg hover:bg-sunken'
            )}
          >
            {item.icon}
            {item.label}
          </button>
        );
      })}
    </div>
  );
}

/* ------------------------------- PageHeader ------------------------------ */

export function PageHeader({
  title,
  description,
  eyebrow,
  actions,
  className,
}: {
  title: React.ReactNode;
  description?: React.ReactNode;
  eyebrow?: React.ReactNode;
  actions?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn('flex flex-wrap items-end justify-between gap-4', className)}>
      <div className="min-w-0 max-w-2xl">
        {eyebrow && <p className="eyebrow mb-2">{eyebrow}</p>}
        <h1 className="font-serif text-3xl font-medium text-fg">{title}</h1>
        {description && <p className="mt-2 text-base text-muted">{description}</p>}
      </div>
      {actions && <div className="flex items-center gap-2 shrink-0">{actions}</div>}
    </div>
  );
}

/* ------------------------------- EmptyState ------------------------------ */

export function EmptyState({
  icon,
  title,
  description,
  action,
  className,
}: {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn('flex flex-col items-center justify-center text-center px-6 py-12', className)}>
      {icon && <div className="mb-3 text-muted">{icon}</div>}
      <p className="text-base font-medium text-fg">{title}</p>
      {description && <p className="mt-1 text-sm text-muted max-w-sm">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
