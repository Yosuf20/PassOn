import { Loader2 } from 'lucide-react';

export default function LoadingSpinner({ message = 'Loading...' }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-3 animate-fade-in">
      <Loader2 className="w-8 h-8 text-green-600 animate-spin" />
      <p className="text-sm text-slate-500 font-medium">{message}</p>
    </div>
  );
}
