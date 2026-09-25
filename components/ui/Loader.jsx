import { Loader2 } from 'lucide-react';

export default function Loader({ size = 'md' }) {
  const sizes = { sm: 'w-4 h-4', md: 'w-8 h-8', lg: 'w-12 h-12' };
  return (
    <div className="flex items-center justify-center py-8">
      <Loader2 className={`${sizes[size]} animate-spin text-blue-600`} />
    </div>
  );
}