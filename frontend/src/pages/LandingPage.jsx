import { ArrowRight } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import Navbar from '../components/landing/Navbar';
import Hero from '../components/landing/Hero';
import Problem from '../components/landing/Problem';
import HowItWorks from '../components/landing/HowItWorks';
import Communities from '../components/landing/Communities';
import CommunityDrawer from '../components/landing/CommunityDrawer';
import HonestStrip from '../components/landing/HonestStrip';
import Footer from '../components/landing/Footer';
import LoginModal from '../components/landing/LoginModal';

export default function LandingPage() {
  const [selectedCommunity, setSelectedCommunity] = useState(null);
  const [claimItem, setClaimItem] = useState(null);
  const [loginOpen, setLoginOpen] = useState(false);
  const openLogin = useCallback((item = null) => { setSelectedCommunity(null); setClaimItem(item); setLoginOpen(true); }, []);
  const closeLogin = useCallback(() => { setClaimItem(null); setLoginOpen(false); }, []);

  useEffect(() => {
    const sections = document.querySelectorAll('.landing-page main > section');
    if (!('IntersectionObserver' in window)) {
      sections.forEach((section) => section.classList.add('landing-reveal'));
      return undefined;
    }
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('landing-reveal');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08 });
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  return <div className="landing-page min-h-dvh bg-[#fffdf8] text-stone-900">
    <Navbar onLogin={() => openLogin()} />
    <main>
      <Hero />
      <Problem />
      <HowItWorks />
      <Communities onOpen={setSelectedCommunity} onClaim={openLogin} />
      <HonestStrip />
      <section className="bg-emerald-700 px-5 py-16 text-white sm:px-8"><div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-7 sm:flex-row sm:items-center"><div><p className="text-sm font-bold uppercase tracking-[.18em] text-emerald-200">Ready when your community is</p><h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">Have a community invite code?</h2></div><button onClick={() => openLogin()} className="flex items-center gap-2 rounded-full bg-white px-6 py-3.5 font-bold text-emerald-800 transition hover:bg-emerald-50 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-emerald-700">Join now <ArrowRight className="h-4 w-4" /></button></div></section>
    </main>
    <Footer onLogin={() => openLogin()} />
    <CommunityDrawer community={selectedCommunity} onClose={() => setSelectedCommunity(null)} onClaim={openLogin} />
    {loginOpen && <LoginModal item={claimItem} onClose={closeLogin} />}
  </div>;
}
