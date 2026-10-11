import { X, MapPin, Users } from 'lucide-react';
import { RouteBadge } from './CommunityCard';

export default function CommunityDrawer({ community, onClose, onClaim }) {
  if (!community) return null;
  return <div className="fixed inset-0 z-50 flex items-end justify-center bg-stone-950/35 sm:items-center" role="presentation" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
    <aside role="dialog" aria-modal="true" aria-labelledby="community-drawer-title" className="landing-card max-h-[88vh] w-full overflow-y-auto rounded-t-3xl bg-[#fffdf8] p-6 sm:max-w-lg sm:rounded-3xl">
      <div className="flex items-start justify-between"><div><div className={`mb-4 h-2 w-14 rounded-full bg-gradient-to-r ${community.gradient}`} /><h2 id="community-drawer-title" className="text-2xl font-black text-stone-950">{community.name}</h2><p className="mt-2 flex gap-3 text-sm font-semibold text-stone-500"><span><MapPin className="mr-1 inline h-4 w-4" />{community.city}</span><span><Users className="mr-1 inline h-4 w-4" />{community.members} members</span></p></div><button onClick={onClose} aria-label="Close community details" className="rounded-full p-2 text-stone-500 hover:bg-stone-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"><X className="h-5 w-5" /></button></div>
      <div className="mt-7 space-y-3">{community.items.map((item) => <div key={item.title} className="flex items-center gap-3 rounded-2xl border border-stone-200 bg-white p-3"><span className="flex h-12 w-12 items-center justify-center rounded-xl bg-stone-100 text-2xl">{item.emoji}</span><div className="min-w-0 flex-1"><h3 className="truncate font-bold text-stone-900">{item.title}</h3><p className="mt-1 text-xs font-semibold text-stone-500">{item.condition} <span className="mx-1">·</span> <RouteBadge route={item.route} /></p></div><button onClick={() => onClaim(item)} className="rounded-full bg-emerald-600 px-3 py-2 text-xs font-bold text-white hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500">Claim</button></div>)}</div>
    </aside>
  </div>;
}
