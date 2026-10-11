import { ArrowRight, Leaf } from 'lucide-react';

export default function Navbar({ onLogin }) {
  return (
    <header className="landing-nav sticky top-0 z-40 border-b border-stone-200/70 bg-[#fffdf8]/85">
      <div className="mx-auto flex h-18 max-w-6xl items-center justify-between px-5 sm:px-8">
        <a href="#top" className="flex items-center gap-2.5 text-stone-900" aria-label="PassOn home">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-600 text-white">
            <Leaf className="h-5 w-5" />
          </span>
          <span className="text-xl font-extrabold tracking-tight">PassOn</span>
        </a>
        <div className="flex items-center gap-2.5">
          <button onClick={onLogin} className="rounded-full px-4 py-2.5 text-sm font-bold text-stone-700 transition hover:bg-stone-100 focus:outline-none focus:ring-2 focus:ring-emerald-500">Log in</button>
          <a href="#communities" className="hidden items-center gap-1 rounded-full bg-stone-900 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 sm:flex">
            Join a community <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      </div>
    </header>
  );
}
