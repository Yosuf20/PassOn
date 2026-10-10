import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';
import { useApp } from '../context/AppContext';

const icons = {
  success: CheckCircle,
  error: AlertCircle,
  info: Info,
};

const styles = {
  success: 'bg-green-600 text-white',
  error: 'bg-rose-600 text-white',
  info: 'bg-sky-600 text-white',
};

export default function Toast() {
  const { toast, showToast } = useApp();
  if (!toast) return null;

  const Icon = icons[toast.type] || Info;

  return (
    <div className="fixed top-4 left-4 right-4 z-[100] flex justify-center animate-slide-up">
      <div className={`flex items-center gap-2.5 px-4 py-3 rounded-2xl shadow-xl max-w-sm w-full ${styles[toast.type]}`}>
        <Icon className="w-5 h-5 shrink-0" />
        <span className="text-sm font-medium flex-1">{toast.message}</span>
        <button onClick={() => showToast(null)} className="p-0.5 hover:opacity-80">
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
