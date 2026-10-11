import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import api, { ITEM_ICONS } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import {
  Copy,
  Check,
  LogOut,
  Package,
  Heart,
  TrendingUp,
  Shield,
  Phone,
  Mail,
  Edit2,
  CheckCircle2,
  ChevronRight,
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
    <div className="min-h-dvh bg-white text-gray-900 pb-safe">
      <div className="px-5 sm:px-8 pt-6 pb-4 space-y-6">
        {/* Flat Hero Profile Banner */}
        <div className="bg-blue-500 rounded-2xl p-6 sm:p-8 text-white relative overflow-hidden">
          <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-white/10 pointer-events-none" />
          <div className="absolute bottom-0 -left-10 w-36 h-36 rounded-2xl bg-white/10 pointer-events-none rotate-12" />

          <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-18 h-18 bg-white text-blue-600 rounded-2xl font-black text-2xl flex items-center justify-center shrink-0">
                {initials}
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h1 className="font-extrabold text-2xl sm:text-3xl truncate">
                    {user?.name || 'Community Resident'}
                  </h1>
                  <span className="text-[10px] font-extrabold uppercase bg-white/20 text-white px-2 py-0.5 rounded-md">
                    Verified
                  </span>
                </div>
                <p className="text-blue-100 text-xs flex items-center gap-1.5 mt-1 font-medium">
                  <Mail className="w-3.5 h-3.5" />
                  <span>{user?.email || 'user@example.com'}</span>
                </p>
                <div className="flex items-center gap-2 mt-1 text-xs text-blue-100 font-medium">
                  <Phone className="w-3.5 h-3.5" />
                  {isEditingPhone ? (
                    <div className="flex items-center gap-1">
                      <input
                        type="text"
                        value={phoneInput}
                        onChange={(e) => setPhoneInput(e.target.value)}
                        className="px-2 py-0.5 rounded bg-white text-gray-900 font-semibold text-xs w-36 outline-none"
                        placeholder="+91-..."
                      />
                      <button
                        onClick={handleSavePhone}
                        className="px-2 py-0.5 bg-white text-blue-700 rounded font-bold text-xs"
                      >
                        Save
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1.5">
                      <span>{user?.phone || phoneInput || 'Add phone'}</span>
                      <button
                        onClick={() => setIsEditingPhone(true)}
                        className="hover:text-white"
                        title="Edit phone"
                      >
                        <Edit2 className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* User Stats Card */}
            <div className="grid grid-cols-3 gap-2 font-bold text-center">
              <div className="bg-white text-gray-900 rounded-xl p-3">
                <p className="text-2xl font-extrabold text-blue-600">{myListings.length}</p>
                <p className="text-[10px] text-gray-500 uppercase mt-0.5">Listed</p>
              </div>
              <div className="bg-white text-gray-900 rounded-xl p-3">
                <p className="text-2xl font-extrabold text-emerald-600">{myClaimed.length}</p>
                <p className="text-[10px] text-gray-500 uppercase mt-0.5">Claimed</p>
              </div>
              <div className="bg-white text-gray-900 rounded-xl p-3">
                <p className="text-2xl font-extrabold text-amber-600">14kg</p>
                <p className="text-[10px] text-gray-500 uppercase mt-0.5">Diverted</p>
              </div>
            </div>
          </div>
        </div>

        {/* Current Living Circle Card */}
        {community && (
          <div className="bg-gray-100 rounded-2xl p-6">
            <div className="flex items-start justify-between border-b border-gray-200 pb-4 mb-4">
              <div>
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-blue-600">
                  Primary Community Circle
                </span>
                <h2 className="font-extrabold text-xl text-gray-900 mt-0.5">{community.name}</h2>
                <p className="text-xs text-gray-500 font-medium mt-0.5">
                  {community.memberCount} active households sharing surplus
                </p>
              </div>
              <button
                onClick={() => navigate('/join')}
                className="px-3.5 py-1.5 rounded-lg bg-white hover:bg-gray-200 text-xs font-bold text-gray-800 transition flex items-center gap-1"
              >
                <span>Switch Circle</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="flex items-center justify-between pt-1">
              <div>
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block">
                  Community Invite Code
                </span>
                <span className="font-extrabold text-base text-gray-900 tracking-wider">
                  {community.code}
                </span>
              </div>
              <button
                onClick={handleCopyCode}
                className="px-4 py-2 bg-blue-500 hover:bg-blue-600 active:scale-95 text-white text-xs font-bold rounded-lg transition-transform hover:scale-105 flex items-center gap-1.5"
              >
                {copiedCode ? <Check className="w-4 h-4 text-white" /> : <Copy className="w-4 h-4" />}
                <span>{copiedCode ? 'Copied' : 'Share Code'}</span>
              </button>
            </div>
          </div>
        )}

        {/* Quick Hub Navigation Cards */}
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => navigate('/wishlist')}
            className="bg-gray-100 hover:bg-rose-50/70 rounded-2xl p-5 transition-all duration-200 hover:scale-[1.02] flex items-center gap-3.5 text-left cursor-pointer"
          >
            <div className="w-12 h-12 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
              <Heart className="w-6 h-6" strokeWidth={2.5} />
            </div>
            <div>
              <p className="font-extrabold text-sm text-gray-900">Wanted Wishlist</p>
              <p className="text-xs text-gray-500 font-medium">Automatic alerts</p>
            </div>
          </button>

          <button
            onClick={() => navigate('/impact')}
            className="bg-gray-100 hover:bg-emerald-50/70 rounded-2xl p-5 transition-all duration-200 hover:scale-[1.02] flex items-center gap-3.5 text-left cursor-pointer"
          >
            <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
              <TrendingUp className="w-6 h-6" strokeWidth={2.5} />
            </div>
            <div>
              <p className="font-extrabold text-sm text-gray-900">Eco Impact</p>
              <p className="text-xs text-gray-500 font-medium">Collective savings</p>
            </div>
          </button>
        </div>

        {/* Activity Tab Section */}
        <section className="bg-gray-100 rounded-2xl p-6">
          <div className="grid grid-cols-2 p-1 bg-gray-200 rounded-xl mb-5 font-bold text-xs gap-1">
            <button
              onClick={() => setActiveTab('listings')}
              className={`py-2.5 px-3 rounded-lg transition-all ${
                activeTab === 'listings'
                  ? 'bg-blue-500 text-white'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              My Listings ({myListings.length})
            </button>
            <button
              onClick={() => setActiveTab('claimed')}
              className={`py-2.5 px-3 rounded-lg transition-all ${
                activeTab === 'claimed'
                  ? 'bg-blue-500 text-white'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Claimed Items ({myClaimed.length})
            </button>
          </div>

          <div>
            {activeTab === 'listings' && (
              myListings.length === 0 ? (
                <div className="text-center py-10 text-xs text-gray-500 font-medium">
                  <Package className="w-10 h-10 text-gray-400 mx-auto mb-2" strokeWidth={2} />
                  <p>You haven't listed any items yet</p>
                  <button
                    onClick={() => navigate('/clearing-out')}
                    className="mt-3 px-4 py-2 bg-blue-500 text-white font-bold text-xs rounded-lg hover:bg-blue-600 transition"
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
                      className="flex items-center justify-between p-3.5 bg-white rounded-xl hover:bg-blue-50/50 cursor-pointer transition"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        {item.imageUrl || item.photo ? (
                          <img
                            src={item.imageUrl || item.photo}
                            alt={item.title}
                            className="w-10 h-10 rounded-lg object-cover shrink-0"
                          />
                        ) : (
                          <span className="text-2xl">{ITEM_ICONS[item.category] || '📦'}</span>
                        )}
                        <div className="min-w-0">
                          <p className="font-bold text-sm text-gray-900 truncate">{item.title}</p>
                          <p className="text-xs text-gray-500 capitalize">
                            {item.category} • {item.priceType === 'free' ? 'Free' : `₹${item.askingPrice}`}
                          </p>
                        </div>
                      </div>
                      <span className={`text-xs font-bold uppercase px-2.5 py-1 rounded-md ${
                        item.status === 'claimed'
                          ? 'bg-gray-200 text-gray-700'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}>
                        {item.status}
                      </span>
                    </div>
                  ))}
                </div>
              )
            )}

            {activeTab === 'claimed' && (
              myClaimed.length === 0 ? (
                <div className="text-center py-10 text-xs text-gray-500 font-medium">
                  <CheckCircle2 className="w-10 h-10 text-gray-400 mx-auto mb-2" strokeWidth={2} />
                  <p>You haven't claimed any items yet</p>
                  <button
                    onClick={() => navigate('/marketplace')}
                    className="mt-3 px-4 py-2 bg-blue-500 text-white font-bold text-xs rounded-lg hover:bg-blue-600 transition"
                  >
                    Browse Community Goods
                  </button>
                </div>
              ) : (
                <div className="space-y-2.5">
                  {myClaimed.map(item => (
                    <div
                      key={item.id}
                      onClick={() => navigate(`/item/${item.id}`)}
                      className="flex items-center justify-between p-3.5 bg-white rounded-xl hover:bg-blue-50/50 cursor-pointer transition"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        {item.imageUrl || item.photo ? (
                          <img
                            src={item.imageUrl || item.photo}
                            alt={item.title}
                            className="w-10 h-10 rounded-lg object-cover shrink-0"
                          />
                        ) : (
                          <span className="text-2xl">{ITEM_ICONS[item.category] || '📦'}</span>
                        )}
                        <div className="min-w-0">
                          <p className="font-bold text-sm text-gray-900 truncate">{item.title}</p>
                          <p className="text-xs text-gray-500 capitalize">
                            {item.category} • Claimed
                          </p>
                        </div>
                      </div>
                      <span className="text-xs font-bold uppercase px-2.5 py-1 rounded-md bg-emerald-100 text-emerald-800">
                        Reserved
                      </span>
                    </div>
                  ))}
                </div>
              )
            )}
          </div>
        </section>

        {/* Verification Trust Box */}
        <div className="bg-gray-100 rounded-2xl p-4.5 flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
            <Shield className="w-5 h-5" strokeWidth={2.5} />
          </div>
          <div>
            <p className="font-bold text-sm text-gray-900">Verified Residence Membership</p>
            <p className="text-xs text-gray-500 font-medium mt-0.5">
              Contact info is shared only with verified neighbours inside your circle upon claiming.
            </p>
          </div>
        </div>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="w-full py-4 bg-rose-50 hover:bg-rose-500 text-rose-600 hover:text-white font-bold text-sm rounded-xl transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out of PassOn</span>
        </button>
      </div>
    </div>
  );
}
