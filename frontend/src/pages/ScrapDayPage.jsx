import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import api, { ITEM_ICONS } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import { ArrowLeft, CalendarDays, Truck, AlertTriangle } from 'lucide-react';

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

  if (loading) return <LoadingSpinner message="Loading scrap day drives..." />;

  return (
    <div className="min-h-dvh bg-white text-gray-900 pb-safe">
      {/* Header */}
      <div className="border-b-2 border-gray-100 px-5 sm:px-8 pt-8 pb-6 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-2">
            <button
              onClick={() => navigate(-1)}
              className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 transition"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <h1 className="font-extrabold text-3xl sm:text-4xl text-gray-900 tracking-tight flex items-center gap-2">
              <Truck className="w-8 h-8 text-amber-500" strokeWidth={2.5} />
              <span>Scrap Day Collection</span>
            </h1>
          </div>
          <p className="text-gray-500 text-sm font-medium max-w-xl">
            Community collection drives aggregating broken appliances, electronics, and materials for verified recyclers.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto w-full px-5 sm:px-8 py-6 space-y-8">
        {/* Upcoming Scrap Days */}
        <section>
          <h2 className="font-extrabold text-xl text-gray-900 mb-4">
            Scheduled Collection Drives
          </h2>

          {scrapDays.map(day => (
            <div key={day.id} className="bg-amber-50 rounded-2xl p-6 mb-4 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 bg-amber-500 text-white rounded-xl flex items-center justify-center shrink-0">
                    <CalendarDays className="w-6 h-6" strokeWidth={2.5} />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-lg text-gray-900">
                      {new Date(day.date).toLocaleDateString('en-IN', { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' })}
                    </h3>
                    <p className="text-xs text-amber-800 font-medium">{day.description}</p>
                  </div>
                </div>
                <span className="text-xs font-extrabold uppercase px-3 py-1 rounded-md bg-amber-200 text-amber-900 self-start sm:self-auto">
                  Status: {day.status}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-white rounded-xl p-4 text-center">
                  <p className="text-2xl sm:text-3xl font-extrabold text-gray-900">{day.itemIds.length}</p>
                  <p className="text-xs text-gray-500 font-semibold uppercase mt-0.5">Committed Items</p>
                </div>
                <div className="bg-white rounded-xl p-4 text-center">
                  <p className="text-2xl sm:text-3xl font-extrabold text-amber-600">{day.estimatedWeight} <span className="text-sm font-bold">kg</span></p>
                  <p className="text-xs text-gray-500 font-semibold uppercase mt-0.5">Est. Weight</p>
                </div>
              </div>
            </div>
          ))}

          {scrapDays.length === 0 && (
            <div className="bg-gray-100 rounded-2xl p-8 text-center">
              <CalendarDays className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="font-bold text-base text-gray-900">No collection drives scheduled</p>
              <p className="text-xs text-gray-500 mt-1 font-medium">
                Drives are scheduled when accumulated bulk items reach threshold.
              </p>
            </div>
          )}
        </section>

        {/* Current Items in Scrap / E-Waste Queue */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="w-5 h-5 text-amber-500" strokeWidth={2.5} />
            <h2 className="font-extrabold text-xl text-gray-900">
              Items in Bulk Recovery Queue
            </h2>
          </div>

          {scrapItems.length === 0 ? (
            <div className="bg-gray-100 rounded-2xl p-6 text-center text-xs text-gray-500 font-semibold">
              Queue currently empty — all community items claimed or reused
            </div>
          ) : (
            <div className="space-y-2.5">
              {scrapItems.map(item => (
                <button
                  key={item.id}
                  onClick={() => navigate(`/item/${item.id}`)}
                  className="w-full flex items-center justify-between p-4 bg-gray-100 hover:bg-gray-200/70 rounded-xl transition text-left cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{ITEM_ICONS[item.category] || '📦'}</span>
                    <div>
                      <p className="font-bold text-sm text-gray-900">{item.title}</p>
                      <p className="text-xs text-gray-500 line-clamp-1">{item.description}</p>
                    </div>
                  </div>
                  <span className={`px-2.5 py-1 text-xs font-bold uppercase rounded-md ${
                    item.route === 'ewaste'
                      ? 'bg-rose-100 text-rose-700'
                      : 'bg-amber-100 text-amber-700'
                  }`}>
                    {item.route === 'ewaste' ? 'E-Waste' : 'Scrap'}
                  </span>
                </button>
              ))}
            </div>
          )}
        </section>

        {/* How It Works Guide */}
        <div className="bg-gray-100 rounded-2xl p-6 space-y-2.5">
          <h3 className="font-extrabold text-sm uppercase tracking-wider text-gray-900">
            How Scrap Day Works
          </h3>
          <div className="space-y-1.5 text-xs text-gray-600 font-medium leading-relaxed">
            <p>&bull; <strong>Consolidation:</strong> Goods staged at ground floor pickup spot.</p>
            <p>&bull; <strong>Verified Scale:</strong> Vendor weighs items collectively on certified scales.</p>
            <p>&bull; <strong>Zero Landfill:</strong> Electronics routed to certified recyclers for metal recovery.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
