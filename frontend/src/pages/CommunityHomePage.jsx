import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import api from '../services/api';
import ItemCard from '../components/ItemCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { Bell, ChevronRight, Leaf, Recycle, TrendingUp, Heart, Package, Sparkles, CalendarDays } from 'lucide-react';

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

  if (loading) return <LoadingSpinner message="Loading your community..." />;

  return (
    <div className="pb-safe">
      {/* Header */}
      <div className="bg-gradient-to-br from-green-800 via-green-700 to-emerald-600 px-5 pt-12 pb-8 relative overflow-hidden">
        <div className="absolute -top-12 -right-12 w-48 h-48 bg-white/5 rounded-full" />
        <div className="absolute bottom-0 -left-10 w-36 h-36 bg-white/5 rounded-full" />

        <div className="flex items-start justify-between relative z-10">
          <div>
            <div className="flex items-center gap-1.5 mb-1">
              <Recycle className="w-4 h-4 text-green-300" />
              <span className="text-green-200 text-xs font-medium tracking-wide">PassOn</span>
            </div>
            <h1 className="text-xl font-bold text-white leading-snug">{community.name}</h1>
            <p className="text-green-200 text-xs mt-0.5">{community.memberCount} members</p>
          </div>
          <button
            onClick={() => navigate('/notifications')}
            className="relative p-2.5 bg-white/10 rounded-xl border border-white/10 hover:bg-white/20 transition"
          >
            <Bell className="w-5 h-5 text-white" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse-soft">
                {unreadCount}
              </span>
            )}
          </button>
        </div>

        {/* Quick Impact Strip */}
        {impact && (
          <div className="flex gap-3 mt-5 overflow-x-auto scrollbar-hide -mx-1 px-1">
            {[
              { icon: '♻️', value: impact.itemsReused, label: 'Reused' },
              { icon: '⚖️', value: `${impact.kgDiverted}kg`, label: 'Diverted' },
              { icon: '🌿', value: `${impact.co2eAvoided}kg`, label: 'CO₂ saved' },
            ].map((stat, i) => (
              <div key={i} className="bg-white/10 backdrop-blur-sm border border-white/10 rounded-xl px-4 py-2.5 flex items-center gap-2.5 shrink-0">
                <span className="text-lg">{stat.icon}</span>
                <div>
                  <p className="text-white font-bold text-sm leading-none">{stat.value}</p>
                  <p className="text-green-200 text-[10px] mt-0.5">{stat.label}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="px-5 space-y-6 -mt-3">
        {/* Clearing Out CTA */}
        <button
          onClick={() => navigate('/clearing-out')}
          className="w-full bg-gradient-to-r from-green-600 to-emerald-500 text-white rounded-2xl p-5 shadow-xl shadow-green-600/20 flex items-center gap-4 hover:shadow-2xl hover:scale-[1.01] active:scale-[0.99] transition-all duration-200 animate-fade-in"
        >
          <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center shrink-0">
            <Sparkles className="w-7 h-7" />
          </div>
          <div className="text-left flex-1">
            <h3 className="font-bold text-lg">Clearing Out?</h3>
            <p className="text-green-100 text-sm mt-0.5">Upload a photo — AI creates listings for you</p>
          </div>
          <ChevronRight className="w-6 h-6 text-green-200 shrink-0" />
        </button>

        {/* Wishlist Matches */}
        {wishMatches.length > 0 && (
          <section className="animate-fade-in" style={{ animationDelay: '100ms' }}>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Heart className="w-4 h-4 text-rose-500" />
                <h2 className="font-bold text-slate-800">Wishlist Matches</h2>
              </div>
              <Link to="/wishlist" className="text-green-600 text-sm font-semibold flex items-center gap-0.5">
                View all <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="space-y-2.5">
              {wishMatches.map(match => (
                <div key={match.wish.id} className="bg-rose-50 border border-rose-100 rounded-xl p-3.5">
                  <p className="text-xs font-medium text-rose-600 mb-1.5">
                    🎯 "{match.wish.keyword}" — {match.items.length} match{match.items.length !== 1 ? 'es' : ''}
                  </p>
                  <div className="flex gap-2 overflow-x-auto scrollbar-hide">
                    {match.items.slice(0, 3).map(item => (
                      <button
                        key={item.id}
                        onClick={() => navigate(`/item/${item.id}`)}
                        className="shrink-0 bg-white rounded-lg px-3 py-2 text-xs font-medium text-slate-700 border border-rose-100 hover:border-rose-300 transition"
                      >
                        {item.title}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Recent Notifications */}
        {notifications.length > 0 && (
          <section className="animate-fade-in" style={{ animationDelay: '150ms' }}>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Bell className="w-4 h-4 text-sky-500" />
                <h2 className="font-bold text-slate-800">Recent Alerts</h2>
              </div>
              <Link to="/notifications" className="text-green-600 text-sm font-semibold flex items-center gap-0.5">
                All <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="space-y-2">
              {notifications.map(n => (
                <button
                  key={n.id}
                  onClick={() => n.itemId ? navigate(`/item/${n.itemId}`) : navigate('/notifications')}
                  className={`w-full text-left p-3.5 rounded-xl border transition-all duration-200 ${n.read ? 'bg-white border-slate-100' : 'bg-sky-50 border-sky-100'}`}
                >
                  <p className={`text-sm font-semibold ${n.read ? 'text-slate-700' : 'text-sky-800'}`}>{n.title}</p>
                  <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">{n.message}</p>
                </button>
              ))}
            </div>
          </section>
        )}

        {/* Quick Links */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 animate-fade-in" style={{ animationDelay: '200ms' }}>
          <button
            onClick={() => navigate('/scrap-day')}
            className="bg-white border border-slate-100 rounded-2xl p-4 text-left hover:shadow-md hover:border-slate-200 transition-all duration-200 active:scale-[0.98]"
          >
            <CalendarDays className="w-6 h-6 text-amber-500 mb-2" />
            <p className="font-semibold text-sm text-slate-800">Scrap Day</p>
            <p className="text-xs text-slate-400 mt-0.5">Collection drives</p>
          </button>
          <button
            onClick={() => navigate('/impact')}
            className="bg-white border border-slate-100 rounded-2xl p-4 text-left hover:shadow-md hover:border-slate-200 transition-all duration-200 active:scale-[0.98]"
          >
            <TrendingUp className="w-6 h-6 text-green-500 mb-2" />
            <p className="font-semibold text-sm text-slate-800">Impact</p>
            <p className="text-xs text-slate-400 mt-0.5">Your footprint</p>
          </button>
          <button
            onClick={() => navigate('/wishlist')}
            className="bg-white border border-slate-100 rounded-2xl p-4 text-left hover:shadow-md hover:border-slate-200 transition-all duration-200 active:scale-[0.98]"
          >
            <Heart className="w-6 h-6 text-rose-500 mb-2" />
            <p className="font-semibold text-sm text-slate-800">Wishlist</p>
            <p className="text-xs text-slate-400 mt-0.5">Auto-matching</p>
          </button>
          <button
            onClick={() => navigate('/marketplace')}
            className="bg-white border border-slate-100 rounded-2xl p-4 text-left hover:shadow-md hover:border-slate-200 transition-all duration-200 active:scale-[0.98]"
          >
            <Package className="w-6 h-6 text-emerald-600 mb-2" />
            <p className="font-semibold text-sm text-slate-800">Marketplace</p>
            <p className="text-xs text-slate-400 mt-0.5">Browse all items</p>
          </button>
        </div>

        {/* Available Items */}
        <section className="animate-fade-in" style={{ animationDelay: '250ms' }}>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Package className="w-4 h-4 text-green-600" />
              <h2 className="font-bold text-slate-800">Available Items</h2>
            </div>
            <Link to="/marketplace" className="text-green-600 text-sm font-semibold flex items-center gap-0.5">
              See all <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-3 md:gap-4.5 stagger-children">
            {items.map(item => (
              <ItemCard key={item.id} item={item} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
