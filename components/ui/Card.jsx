import clsx from 'clsx';

export default function Card({ children, className, ...props }) {
  return (
    <div
      className={clsx(
        'bg-white rounded-2xl card-shadow border border-slate-100',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}