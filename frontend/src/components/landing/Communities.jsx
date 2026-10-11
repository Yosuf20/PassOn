import { Search, SlidersHorizontal } from 'lucide-react';
import { useMemo, useState } from 'react';
import landingCommunities from '../../data/landingCommunities';
import CommunityCard from './CommunityCard';

const types = ['All', 'Hostel', 'PG', 'Campus', 'Flat-share', 'Society'];

export default function Communities({ onOpen, onClaim }) {
  const [type, setType] = useState('All');
  const [search, setSearch] = useState('');
  const communities = useMemo(() => landingCommunities.filter((community) => (type === 'All' || community.type === type) && community.name.toLowerCase().includes(search.toLowerCase())), [type, search]);
  return <section id="communities" className="bg-emerald-50/55 px-5 py-24 sm:px-8"><div className="mx-auto max-w-6xl"><div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end"><div><p className="text-sm font-bold uppercase tracking-[.18em] text-emerald-700">Start nearby</p><h2 className="mt-3 text-3xl font-black tracking-tight text-stone-950 sm:text-5xl">Explore communities</h2><p className="mt-4 max-w-xl text-stone-600">Browse a few sample circles and see what neighbours are passing on.</p></div><div className="relative w-full lg:max-w-xs"><Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" /><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search communities" aria-label="Search communities" className="w-full rounded-full border border-stone-200 bg-white py-3 pl-11 pr-4 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100" /></div></div><div className="mt-8 flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide" aria-label="Filter communities by type"><SlidersHorizontal className="mr-1 h-4 w-4 shrink-0 text-stone-500" />{types.map((item) => <button key={item} onClick={() => setType(item)} className={`shrink-0 rounded-full px-4 py-2 text-sm font-bold transition focus:outline-none focus:ring-2 focus:ring-emerald-500 ${type === item ? 'bg-stone-900 text-white' : 'bg-white text-stone-600 hover:bg-stone-100'}`}>{item}</button>)}</div><div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">{communities.map((community) => <CommunityCard key={community.id} community={community} onOpen={onOpen} onClaim={onClaim} />)}</div>{!communities.length && <p className="rounded-2xl bg-white p-10 text-center text-stone-600">No communities match that search yet.</p>}<p className="mt-8 text-center text-xs font-semibold text-stone-500">Sample communities shown for demo.</p></div></section>;
}
