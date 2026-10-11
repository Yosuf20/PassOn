import { Info } from 'lucide-react';

export default function HonestStrip() {
  return <section className="bg-stone-900 px-5 py-12 text-stone-200 sm:px-8"><div className="mx-auto flex max-w-4xl flex-col gap-4 sm:flex-row sm:items-start"><Info className="h-5 w-5 shrink-0 text-emerald-300" /><div><h2 className="font-extrabold text-white">Honest by design.</h2><p className="mt-2 text-sm leading-6 text-stone-300">Any impact figures you see are illustrative estimates, not measured outcomes. PassOn is a workflow demo to be tested with real residents, in real communities.</p></div></div></section>;
}
