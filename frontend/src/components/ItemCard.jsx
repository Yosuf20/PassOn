import { useState } from 'react';
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
  like_new: 'bg-emerald-100 text-emerald-800',
  good: 'bg-blue-100 text-blue-800',
  fair: 'bg-amber-100 text-amber-800',
  broken: 'bg-rose-100 text-rose-800',
  na: 'bg-gray-200 text-gray-700',
};

const routeBadge = {
  reuse: { label: 'Reuse', className: 'bg-emerald-500 text-white' },
  scrap: { label: 'Scrap', className: 'bg-amber-500 text-white' },
  ewaste: { label: 'E-Waste', className: 'bg-rose-500 text-white' },
};

export default function ItemCard({ item, compact = false }) {
  const navigate = useNavigate();
  const [imgError, setImgError] = useState(false);
  const icon = ITEM_ICONS[item.category] || ITEM_ICONS.default;
  const route = routeBadge[item.route] || routeBadge.reuse;
  const imageSrc = item.imageUrl || item.photo || item.image;

  return (
    <button
      onClick={() => navigate(`/item/${item.id}`)}
      className="w-full text-left bg-gray-100 rounded-xl overflow-hidden flat-card-interactive group flex flex-col cursor-pointer border-0"
    >
      {/* Visual / Image Area */}
      <div className="relative bg-gray-200/70 aspect-[4/3] w-full flex items-center justify-center overflow-hidden">
        {imageSrc && !imgError ? (
          <img
            src={imageSrc}
            alt={item.title}
            onError={() => setImgError(true)}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
          />
        ) : (
          <span className="text-5xl group-hover:scale-110 transition-transform duration-200">
            {icon}
          </span>
        )}

        {/* Route Badge */}
        <span className={`absolute top-2.5 left-2.5 text-[11px] font-bold px-2.5 py-0.5 rounded-md uppercase tracking-wider ${route.className}`}>
          {route.label}
        </span>

        {/* Status overlay */}
        {item.status === 'claimed' && (
          <div className="absolute inset-0 bg-gray-900/60 flex items-center justify-center">
            <span className="bg-white text-gray-900 font-extrabold text-xs uppercase px-3 py-1 rounded-md">
              Claimed
            </span>
          </div>
        )}
      </div>

      {/* Content Area */}
      <div className="p-4 flex flex-col flex-1 justify-between gap-3 bg-white">
        <div>
          <div className="flex items-center gap-1.5 mb-2">
            <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${conditionColors[item.condition] || conditionColors.na}`}>
              {conditionLabels[item.condition] || item.condition}
            </span>
            <span className="text-xs text-gray-500 font-medium capitalize">
              {item.category}
            </span>
          </div>

          <h3 className="font-bold text-sm text-gray-900 leading-snug line-clamp-2 group-hover:text-blue-600 transition-colors">
            {item.title}
          </h3>
        </div>

        {/* Price & Action Strip */}
        <div className="pt-2 border-t border-gray-100 flex items-center justify-between">
          {item.priceType === 'free' ? (
            <span className="font-extrabold text-base text-emerald-600">
              Free
            </span>
          ) : item.priceType === 'scrap' ? (
            <span className="font-bold text-xs text-amber-600 uppercase tracking-wide">
              Scrap Recycle
            </span>
          ) : (
            <span className="font-extrabold text-base text-gray-900">
              ₹{item.askingPrice}
            </span>
          )}

          <span className="text-xs font-bold text-blue-600 group-hover:translate-x-0.5 transition-transform">
            View &rarr;
          </span>
        </div>
      </div>
    </button>
  );
}
