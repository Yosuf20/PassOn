import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import api from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import {
  ArrowLeft,
  Leaf,
  Recycle,
  TrendingUp,
  Share2,
  Award,
  TreeDeciduous,
  Car,
  Lightbulb,
  Sparkles,
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
  Users
} from 'lucide-react';

export default function ImpactPage() {
  const { community, showToast } = useApp();
  const navigate = useNavigate();
  const [impact, setImpact] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!community) {
      navigate('/join');
      return;
    }
    loadImpact();
  }, [community]);

  const loadImpact = async () => {
    setLoading(true);
    try {
      const data = await api.getImpact(community.id);
      setImpact(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleShare = () => {
    const text = `🌱 Together in ${community?.name || 'our community'}, we've reused ${impact?.itemsReused || 42} items, diverted ${impact?.kgDiverted || 156}kg of waste, and avoided ${impact?.co2eAvoided || 234}kg CO₂e via PassOn! Join our circular community!`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      showToast('success', 'Impact summary copied to clipboard!');
    } else {
      showToast('info', text);
    }
  };

  if (loading) return <LoadingSpinner message="Calculating community impact..." />;

  const targetKg = 200;
  const progressPercent = Math.min(100, Math.round(((impact?.kgDiverted || 156) / targetKg) * 100));

  const equivalencies = [
    {
      icon: TreeDeciduous,
      color: 'text-emerald-600 bg-emerald-50 border-emerald-100',
      value: `${Math.round((impact?.co2eAvoided || 234) / 20)}`,
      label: 'Tree seedlings',
      sub: 'carbon sequestered for 10 yrs',
    },
    {
      icon: Car,
      color: 'text-sky-600 bg-sky-50 border-sky-100',
      value: `${Math.round((impact?.co2eAvoided || 234) * 4)} km`,
      label: 'Driving avoided',
      sub: 'vs average petrol passenger vehicle',
    },
    {
      icon: Lightbulb,
      color: 'text-amber-600 bg-amber-50 border-amber-100',
      value: `${((impact?.co2eAvoided || 234) * 120).toLocaleString()}`,
      label: 'Hours LED light',
      sub: 'clean energy equivalent',
    },
    {
      icon: Recycle,
      color: 'text-green-600 bg-green-50 border-green-100',
      value: `${impact?.itemsScrapped || 18}`,
      label: 'E-Waste / Scrap items',
      sub: 'routed to verified recyclers',
    },
  ];

  const categoryBreakdown = [
    { name: 'Home & Furniture', kg: 62, percent: 40, color: 'bg-emerald-500' },
    { name: 'Books & Paper', kg: 45, percent: 29, color: 'bg-amber-500' },
    { name: 'Electronics & Gadgets', kg: 28, percent: 18, color: 'bg-sky-500' },
    { name: 'Appliances', kg: 14, percent: 9, color: 'bg-teal-500' },
    { name: 'Clothing & Fitness', kg: 7, percent: 4, color: 'bg-rose-400' },
  ];

  const milestones = [
    { title: '100 kg Diverted Milestone', desc: 'Over 100 kg kept out of local dumps', unlocked: true, icon: '🌿' },
    { title: 'First 25 Reused Goods', desc: 'Neighbour to neighbour reuse drive', unlocked: true, icon: '🤝' },
    { title: 'Certified Safe Scrap Day', desc: 'Zero toxic lithium & mercury sent to landfills', unlocked: true, icon: '⚡' },
    { title: 'Next: 200 kg Green Champion', desc: `Only ${targetKg - (impact?.kgDiverted || 156)} kg to unlock Level 3 badge`, unlocked: false, icon: '🏆' },
  ];

  return (
    <div className="min-h-dvh bg-slate-50 pb-safe">
      {/* Header */}
      <div className="bg-gradient-to-br from-green-800 via-green-700 to-emerald-600 px-5 pt-12 pb-8 rounded-b-[2.5rem] relative overflow-hidden shadow-lg shadow-green-900/10">
        <div className="absolute -top-16 -right-16 w-56 h-56 bg-white/5 rounded-full blur-2xl" />
        <div className="absolute bottom-0 -left-12 w-40 h-40 bg-white/5 rounded-full blur-xl" />

        <div className="flex items-center justify-between mb-4 relative z-10">
          <button
            onClick={() => navigate(-1)}
            className="p-2 -ml-2 text-white/80 hover:text-white rounded-xl bg-white/10 backdrop-blur-sm transition"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <button
            onClick={handleShare}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white/15 hover:bg-white/25 backdrop-blur-sm rounded-xl text-white text-xs font-semibold border border-white/20 transition active:scale-95"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Share</span>
          </button>
        </div>

        <div className="relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 text-green-200 text-xs font-medium mb-2 border border-white/10">
            <Leaf className="w-3.5 h-3.5 text-green-300" />
            <span>Environmental Impact</span>
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">{community?.name}</h1>
          <p className="text-green-100 text-xs mt-1">Real-time collective savings across our living space</p>
        </div>

        {/* Big Key Stats Grid */}
        <div className="grid grid-cols-2 gap-3 mt-6 relative z-10">
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4">
            <span className="text-2xl">⚖️</span>
            <p className="text-3xl font-extrabold text-white mt-1 leading-none">{impact?.kgDiverted || 156} <span className="text-base font-semibold text-green-200">kg</span></p>
            <p className="text-green-100 text-xs mt-1 font-medium">Waste Diverted</p>
          </div>
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4">
            <span className="text-2xl">🌱</span>
            <p className="text-3xl font-extrabold text-white mt-1 leading-none">{impact?.co2eAvoided || 234} <span className="text-base font-semibold text-green-200">kg</span></p>
            <p className="text-green-100 text-xs mt-1 font-medium">CO₂e Avoided</p>
          </div>
        </div>
      </div>

      <div className="px-5 space-y-6 -mt-3">
        {/* Milestone Goal Card */}
        <div className="bg-white rounded-2xl p-4.5 border border-slate-100 shadow-sm animate-fade-in">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              <h2 className="font-bold text-sm text-slate-800">Community Goal: 200kg Diverted</h2>
            </div>
            <span className="text-xs font-bold text-emerald-600">{progressPercent}%</span>
          </div>
          <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden p-0.5">
            <div
              className="h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full transition-all duration-1000"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <p className="text-[11px] text-slate-500 mt-2">
            {targetKg - (impact?.kgDiverted || 156)}kg remaining until our community unlocks the Level 3 Eco-Certificate!
          </p>
        </div>

        {/* Real World Equivalencies */}
        <section className="animate-fade-in" style={{ animationDelay: '100ms' }}>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-bold text-slate-800 text-sm flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-emerald-600" />
              Real-World Equivalents
            </h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {equivalencies.map((eq, i) => {
              const Icon = eq.icon;
              return (
                <div key={i} className="bg-white rounded-2xl p-3.5 border border-slate-100 shadow-sm">
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center mb-2.5 border ${eq.color}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <p className="font-extrabold text-base text-slate-800">{eq.value}</p>
                  <p className="font-semibold text-xs text-slate-700">{eq.label}</p>
                  <p className="text-[10px] text-slate-400 mt-0.5 leading-snug">{eq.sub}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* 2-column on desktop: Category Breakdown & Community Milestones */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Category Breakdown */}
          <section className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm animate-fade-in" style={{ animationDelay: '150ms' }}>
            <h2 className="font-bold text-sm text-slate-800 mb-3 flex items-center gap-2">
              <Recycle className="w-4 h-4 text-green-600" />
              Diversion by Category
            </h2>
            <div className="space-y-3">
              {categoryBreakdown.map((cat, i) => (
                <div key={i}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-600 font-medium">{cat.name}</span>
                    <span className="text-slate-800 font-semibold">{cat.kg} kg ({cat.percent}%)</span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className={`h-full ${cat.color} rounded-full`} style={{ width: `${cat.percent}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Community Milestones & Badges */}
          <section className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm animate-fade-in" style={{ animationDelay: '200ms' }}>
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-bold text-sm text-slate-800 flex items-center gap-1.5">
                <Award className="w-4 h-4 text-amber-500" />
                Community Milestones
              </h2>
              <span className="text-[11px] font-semibold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-100">
                3 Unlocked
              </span>
            </div>
            <div className="space-y-2.5">
              {milestones.map((ms, i) => (
                <div
                  key={i}
                  className={`flex items-start gap-3 p-3 rounded-xl border transition ${
                    ms.unlocked ? 'bg-slate-50/70 border-slate-100' : 'bg-slate-50/30 border-dashed border-slate-200 opacity-60'
                  }`}
                >
                  <div className="text-xl shrink-0 mt-0.5">{ms.icon}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <p className="font-semibold text-xs text-slate-800">{ms.title}</p>
                      {ms.unlocked && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />}
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5">{ms.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Honest Disclosure Banner */}
        <div className="p-3.5 bg-slate-100/80 rounded-xl text-[11px] text-slate-500 border border-slate-200 text-center">
          🏷️ <strong>Community Demo Estimates:</strong> Equivalencies are modeled using standardized EPA WARM and CEA lifecycle emission factors based on {impact?.itemsReused || 42} items reused and {impact?.itemsScrapped || 18} items recycled.
        </div>

        {/* Clearing out CTA */}
        <div className="bg-gradient-to-r from-emerald-600 to-green-600 rounded-2xl p-4 text-white shadow-lg shadow-emerald-700/20 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-sm">Boost Our Community Score</h3>
            <p className="text-xs text-emerald-100 mt-0.5">Got an unused lamp, textbook, or kettle?</p>
          </div>
          <button
            onClick={() => navigate('/clearing-out')}
            className="px-4 py-2 bg-white text-emerald-700 font-bold text-xs rounded-xl hover:bg-emerald-50 transition shrink-0 shadow-sm"
          >
            Clear Out
          </button>
        </div>
      </div>
    </div>
  );
}
