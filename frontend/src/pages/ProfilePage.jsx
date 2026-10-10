import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import api, { ITEM_ICONS } from '../services/api';
import ItemCard from '../components/ItemCard';
import LoadingSpinner from '../components/LoadingSpinner';
import {
  User,
  Users,
  Copy,
  Check,
  LogOut,
  Package,
  Heart,
  TrendingUp,
  Shield,
  ArrowRight,
  Phone,
  Mail,
  Edit2,
  CheckCircle2,
  ChevronRight,
  ExternalLink
} from 'lucide-react';

export default function ProfilePage() {
  const { user, community, logout, showToast, updateUser } = useApp();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('listings'); // 'listings' | 'claimed'
  const [myListings, setMyListings] = useState([]);
  const [myClaimed, setMyClaimed] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copiedCode, setCopiedCode] = useState(false);
  const [isEditingPhone, setIsEditingPhone] = useState(false);
  const [phoneInput, setPhoneInput] = useState(user?.phone || '+91-98765-43210');

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    loadUserData();
  }, [user, community]);

  const loadUserData = async () => {
    setLoading(true);
    try {
      const [listings, claimed] = await Promise.all([
        api.getUserItems(user.id),
        api.getUserClaimedItems(user.id),
      ]);
      setMyListings(listings);
      setMyClaimed(claimed);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyCode = () => {
    if (community?.code) {
      navigator.clipboard?.writeText(community.code);
      setCopiedCode(true);
      showToast('success', `Invite code "${community.code}" copied!`);
      setTimeout(() => setCopiedCode(false), 2000);
    }
  };

  const handleSavePhone = () => {
    updateUser({ phone: phoneInput });
    setIsEditingPhone(false);
    showToast('success', 'Phone number updated');
  };

  const handleLogout = () => {
    logout();
    showToast('info', 'Logged out successfully');
    navigate('/login');
  };

  if (loading) return <LoadingSpinner message="Loading profile..." />;

  const initials = user?.name
    ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : 'U';

  return (
    <div className="min-h-dvh bg-slate-50 pb-safe">
      {/* Header Profile Banner */}
      <div className="bg-gradient-to-br from-green-800 via-green-700 to-emerald-600 px-5 pt-12 pb-10 rounded-b-[2.5rem] relative overflow-hidden shadow-lg shadow-green-900/10">
        <div className="max-w-4xl mx-auto relative z-10">
          <div className="absolute -top-12 -right-12 w-48 h-48 bg-white/5 rounded-full blur-xl" />
          <div className="absolute bottom-0 -left-10 w-36 h-36 bg-white/5 rounded-full blur-md" />

          <div className="flex items-center gap-4 relative z-10">
            <div className="w-18 h-18 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center text-white text-2xl font-black border border-white/25 shadow-inner">
              {initials}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-black text-white truncate">{user?.name || 'Community Member'}</h1>
                <span className="bg-emerald-400/30 text-emerald-100 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-300/30">
                  Active
                </span>
              </div>
              <p className="text-green-100 text-xs truncate mt-0.5 flex items-center gap-1.5">
                <Mail className="w-3 h-3 text-green-300 shrink-0" />
                {user?.email || 'user@example.com'}
              </p>
              <div className="flex items-center gap-2 mt-1.5">
                {isEditingPhone ? (
                  <div className="flex items-center gap-1">
                    <input
                      type="text"
                      value={phoneInput}
                      onChange={(e) => setPhoneInput(e.target.value)}
                      className="text-xs px-2 py-0.5 rounded bg-white text-slate-800 font-medium w-36 focus:outline-none"
                      placeholder="+91-..."
                    />
                    <button
                      onClick={handleSavePhone}
                      className="p-1 bg-white text-green-700 rounded text-[10px] font-bold"
                    >
                      Save
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-1 text-[11px] text-green-200">
                    <Phone className="w-3 h-3 text-green-300 shrink-0" />
                    <span>{user?.phone || phoneInput || 'Add phone'}</span>
                    <button
                      onClick={() => setIsEditingPhone(true)}
                      className="p-0.5 hover:text-white"
                    >
                      <Edit2 className="w-2.5 h-2.5 ml-1" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* User stats summary */}
          <div className="grid grid-cols-3 gap-2 mt-5 relative z-10">
            <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-xl p-2.5 text-center">
              <p className="text-white font-extrabold text-base leading-none">{myListings.length}</p>
              <p className="text-green-200 text-[10px] mt-1">Listed</p>
            </div>
            <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-xl p-2.5 text-center">
              <p className="text-white font-extrabold text-base leading-none">{myClaimed.length}</p>
              <p className="text-green-200 text-[10px] mt-1">Claimed</p>
            </div>
            <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-xl p-2.5 text-center">
              <p className="text-white font-extrabold text-base leading-none">14kg</p>
              <p className="text-green-200 text-[10px] mt-1">Diverted</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto w-full px-5 space-y-5 -mt-3">
        {/* Current Community Card */}
        {community && (
          <div className="bg-white rounded-2xl p-4.5 border border-slate-100 shadow-sm animate-fade-in">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                  Current Living Space
                </span>
                <h2 className="text-base font-bold text-slate-800 mt-1.5">{community.name}</h2>
                <p className="text-xs text-slate-500 mt-0.5">{community.memberCount} active residents</p>
              </div>
              <button
                onClick={() => navigate('/join')}
                className="text-xs font-semibold text-green-700 hover:text-green-800 flex items-center gap-1 p-1 bg-green-50 hover:bg-green-100 rounded-lg transition"
              >
                <span>Switch</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between">
              <div>
                <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Invite Code</p>
                <p className="font-mono font-bold text-slate-700 text-sm tracking-wide mt-0.5">{community.code}</p>
              </div>
              <button
                onClick={handleCopyCode}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-semibold border border-slate-200 transition active:scale-95"
              >
                {copiedCode ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Copy className="w-3.5 h-3.5 text-slate-500" />}
                <span>{copiedCode ? 'Copied' : 'Share Code'}</span>
              </button>
            </div>
          </div>
        )}

        {/* Quick Hub Navigation Links */}
        <div className="grid grid-cols-2 gap-3 animate-fade-in" style={{ animationDelay: '50ms' }}>
          <button
            onClick={() => navigate('/wishlist')}
            className="bg-white border border-slate-100 rounded-2xl p-3.5 text-left shadow-sm hover:shadow-md transition flex items-center gap-3"
          >
            <div className="w-10 h-10 rounded-xl bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-500 shrink-0">
              <Heart className="w-5 h-5" />
            </div>
            <div>
              <p className="font-bold text-xs text-slate-800">My Wishlist</p>
              <p className="text-[11px] text-slate-400">Match notifications</p>
            </div>
          </button>

          <button
            onClick={() => navigate('/impact')}
            className="bg-white border border-slate-100 rounded-2xl p-3.5 text-left shadow-sm hover:shadow-md transition flex items-center gap-3"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <p className="font-bold text-xs text-slate-800">Eco Impact</p>
              <p className="text-[11px] text-slate-400">Collective savings</p>
            </div>
          </button>
        </div>

        {/* Activity Section */}
        <section className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm animate-fade-in" style={{ animationDelay: '100ms' }}>
          <div className="flex border-b border-slate-100 pb-3 gap-2">
            <button
              onClick={() => setActiveTab('listings')}
              className={`flex-1 py-1.5 text-xs font-bold rounded-xl transition ${
                activeTab === 'listings'
                  ? 'bg-green-600 text-white shadow-sm'
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
              }`}
            >
              My Listings ({myListings.length})
            </button>
            <button
              onClick={() => setActiveTab('claimed')}
              className={`flex-1 py-1.5 text-xs font-bold rounded-xl transition ${
                activeTab === 'claimed'
                  ? 'bg-green-600 text-white shadow-sm'
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
              }`}
            >
              Claimed Items ({myClaimed.length})
            </button>
          </div>

          <div className="pt-4">
            {activeTab === 'listings' && (
              myListings.length === 0 ? (
                <div className="text-center py-8">
                  <Package className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                  <p className="text-xs text-slate-500 font-medium">You haven't listed any items yet</p>
                  <button
                    onClick={() => navigate('/clearing-out')}
                    className="mt-3 px-4 py-2 bg-green-600 text-white text-xs font-bold rounded-xl hover:bg-green-700 transition"
                  >
                    Clear Out Items
                  </button>
                </div>
              ) : (
                <div className="space-y-2.5">
                  {myListings.map(item => (
                    <div
                      key={item.id}
                      onClick={() => navigate(`/item/${item.id}`)}
                      className="flex items-center justify-between p-3 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 cursor-pointer transition"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <span className="text-2xl">{ITEM_ICONS[item.category] || '📦'}</span>
                        <div className="min-w-0">
                          <p className="font-semibold text-xs text-slate-800 truncate">{item.title}</p>
                          <p className="text-[10px] text-slate-400 capitalize">{item.category} • {item.priceType === 'free' ? 'Free' : `₹${item.askingPrice}`}</p>
                        </div>
                      </div>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        item.status === 'claimed' ? 'bg-slate-200 text-slate-600' : 'bg-green-100 text-green-700'
                      }`}>
                        {item.status === 'claimed' ? 'Claimed' : 'Active'}
                      </span>
                    </div>
                  ))}
                </div>
              )
            )}

            {activeTab === 'claimed' && (
              myClaimed.length === 0 ? (
                <div className="text-center py-8">
                  <CheckCircle2 className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                  <p className="text-xs text-slate-500 font-medium">You haven't claimed any items yet</p>
                  <button
                    onClick={() => navigate('/marketplace')}
                    className="mt-3 px-4 py-2 bg-green-600 text-white text-xs font-bold rounded-xl hover:bg-green-700 transition"
                  >
                    Browse Available Goods
                  </button>
                </div>
              ) : (
                <div className="space-y-2.5">
                  {myClaimed.map(item => (
                    <div
                      key={item.id}
                      onClick={() => navigate(`/item/${item.id}`)}
                      className="flex items-center justify-between p-3 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 cursor-pointer transition"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <span className="text-2xl">{ITEM_ICONS[item.category] || '📦'}</span>
                        <div className="min-w-0">
                          <p className="font-semibold text-xs text-slate-800 truncate">{item.title}</p>
                          <p className="text-[10px] text-slate-400 capitalize">{item.category} • Claimed</p>
                        </div>
                      </div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700">
                        Claimed
                      </span>
                    </div>
                  ))}
                </div>
              )
            )}
          </div>
        </section>

        {/* Member Badge & Trust */}
        <div className="bg-slate-100/70 rounded-2xl p-3.5 flex items-center gap-3 border border-slate-200/60">
          <div className="w-9 h-9 rounded-xl bg-green-100 text-green-700 flex items-center justify-center shrink-0">
            <Shield className="w-5 h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-bold text-xs text-slate-700">Verified Resident Member</p>
            <p className="text-[10px] text-slate-500 mt-0.5">Contact info is only shared with verified neighbours upon claiming.</p>
          </div>
        </div>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 py-3.5 px-4 bg-rose-50 text-rose-600 rounded-2xl font-bold text-xs hover:bg-rose-100 transition active:scale-98 border border-rose-100"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out of PassOn</span>
        </button>
      </div>
    </div>
  );
}
