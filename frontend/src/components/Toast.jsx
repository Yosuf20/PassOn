import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';
import { useApp } from '../context/AppContext';

const icons = {
  success: CheckCircle,
  error: AlertCircle,
  info: Info,
};

const badgeStyles = {
  success: 'bg-emerald-500 text-white',
  error: 'bg-rose-500 text-white',
  info: 'bg-blue-500 text-white',
};

export default function Toast() {
  const { toast, showToast } = useApp();
  if (!toast) return null;

  const Icon = icons[toast.type] || Info;

  return (
    <div className="fixed top-4 left-4 right-4 z-[100] flex justify-center animate-slide-up pointer-events-none">
      <div className={`pointer-events-auto text-white rounded-xl max-w-md w-full p-4 flex items-center gap-3 ${badgeStyles[toast.type] || 'bg-blue-500 text-white'}`}>
        <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center shrink-0">
          <Icon className="w-5 h-5 text-white" strokeWidth={2.5} />
        </div>
        <div className="flex-1 text-sm font-semibold leading-snug">
          {toast.message}
        </div>
        <button
          onClick={() => showToast(null)}
          className="p-1 rounded-md hover:bg-white/20 transition-colors"
          title="Dismiss"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
