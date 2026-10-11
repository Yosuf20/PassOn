import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import api from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import { ArrowLeft, Bell, Heart, CheckCircle2, Clock, CalendarDays, Package } from 'lucide-react';

const typeIcons = {
  wishlist_match: { icon: Heart, color: 'bg-rose-100 text-rose-600' },
  claim_confirmed: { icon: CheckCircle2, color: 'bg-emerald-100 text-emerald-600' },
  item_expiring: { icon: Clock, color: 'bg-amber-100 text-amber-600' },
  scrap_day: { icon: CalendarDays, color: 'bg-blue-100 text-blue-600' },
};

export default function NotificationsPage() {
  const { user } = useApp();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    setLoading(true);
    try {
      const data = await api.getNotifications(user.id);
      setNotifications(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleClick = async (notif) => {
    if (!notif.read) {
      await api.markNotificationRead(notif.id);
      setNotifications(prev => prev.map(n => n.id === notif.id ? { ...n, read: true } : n));
    }
    if (notif.itemId) navigate(`/item/${notif.itemId}`);
    else if (notif.type === 'scrap_day') navigate('/scrap-day');
  };

  const timeAgo = (dateStr) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const hrs = Math.floor(diff / (1000 * 60 * 60));
    if (hrs < 1) return 'Just now';
    if (hrs < 24) return `${hrs}h ago`;
    return `${Math.floor(hrs / 24)}d ago`;
  };

  if (loading) return <LoadingSpinner message="Loading notifications..." />;

  const unread = notifications.filter(n => !n.read);
  const read = notifications.filter(n => n.read);

  return (
    <div className="min-h-dvh bg-white text-gray-900 pb-safe">
      {/* Header */}
      <div className="border-b-2 border-gray-100 px-5 sm:px-8 pt-6 pb-4 bg-white sticky top-0 z-30">
        <div className="max-w-3xl mx-auto flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 transition"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <h1 className="font-extrabold text-2xl sm:text-3xl text-gray-900 tracking-tight flex items-center gap-2">
            <Bell className="w-6 h-6 text-blue-500" strokeWidth={2.5} />
            <span>Community Bulletins</span>
          </h1>
        </div>
      </div>

      <div className="max-w-3xl mx-auto w-full px-5 sm:px-8 py-6 space-y-6">
        {notifications.length === 0 ? (
          <div className="bg-gray-100 rounded-2xl p-12 text-center">
            <Bell className="w-12 h-12 text-gray-400 mx-auto mb-2" strokeWidth={2} />
            <p className="font-bold text-lg text-gray-900">No Bulletins on file</p>
            <p className="text-xs text-gray-500 mt-1 font-medium">
              You will receive notifications when goods matching your wishlist are posted or claims are made.
            </p>
          </div>
        ) : (
          <>
            {unread.length > 0 && (
              <section>
                <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2.5">
                  New Alerts ({unread.length})
                </h2>
                <div className="space-y-2.5">
                  {unread.map(notif => {
                    const typeInfo = typeIcons[notif.type] || { icon: Package, color: 'bg-blue-100 text-blue-600' };
                    const Icon = typeInfo.icon;
                    return (
                      <button
                        key={notif.id}
                        onClick={() => handleClick(notif)}
                        className="w-full text-left bg-blue-50/70 border-l-4 border-l-blue-500 rounded-xl p-4 hover:bg-blue-100/60 transition flex items-start gap-3.5 cursor-pointer"
                      >
                        <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${typeInfo.color}`}>
                          <Icon className="w-5 h-5" strokeWidth={2.5} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between text-xs">
                            <p className="font-bold text-gray-900">{notif.title}</p>
                            <span className="text-[11px] text-gray-400 font-semibold">{timeAgo(notif.createdAt)}</span>
                          </div>
                          <p className="text-xs text-gray-600 mt-1 leading-relaxed font-medium">
                            {notif.message}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </section>
            )}

            {read.length > 0 && (
              <section>
                <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2.5">
                  Earlier
                </h2>
                <div className="space-y-2.5">
                  {read.map(notif => {
                    const typeInfo = typeIcons[notif.type] || { icon: Package, color: 'bg-gray-200 text-gray-600' };
                    const Icon = typeInfo.icon;
                    return (
                      <button
                        key={notif.id}
                        onClick={() => handleClick(notif)}
                        className="w-full text-left bg-gray-100 rounded-xl p-4 hover:bg-gray-200/60 transition flex items-start gap-3 cursor-pointer"
                      >
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${typeInfo.color}`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between text-xs">
                            <p className="font-bold text-gray-700">{notif.title}</p>
                            <span className="text-[11px] text-gray-400">{timeAgo(notif.createdAt)}</span>
                          </div>
                          <p className="text-xs text-gray-500 mt-0.5 line-clamp-1 font-medium">
                            {notif.message}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </section>
            )}
          </>
        )}
      </div>
    </div>
  );
}
