import { MapPin, Users } from 'lucide-react';

const routeClasses = { Reuse: 'bg-emerald-100 text-emerald-700', Scrap: 'bg-amber-100 text-amber-700', 'E-Waste': 'bg-violet-100 text-violet-700' };

export function RouteBadge({ route }) {
  return <span className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${routeClasses[route]}`}>{route}</span>;
}

export default function CommunityCard({ community, onOpen, onClaim }) {
  return <article className="landing-card group overflow-hidden rounded-3xl border border-stone-200 bg-[#fffdf8] transition duration-300 hover:-translate-y-1">
    <button onClick={() => onOpen(community)} className="block w-full text-left focus:outline-none focus:ring-2 focus:ring-inset focus:ring-emerald-500">
      <div className={`h-28 bg-gradient-to-br ${community.gradient} p-5`}><span className="rounded-full bg-white/75 px-3 py-1 text-xs font-bold text-stone-700">{community.type}</span></div>
      <div className="p-5 pb-3"><h3 className="text-lg font-extrabold text-stone-900">{community.name}</h3><div className="mt-2 flex flex-wrap gap-3 text-xs font-semibold text-stone-500"><span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />{community.city}</span><span className="flex items-center gap-1"><Users className="h-3.5 w-3.5" />{community.members} members</span></div></div>
    </button>
    <div className="flex items-center justify-between border-t border-stone-100 px-5 py-3"><span className="text-xs font-bold text-stone-500">{community.items.length} items to explore</span><button onClick={() => onOpen(community)} className="text-sm font-bold text-emerald-700 hover:text-emerald-900 focus:outline-none focus:underline">View items</button></div>
  </article>;
}
