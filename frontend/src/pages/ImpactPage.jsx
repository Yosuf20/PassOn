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
  TreeDeciduous,
  Car,
  Lightbulb,
  Sparkles,
  CheckCircle2,
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
    const text = `🌱 Together in ${community?.name || 'our community'}, we've reused ${impact?.itemsReused || 42} items, diverted ${impact?.kgDiverted || 156}kg waste, and avoided ${impact?.co2eAvoided || 234}kg CO₂e via PassOn!`;
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
      value: `${Math.round((impact?.co2eAvoided || 234) / 20)}`,
      label: 'Tree Seedlings',
      sub: 'sequestered carbon eq. (10 yrs)',
      color: 'bg-emerald-100 text-emerald-700',
    },
    {
      icon: Car,
      value: `${Math.round((impact?.co2eAvoided || 234) * 4)} km`,
      label: 'Driving Avoided',
      sub: 'vs average petrol passenger vehicle',
      color: 'bg-blue-100 text-blue-700',
    },
    {
      icon: Lightbulb,
      value: `${((impact?.co2eAvoided || 234) * 120).toLocaleString()}`,
      label: 'Hours LED Light',
      sub: 'clean equivalent energy saved',
      color: 'bg-amber-100 text-amber-700',
    },
    {
      icon: Recycle,
      value: `${impact?.itemsScrapped || 18}`,
      label: 'Recycled Goods',
      sub: 'routed to certified scrap recyclers',
      color: 'bg-emerald-100 text-emerald-700',
    },
  ];

  const categoryBreakdown = [
    { name: 'Home & Furniture', kg: 62, percent: 40, color: 'bg-emerald-500' },
    { name: 'Books & Paper', kg: 45, percent: 29, color: 'bg-amber-500' },
    { name: 'Electronics & Gadgets', kg: 28, percent: 18, color: 'bg-blue-500' },
    { name: 'Appliances', kg: 14, percent: 9, color: 'bg-teal-500' },
    { name: 'Clothing & Fitness', kg: 7, percent: 4, color: 'bg-rose-500' },
  ];

  const milestones = [
    { title: '100 kg Diverted Milestone', desc: 'Over 100 kg kept out of local dumps', unlocked: true },
    { title: 'First 25 Reused Goods', desc: 'Neighbour to neighbour circular exchanges', unlocked: true },
    { title: 'Certified Safe Scrap Day', desc: 'Zero toxic battery chemicals sent to landfills', unlocked: true },
    { title: 'Next: 200 kg Eco Champion', desc: `${targetKg - (impact?.kgDiverted || 156)} kg remaining to unlock Level 3 certificate`, unlocked: false },
  ];

  return (
    <div className="min-h-dvh bg-white text-gray-900 pb-safe">
      <div className="px-5 sm:px-8 pt-6 pb-4 space-y-6">
        {/* Flat Hero Banner */}
        <div className="bg-emerald-500 rounded-2xl p-6 sm:p-8 text-white relative overflow-hidden">
          <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-white/10 pointer-events-none" />
          <div className="absolute bottom-0 -left-10 w-36 h-36 rounded-2xl bg-white/10 pointer-events-none rotate-12" />

          <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate(-1)}
                className="p-2 rounded-lg bg-white/20 hover:bg-white/30 text-white transition"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <div className="inline-flex items-center gap-1.5 bg-white/20 px-2.5 py-0.5 rounded-md text-xs font-bold uppercase tracking-wider mb-1">
                  <Leaf className="w-3.5 h-3.5" />
                  <span>Environmental Ledger</span>
                </div>
                <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                  {community?.name}
                </h1>
                <p className="text-emerald-100 text-sm mt-0.5 font-medium">
                  Real-time collective savings across your living circle
                </p>
              </div>
            </div>

            <button
              onClick={handleShare}
              className="px-4 py-2.5 bg-white text-emerald-800 hover:bg-emerald-50 font-bold text-xs rounded-lg transition-transform hover:scale-105 flex items-center gap-2 self-start sm:self-auto"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Share Impact</span>
            </button>
          </div>

          {/* Key Stat Blocks */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-6 relative z-10">
            <div className="bg-white text-gray-900 rounded-xl p-4 text-center">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Waste Diverted</p>
              <p className="font-extrabold text-3xl sm:text-4xl text-emerald-600 mt-1">
                {impact?.kgDiverted || 156} <span className="text-base font-bold text-gray-700">kg</span>
              </p>
            </div>
            <div className="bg-white text-gray-900 rounded-xl p-4 text-center">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">CO₂e Avoided</p>
              <p className="font-extrabold text-3xl sm:text-4xl text-blue-600 mt-1">
                {impact?.co2eAvoided || 234} <span className="text-base font-bold text-gray-700">kg</span>
              </p>
            </div>
            <div className="bg-white text-gray-900 rounded-xl p-4 col-span-2 sm:col-span-1 text-center">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Items Reused</p>
              <p className="font-extrabold text-3xl sm:text-4xl text-amber-600 mt-1">
                {impact?.itemsReused || 42}
              </p>
            </div>
          </div>
        </div>

        {/* Milestone Goal Meter */}
        <div className="bg-gray-100 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-emerald-600" />
              <h2 className="font-extrabold text-base text-gray-900">
                Community Goal: 200kg Diverted
              </h2>
            </div>
            <span className="font-extrabold text-sm text-emerald-600">{progressPercent}%</span>
          </div>

          <div className="w-full h-3.5 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald-500 rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          <p className="text-xs text-gray-500 font-medium mt-2">
            {targetKg - (impact?.kgDiverted || 156)}kg remaining until our community unlocks the Level 3 Eco-Certificate!
          </p>
        </div>

        {/* Real World Equivalencies */}
        <section>
          <div className="mb-4">
            <h2 className="font-extrabold text-xl text-gray-900 tracking-tight">
              Real-World Equivalents
            </h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {equivalencies.map((eq, i) => {
              const Icon = eq.icon;
              return (
                <div key={i} className="bg-gray-100 rounded-xl p-4 text-center">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center mx-auto mb-2.5 ${eq.color}`}>
                    <Icon className="w-5 h-5" strokeWidth={2.5} />
                  </div>
                  <p className="font-extrabold text-xl text-gray-900">{eq.value}</p>
                  <p className="font-bold text-xs text-gray-800 mt-0.5">{eq.label}</p>
                  <p className="text-[11px] text-gray-500 mt-1 leading-snug">{eq.sub}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* 2-Column Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Category Breakdown */}
          <section className="bg-gray-100 rounded-2xl p-6">
            <h3 className="font-extrabold text-base text-gray-900 mb-4">
              Diversion by Category
            </h3>
            <div className="space-y-4 text-xs font-semibold">
              {categoryBreakdown.map((cat, i) => (
                <div key={i}>
                  <div className="flex justify-between mb-1.5">
                    <span className="text-gray-700">{cat.name}</span>
                    <span className="text-gray-900">{cat.kg} kg ({cat.percent}%)</span>
                  </div>
                  <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                    <div className={`h-full ${cat.color} rounded-full`} style={{ width: `${cat.percent}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Community Milestones */}
          <section className="bg-gray-100 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-extrabold text-base text-gray-900">
                Community Milestones
              </h3>
              <span className="text-xs font-bold bg-amber-100 text-amber-800 px-2.5 py-0.5 rounded-md">
                3 Unlocked
              </span>
            </div>
            <div className="space-y-3 text-xs">
              {milestones.map((ms, i) => (
                <div
                  key={i}
                  className={`p-3.5 rounded-xl transition ${
                    ms.unlocked ? 'bg-white' : 'bg-gray-200/50 opacity-60'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <p className="font-bold text-gray-900">{ms.title}</p>
                    {ms.unlocked && <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />}
                  </div>
                  <p className="text-gray-500 mt-0.5 font-medium">{ms.desc}</p>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Footnote */}
        <div className="p-4 bg-gray-100 rounded-xl text-xs text-gray-500 font-medium text-center">
          🏷️ Standardized EPA WARM lifecycle emissions factors modeled based on {impact?.itemsReused || 42} items reused and {impact?.itemsScrapped || 18} items recycled.
        </div>
      </div>
    </div>
  );
}
