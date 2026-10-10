import { useNavigate } from 'react-router-dom';
import { ITEM_ICONS } from '../services/api';

const conditionLabels = {
  like_new: 'Like New',
  good: 'Good',
  fair: 'Fair',
  broken: 'Broken',
  na: 'N/A',
};

const conditionColors = {
  like_new: 'bg-emerald-100 text-emerald-700',
  good: 'bg-green-100 text-green-700',
  fair: 'bg-amber-100 text-amber-700',
  broken: 'bg-rose-100 text-rose-600',
  na: 'bg-slate-100 text-slate-500',
};

const routeBadge = {
  reuse: { label: 'Reuse', className: 'bg-green-600 text-white' },
  scrap: { label: 'Scrap', className: 'bg-amber-500 text-white' },
  ewaste: { label: 'E-Waste', className: 'bg-rose-500 text-white' },
};

export default function ItemCard({ item, compact = false }) {
  const navigate = useNavigate();
  const icon = ITEM_ICONS[item.category] || ITEM_ICONS.default;
  const route = routeBadge[item.route] || routeBadge.reuse;

  return (
    <button
      onClick={() => navigate(`/item/${item.id}`)}
      className="w-full text-left bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md hover:border-slate-200 transition-all duration-200 overflow-hidden active:scale-[0.98] animate-fade-in"
    >
      {/* Photo / Icon Area */}
      <div className="relative bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center aspect-[4/3]">
        <span className="text-5xl">{icon}</span>

        {/* Route badge */}
        <span className={`absolute top-2.5 left-2.5 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${route.className}`}>
          {route.label}
        </span>

        {/* Status overlay */}
        {item.status === 'claimed' && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <span className="bg-white text-slate-800 font-bold text-sm px-4 py-1.5 rounded-full">Claimed</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-3.5">
        <h3 className="font-semibold text-sm text-slate-800 leading-snug line-clamp-2 mb-1.5">{item.title}</h3>

        <div className="flex items-center gap-2 mb-2">
          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${conditionColors[item.condition] || conditionColors.na}`}>
            {conditionLabels[item.condition] || item.condition}
          </span>
          <span className="text-[10px] text-slate-400 capitalize">{item.category}</span>
        </div>

        {/* Price */}
        <div className="flex items-center justify-between">
          {item.priceType === 'free' ? (
            <span className="text-green-600 font-bold text-base">Free</span>
          ) : item.priceType === 'scrap' ? (
            <span className="text-amber-600 font-semibold text-sm">Scrap / Recycle</span>
          ) : (
            <span className="text-slate-800 font-bold text-base">₹{item.askingPrice}</span>
          )}
        </div>
      </div>
    </button>
  );
}
