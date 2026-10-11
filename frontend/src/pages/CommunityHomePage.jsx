import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import api from '../services/api';
import ItemCard from '../components/ItemCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { Bell, ChevronRight, Recycle, TrendingUp, Heart, Package, Sparkles, CalendarDays, ArrowRight } from 'lucide-react';

export default function CommunityHomePage() {
  const { user, community } = useApp();
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [impact, setImpact] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [wishMatches, setWishMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!community) { navigate('/join'); return; }
    loadData();
  }, [community]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [itemsRes, impactRes, notifsRes, matchesRes] = await Promise.all([
        api.getItems(community.id, { status: 'available' }),
        api.getImpact(community.id),
        api.getNotifications(user.id),
        api.getWishlistMatches(user.id, community.id),
      ]);
      setItems(itemsRes.slice(0, 6));
      setImpact(impactRes);
      setNotifications(notifsRes.slice(0, 3));
      setWishMatches(matchesRes);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  if (loading) return <LoadingSpinner message="Loading community..." />;

  return (
    <div className="pb-safe bg-white text-gray-900">
      <div className="px-5 sm:px-8 pt-6 pb-4 space-y-6">
        {/* Flat Hero / Community Banner */}
        <div className="bg-blue-500 rounded-2xl p-6 sm:p-8 text-white relative overflow-hidden">
          {/* Subtle geometric circles */}
          <div className="absolute -top-10 -right-10 w-44 h-44 rounded-full bg-white/10 pointer-events-none" />
          <div className="absolute bottom-0 -left-10 w-36 h-36 rounded-2xl bg-white/10 pointer-events-none rotate-12" />

          <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 bg-white/20 px-3 py-1 rounded-md text-xs font-bold uppercase tracking-wider mb-2">
                <Recycle className="w-3.5 h-3.5" />
                <span>Active Living Circle</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                {community.name}
              </h1>
              <p className="text-blue-100 text-sm mt-1 font-medium">
                {community.memberCount} active residents sharing surplus goods & reducing waste
              </p>
            </div>

            <button
              onClick={() => navigate('/notifications')}
              className="relative p-3 bg-white/20 hover:bg-white/30 text-white rounded-xl transition self-start sm:self-auto"
              title="Notifications"
            >
              <Bell className="w-5 h-5" strokeWidth={2.5} />
              {unreadCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-amber-500 text-white text-[11px] font-extrabold rounded-full flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>
          </div>

          {/* Impact Quick Ticker Blocks */}
          {impact && (
            <div className="grid grid-cols-3 gap-3 mt-6 relative z-10">
              <div className="bg-white text-gray-900 rounded-xl p-3.5 text-center">
                <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Reused</p>
                <p className="font-extrabold text-2xl text-blue-600 mt-0.5">{impact.itemsReused}</p>
              </div>
              <div className="bg-white text-gray-900 rounded-xl p-3.5 text-center">
                <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Diverted</p>
                <p className="font-extrabold text-2xl text-emerald-600 mt-0.5">{impact.kgDiverted} <span className="text-xs font-bold">kg</span></p>
              </div>
              <div className="bg-white text-gray-900 rounded-xl p-3.5 text-center">
                <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">CO₂ Saved</p>
                <p className="font-extrabold text-2xl text-amber-600 mt-0.5">{impact.co2eAvoided} <span className="text-xs font-bold">kg</span></p>
              </div>
            </div>
          )}
        </div>

        {/* Clearing Out Lead Action Banner */}
        <div
          onClick={() => navigate('/clearing-out')}
          className="bg-emerald-500 hover:bg-emerald-600 text-white rounded-2xl p-6 transition-all duration-200 hover:scale-[1.01] cursor-pointer flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
        >
          <div className="flex items-start sm:items-center gap-4">
            <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center shrink-0">
              <Sparkles className="w-7 h-7 text-white" />
            </div>
            <div>
              <div className="inline-block text-[11px] font-extrabold bg-white text-emerald-700 px-2 py-0.5 rounded-md uppercase tracking-wider mb-1">
                AI Vision Intake
              </div>
              <h2 className="font-extrabold text-2xl leading-snug">
                Clearing Out Surplus Goods?
              </h2>
              <p className="text-emerald-100 text-sm mt-0.5 font-medium max-w-xl">
                Take one photo of your desk, shelf, or closet. Our AI automatically identifies items and drafts listings.
              </p>
            </div>
          </div>
          <button className="px-5 py-3 bg-white text-emerald-700 hover:bg-emerald-50 font-bold text-sm rounded-lg transition-transform hover:scale-105 flex items-center gap-2 shrink-0">
            <span>Scan Photo</span>
            <ArrowRight className="w-4 h-4" strokeWidth={2.5} />
          </button>
        </div>

        {/* 2-Column Section: Wishlist Matches & Bulletins */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Wishlist Matches */}
          <section className="bg-gray-100 rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-rose-100 text-rose-600 flex items-center justify-center">
                  <Heart className="w-4 h-4" strokeWidth={2.5} />
                </div>
                <h3 className="font-bold text-base text-gray-900">Wishlist Matches</h3>
              </div>
              <Link to="/wishlist" className="text-xs font-bold text-blue-600 hover:text-blue-800 transition">
                View all &rarr;
              </Link>
            </div>

            {wishMatches.length > 0 ? (
              <div className="space-y-3">
                {wishMatches.map(match => (
                  <div key={match.wish.id} className="bg-white rounded-xl p-3.5">
                    <div className="flex items-center justify-between text-xs font-bold text-gray-800 mb-2">
                      <span>Wanted: "{match.wish.keyword}"</span>
                      <span className="bg-rose-100 text-rose-700 px-2 py-0.5 rounded-md text-[10px]">
                        {match.items.length} match{match.items.length !== 1 ? 'es' : ''}
                      </span>
                    </div>
                    <div className="flex gap-2 overflow-x-auto scrollbar-hide">
                      {match.items.slice(0, 3).map(item => (
                        <button
                          key={item.id}
                          onClick={() => navigate(`/item/${item.id}`)}
                          className="shrink-0 bg-gray-100 rounded-lg px-3 py-1.5 text-xs font-semibold text-gray-800 hover:bg-blue-50 hover:text-blue-700 transition"
                        >
                          {item.title}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 text-xs text-gray-500 font-medium bg-white rounded-xl">
                No active item matches today
              </div>
            )}
          </section>

          {/* Recent Bulletins */}
          <section className="bg-gray-100 rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center">
                  <Bell className="w-4 h-4" strokeWidth={2.5} />
                </div>
                <h3 className="font-bold text-base text-gray-900">Recent Alerts</h3>
              </div>
              <Link to="/notifications" className="text-xs font-bold text-blue-600 hover:text-blue-800 transition">
                All alerts &rarr;
              </Link>
            </div>

            {notifications.length > 0 ? (
              <div className="space-y-2.5">
                {notifications.map(n => (
                  <button
                    key={n.id}
                    onClick={() => n.itemId ? navigate(`/item/${n.itemId}`) : navigate('/notifications')}
                    className="w-full text-left p-3 rounded-xl bg-white hover:bg-blue-50/50 transition cursor-pointer"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-gray-900">{n.title}</span>
                      {!n.read && <span className="w-2 h-2 rounded-full bg-blue-500"></span>}
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">{n.message}</p>
                  </button>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 text-xs text-gray-500 font-medium bg-white rounded-xl">
                No new notifications
              </div>
            )}
          </section>
        </div>

        {/* 4 Flat Feature Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <button
            onClick={() => navigate('/scrap-day')}
            className="p-5 bg-gray-100 hover:bg-amber-50 text-left rounded-xl transition-all duration-200 hover:scale-[1.02] cursor-pointer"
          >
            <div className="w-10 h-10 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center mb-3">
              <CalendarDays className="w-5 h-5" strokeWidth={2.5} />
            </div>
            <p className="font-bold text-sm text-gray-900">Scrap Day</p>
            <p className="text-xs text-gray-500 mt-0.5 font-medium">Bulk Drives</p>
          </button>

          <button
            onClick={() => navigate('/impact')}
            className="p-5 bg-gray-100 hover:bg-emerald-50 text-left rounded-xl transition-all duration-200 hover:scale-[1.02] cursor-pointer"
          >
            <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center mb-3">
              <TrendingUp className="w-5 h-5" strokeWidth={2.5} />
            </div>
            <p className="font-bold text-sm text-gray-900">Eco Impact</p>
            <p className="text-xs text-gray-500 mt-0.5 font-medium">Metrics</p>
          </button>

          <button
            onClick={() => navigate('/wishlist')}
            className="p-5 bg-gray-100 hover:bg-rose-50 text-left rounded-xl transition-all duration-200 hover:scale-[1.02] cursor-pointer"
          >
            <div className="w-10 h-10 rounded-lg bg-rose-100 text-rose-600 flex items-center justify-center mb-3">
              <Heart className="w-5 h-5" strokeWidth={2.5} />
            </div>
            <p className="font-bold text-sm text-gray-900">Wishlist</p>
            <p className="text-xs text-gray-500 mt-0.5 font-medium">Auto Radar</p>
          </button>

          <button
            onClick={() => navigate('/marketplace')}
            className="p-5 bg-gray-100 hover:bg-blue-50 text-left rounded-xl transition-all duration-200 hover:scale-[1.02] cursor-pointer"
          >
            <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center mb-3">
              <Package className="w-5 h-5" strokeWidth={2.5} />
            </div>
            <p className="font-bold text-sm text-gray-900">Marketplace</p>
            <p className="text-xs text-gray-500 mt-0.5 font-medium">Browse All</p>
          </button>
        </div>

        {/* Available Items Section */}
        <section className="pt-2">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-extrabold text-2xl text-gray-900 tracking-tight">
                Available In Your Community
              </h2>
              <p className="text-xs text-gray-500 font-medium">Recently listed goods ready for claiming</p>
            </div>
            <Link
              to="/marketplace"
              className="px-3.5 py-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-xs font-bold text-gray-800 transition"
            >
              See All &rarr;
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-4">
            {items.map(item => (
              <ItemCard key={item.id} item={item} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
