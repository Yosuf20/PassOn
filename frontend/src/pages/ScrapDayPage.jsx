import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import api, { ITEM_ICONS } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import { ArrowLeft, CalendarDays, Truck, Package, AlertTriangle, CheckCircle2 } from 'lucide-react';

export default function ScrapDayPage() {
  const { community } = useApp();
  const navigate = useNavigate();
  const [scrapDays, setScrapDays] = useState([]);
  const [scrapItems, setScrapItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!community) { navigate('/join'); return; }
    loadData();
  }, [community]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [days, items] = await Promise.all([
        api.getScrapDays(community.id),
        api.getItems(community.id),
      ]);
      setScrapDays(days);
      setScrapItems(items.filter(i => i.route === 'scrap' || i.route === 'ewaste'));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner message="Loading scrap days..." />;

  return (
    <div className="min-h-dvh bg-slate-50 pb-safe">
      {/* Header */}
      <div className="bg-gradient-to-br from-amber-600 to-orange-500 px-5 pt-12 pb-8 rounded-b-[2rem] relative overflow-hidden">
        <div className="max-w-4xl mx-auto relative z-10">
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/5 rounded-full" />
          <button onClick={() => navigate(-1)} className="p-2 -ml-2 text-white/80 hover:text-white mb-2">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Truck className="w-6 h-6" /> Scrap Day
          </h1>
          <p className="text-amber-100 text-sm mt-1">Community scrap & e-waste collection drives</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto w-full px-5 pt-4 space-y-6 -mt-3">
        {/* Upcoming scrap days */}
        {scrapDays.map(day => (
          <div key={day.id} className="bg-white rounded-2xl border border-amber-100 shadow-sm overflow-hidden animate-fade-in">
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 px-5 py-4 border-b border-amber-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
                    <CalendarDays className="w-6 h-6 text-amber-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800">{new Date(day.date).toLocaleDateString('en-IN', { weekday: 'long', month: 'short', day: 'numeric' })}</h3>
                    <p className="text-xs text-slate-500">{day.description}</p>
                  </div>
                </div>
                <span className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase ${day.status === 'upcoming' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'}`}>
                  {day.status}
                </span>
              </div>
            </div>
            <div className="px-5 py-4">
              <div className="flex gap-4 mb-3">
                <div className="text-center">
                  <p className="text-2xl font-bold text-amber-600">{day.itemIds.length}</p>
                  <p className="text-[10px] text-slate-400 uppercase font-medium">Items</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-amber-600">{day.estimatedWeight}kg</p>
                  <p className="text-[10px] text-slate-400 uppercase font-medium">Est. Weight</p>
                </div>
              </div>
            </div>
          </div>
        ))}

        {scrapDays.length === 0 && (
          <div className="text-center py-8">
            <CalendarDays className="w-10 h-10 text-slate-200 mx-auto mb-3" />
            <p className="text-slate-400 font-medium">No scrap days scheduled</p>
          </div>
        )}

        {/* Scrap/E-waste items */}
        <section>
          <h2 className="font-bold text-slate-800 mb-3 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-500" />
            Items for Scrap / E-Waste
          </h2>
          {scrapItems.length === 0 ? (
            <p className="text-sm text-slate-400 text-center py-6">No scrap items right now</p>
          ) : (
            <div className="space-y-2 stagger-children">
              {scrapItems.map(item => (
                <button
                  key={item.id}
                  onClick={() => navigate(`/item/${item.id}`)}
                  className="w-full flex items-center gap-3 bg-white rounded-xl p-4 border border-slate-100 hover:shadow-sm transition animate-fade-in"
                >
                  <span className="text-2xl">{ITEM_ICONS[item.category] || '📦'}</span>
                  <div className="flex-1 text-left">
                    <p className="text-sm font-semibold text-slate-700">{item.title}</p>
                    <p className="text-xs text-slate-400">{item.description?.slice(0, 60)}...</p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${item.route === 'ewaste' ? 'bg-rose-100 text-rose-600' : 'bg-amber-100 text-amber-600'}`}>
                    {item.route === 'ewaste' ? 'E-Waste' : 'Scrap'}
                  </span>
                </button>
              ))}
            </div>
          )}
        </section>

        {/* Info */}
        <div className="bg-amber-50 border border-amber-100 rounded-2xl p-5 mb-4">
          <h3 className="font-bold text-amber-800 text-sm mb-2">How Scrap Day Works</h3>
          <div className="space-y-2 text-xs text-amber-700">
            <p>🗓️ Community organizes a collection day</p>
            <p>📦 Members mark items as scrap/e-waste</p>
            <p>🚛 Collector picks up all items in bulk</p>
            <p>♻️ Proper recycling & disposal guaranteed</p>
          </div>
        </div>
      </div>
    </div>
  );
}
