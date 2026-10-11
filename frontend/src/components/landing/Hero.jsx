import { ArrowDown, ArrowRight, Leaf } from 'lucide-react';

export default function Hero() {
  return (
    <section id="top" className="overflow-hidden bg-[#fffdf8] px-5 pb-20 pt-16 sm:px-8 sm:pt-24">
      <div className="mx-auto grid max-w-6xl items-center gap-14 lg:grid-cols-[1.15fr_.85fr]">
        <div>
          <p className="mb-6 flex items-center gap-2 text-sm font-bold uppercase tracking-[.18em] text-emerald-700"><Leaf className="h-4 w-4" /> A simpler way to share locally</p>
          <h1 className="max-w-3xl text-5xl font-black leading-[.98] tracking-[-.05em] text-stone-950 sm:text-7xl">Don&apos;t bin it.<br /><span className="text-emerald-600">Pass it on.</span></h1>
          <p className="mt-7 max-w-xl text-lg leading-8 text-stone-600">Usable things get thrown away when people move out or declutter, because finding a neighbour who wants them takes effort. PassOn makes the handoff easier.</p>
          <div className="mt-9 flex flex-wrap gap-3">
            <a href="#communities" className="flex items-center gap-2 rounded-full bg-emerald-600 px-6 py-3.5 font-bold text-white transition hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2">Explore communities <ArrowRight className="h-4 w-4" /></a>
            <a href="#how-it-works" className="flex items-center gap-2 rounded-full border border-stone-300 bg-white px-6 py-3.5 font-bold text-stone-700 transition hover:border-emerald-500 hover:text-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500">How it works <ArrowDown className="h-4 w-4" /></a>
          </div>
        </div>
        <div className="relative mx-auto h-80 w-full max-w-md sm:h-96">
          <div className="absolute inset-8 rotate-3 rounded-[2.5rem] bg-emerald-100" />
          <div className="landing-card absolute inset-0 overflow-hidden rounded-[2.5rem] border border-stone-200 bg-white p-5">
            <div className="flex h-full flex-col justify-between rounded-[2rem] bg-gradient-to-br from-emerald-600 to-teal-800 p-7 text-white">
              <div className="flex items-center justify-between"><span className="rounded-full bg-white/15 px-3 py-1 text-xs font-bold">PASS IT ON</span><span className="text-3xl">🌿</span></div>
              <div><p className="text-sm text-emerald-100">A little less waste</p><p className="mt-2 text-3xl font-black">A little more<br />neighbourhood.</p></div>
              <div className="flex items-center justify-between border-t border-white/20 pt-4 text-sm"><span>Study table · Good</span><span>Reuse ↗</span></div>
            </div>
          </div>
          <div className="landing-card absolute -bottom-5 -left-5 rounded-2xl border border-stone-200 bg-white px-4 py-3"><span className="text-xl">🪴</span><span className="ml-2 text-sm font-bold text-stone-700">Claimed nearby</span></div>
        </div>
      </div>
    </section>
  );
}
