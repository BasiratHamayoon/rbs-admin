'use client';
import clsx from 'clsx';
import { Loader2 } from 'lucide-react';

export default function Button({
  children, variant = 'primary', size = 'md', loading, disabled,
  className, type = 'button', ...props
}) {
  const variants = {
    primary: 'bg-gradient-to-r from-blue-700 to-blue-500 text-white hover:shadow-lg hover:shadow-blue-500/40',
    secondary: 'bg-white text-slate-800 border border-slate-200 hover:bg-slate-50',
    danger: 'bg-gradient-to-r from-red-600 to-red-500 text-white hover:shadow-lg hover:shadow-red-500/40',
    ghost: 'bg-transparent text-slate-700 hover:bg-slate-100',
    success: 'bg-gradient-to-r from-emerald-600 to-emerald-500 text-white hover:shadow-lg hover:shadow-emerald-500/40'
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-5 py-2.5 text-sm',
    lg: 'px-6 py-3 text-base'
  };

  return (
    <button
      type={type}
      disabled={disabled || loading}
      className={clsx(
        'inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-all duration-200',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        variants[variant], sizes[size], className
      )}
      {...props}
    >
      {loading && <Loader2 className="w-4 h-4 animate-spin" />}
      {children}
    </button>
  );
}