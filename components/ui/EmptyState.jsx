import { PackageOpen } from 'lucide-react';

export default function EmptyState({ icon: Icon = PackageOpen, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center mb-4">
        <Icon className="w-10 h-10 text-blue-700" />
      </div>
      <h3 className="text-lg font-bold text-slate-800 mb-2">{title}</h3>
      {description && <p className="text-slate-500 text-sm mb-6 max-w-sm">{description}</p>}
      {action}
    </div>
  );
}