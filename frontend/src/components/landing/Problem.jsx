const problems = [
  ['01', 'Usable things get binned', 'Move-out day and clear-outs turn perfectly useful things into last-minute waste.'],
  ['02', 'The right person is close', 'Someone nearby is usually looking for that exact item, but the two never connect.'],
  ['03', 'Listing feels like a chore', 'Posting items one by one is tedious, and scrap or e-waste routes are not always clear.'],
];

export default function Problem() {
  return <section className="bg-stone-100 px-5 py-20 sm:px-8"><div className="mx-auto max-w-6xl"><p className="text-sm font-bold uppercase tracking-[.18em] text-emerald-700">The everyday gap</p><h2 className="mt-3 max-w-2xl text-3xl font-black tracking-tight text-stone-950 sm:text-5xl">Good things shouldn&apos;t need perfect timing.</h2><div className="mt-10 grid gap-4 md:grid-cols-3">{problems.map(([number, title, text]) => <article key={number} className="landing-card rounded-3xl border border-stone-200 bg-[#fffdf8] p-6"><span className="text-sm font-black text-emerald-600">{number}</span><h3 className="mt-10 text-xl font-extrabold text-stone-900">{title}</h3><p className="mt-3 leading-7 text-stone-600">{text}</p></article>)}</div></div></section>;
}
