import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import api from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import { ArrowLeft, Bell, Heart, CheckCircle2, Clock, CalendarDays, Package } from 'lucide-react';

const typeIcons = {
  wishlist_match: { icon: Heart, color: 'bg-rose-100 text-rose-500' },
  claim_confirmed: { icon: CheckCircle2, color: 'bg-green-100 text-green-600' },
  item_expiring: { icon: Clock, color: 'bg-amber-100 text-amber-600' },
  scrap_day: { icon: CalendarDays, color: 'bg-sky-100 text-sky-600' },
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
    <div className="min-h-dvh bg-slate-50 pb-safe">
      {/* Header */}
      <div className="bg-white border-b border-slate-100 px-5 pt-12 pb-4 sticky top-0 z-30">
        <div className="max-w-3xl mx-auto flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="p-2 -ml-2 text-slate-500 hover:text-slate-800">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="font-bold text-xl text-slate-800 flex items-center gap-2">
            <Bell className="w-5 h-5 text-sky-500" /> Notifications
          </h1>
        </div>
      </div>

      <div className="max-w-3xl mx-auto w-full px-5 pt-4 space-y-6">
        {notifications.length === 0 ? (
          <div className="text-center py-16">
            <Bell className="w-12 h-12 text-slate-200 mx-auto mb-3" />
            <p className="text-slate-400 font-medium">No notifications yet</p>
          </div>
        ) : (
          <>
            {unread.length > 0 && (
              <section>
                <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">New</h2>
                <div className="space-y-2 stagger-children">
                  {unread.map(notif => {
                    const typeInfo = typeIcons[notif.type] || { icon: Package, color: 'bg-slate-100 text-slate-500' };
                    const Icon = typeInfo.icon;
                    return (
                      <button
                        key={notif.id}
                        onClick={() => handleClick(notif)}
                        className="w-full text-left bg-white border-l-4 border-green-500 rounded-xl p-4 shadow-sm hover:shadow-md transition-all animate-fade-in"
                      >
                        <div className="flex items-start gap-3">
                          <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${typeInfo.color}`}>
                            <Icon className="w-4.5 h-4.5" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-sm text-slate-800">{notif.title}</p>
                            <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">{notif.message}</p>
                            <p className="text-[10px] text-slate-400 mt-1.5">{timeAgo(notif.createdAt)}</p>
                          </div>
                          <div className="w-2 h-2 bg-green-500 rounded-full shrink-0 mt-2" />
                        </div>
                      </button>
                    );
                  })}
                </div>
              </section>
            )}

            {read.length > 0 && (
              <section>
                <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Earlier</h2>
                <div className="space-y-2 stagger-children">
                  {read.map(notif => {
                    const typeInfo = typeIcons[notif.type] || { icon: Package, color: 'bg-slate-100 text-slate-500' };
                    const Icon = typeInfo.icon;
                    return (
                      <button
                        key={notif.id}
                        onClick={() => handleClick(notif)}
                        className="w-full text-left bg-white rounded-xl p-4 border border-slate-100 hover:shadow-sm transition-all animate-fade-in"
                      >
                        <div className="flex items-start gap-3">
                          <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${typeInfo.color} opacity-60`}>
                            <Icon className="w-4.5 h-4.5" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm text-slate-600">{notif.title}</p>
                            <p className="text-xs text-slate-400 mt-0.5 line-clamp-2">{notif.message}</p>
                            <p className="text-[10px] text-slate-400 mt-1.5">{timeAgo(notif.createdAt)}</p>
                          </div>
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
