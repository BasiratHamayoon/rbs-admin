'use client';
import clsx from 'clsx';

export default function Input({ label, error, className, ...props }) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-slate-700 mb-1.5">
          {label}
        </label>
      )}
      <input
        className={clsx(
          'w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white',
          'focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all',
          'placeholder:text-slate-400 text-slate-800',
          error && 'border-red-400 focus:ring-red-100',
          className
        )}
        {...props}
      />
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
}

export function Textarea({ label, error, className, ...props }) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-slate-700 mb-1.5">
          {label}
        </label>
      )}
      <textarea
        className={clsx(
          'w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white',
          'focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all',
          'placeholder:text-slate-400 text-slate-800 min-h-[100px] resize-y',
          error && 'border-red-400',
          className
        )}
        {...props}
      />
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
}

export function Select({ label, error, children, className, ...props }) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-slate-700 mb-1.5">
          {label}
        </label>
      )}
      <select
        className={clsx(
          'w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white',
          'focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all',
          'text-slate-800',
          error && 'border-red-400',
          className
        )}
        {...props}
      >
        {children}
      </select>
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
}