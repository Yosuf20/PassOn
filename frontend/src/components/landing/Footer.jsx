import { Leaf } from 'lucide-react';

export default function Footer({ onLogin }) {
  return <footer className="bg-[#fffdf8] px-5 py-10 sm:px-8"><div className="mx-auto flex max-w-6xl flex-col gap-6 border-t border-stone-200 pt-8 sm:flex-row sm:items-center sm:justify-between"><div><div className="flex items-center gap-2 font-extrabold text-stone-900"><Leaf className="h-4 w-4 text-emerald-600" />PassOn</div><p className="mt-2 text-sm text-stone-500">Make passing things on easier than throwing them away.</p></div><nav className="flex flex-wrap gap-5 text-sm font-bold text-stone-600"><a href="#how-it-works" className="hover:text-emerald-700">How it works</a><a href="#communities" className="hover:text-emerald-700">Communities</a><button onClick={onLogin} className="hover:text-emerald-700">Log in</button></nav></div></footer>;
}
