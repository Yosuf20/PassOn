import { Camera, Check, Sparkles, Users } from 'lucide-react';

const steps = [
  [Camera, 'Snap a photo', 'Start with what you have.'],
  [Sparkles, 'AI drafts the listing', 'Name, details and a first pass.'],
  [Check, 'Review & choose a route', 'Reuse, Scrap or E-Waste.'],
  [Users, 'Neighbours claim it', 'A useful handoff, close to home.'],
];

export default function HowItWorks() {
  return <section id="how-it-works" className="bg-[#fffdf8] px-5 py-20 sm:px-8"><div className="mx-auto max-w-6xl"><div className="max-w-2xl"><p className="text-sm font-bold uppercase tracking-[.18em] text-emerald-700">How we solve it</p><h2 className="mt-3 text-3xl font-black tracking-tight text-stone-950 sm:text-5xl">Less listing. More passing on.</h2></div><div className="mt-12 grid gap-8 md:grid-cols-4">{steps.map(([Icon, title, text], index) => <div key={title} className="relative"><div className="flex items-center gap-4"><div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700"><Icon className="h-6 w-6" /></div><span className="text-sm font-black text-stone-300">0{index + 1}</span></div><h3 className="mt-5 font-extrabold text-stone-900">{title}</h3><p className="mt-2 text-sm leading-6 text-stone-600">{text}</p>{index < 3 && <div className="absolute left-14 top-7 hidden h-px w-[calc(100%-1.5rem)] bg-emerald-200 md:block" />}</div>)}</div><p className="mt-10 text-center text-sm font-bold text-emerald-700">AI reduces the work. You stay in control.</p></div></section>;
}
