import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import api, { ITEM_ICONS } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import { ArrowLeft, Clock, Tag, AlertTriangle, CheckCircle2, Phone, MessageSquare, Share2, ShieldCheck } from 'lucide-react';

const conditionLabels = { like_new: 'Like New', good: 'Good', fair: 'Fair', broken: 'Broken', na: 'N/A' };
const conditionColors = {
  like_new: 'bg-emerald-100 text-emerald-700',
  good: 'bg-green-100 text-green-700',
  fair: 'bg-amber-100 text-amber-700',
  broken: 'bg-rose-100 text-rose-600',
  na: 'bg-slate-100 text-slate-500'
};

export default function ItemDetailPage() {
  const { itemId } = useParams();
  const navigate = useNavigate();
  const { user, showToast } = useApp();
  const [item, setItem] = useState(null);
  const [poster, setPoster] = useState(null);
  const [loading, setLoading] = useState(true);
  const [claiming, setClaiming] = useState(false);
  const [claimed, setClaimed] = useState(false);
  const [contactInfo, setContactInfo] = useState(null);

  useEffect(() => {
    loadItem();
  }, [itemId]);

  const loadItem = async () => {
    setLoading(true);
    try {
      const data = await api.getItem(itemId);
      setItem(data);
      if (data) {
        setPoster(api.getUser(data.postedBy));
        if (data.status === 'claimed' && data.claimedBy === user?.id) {
          setClaimed(true);
          setContactInfo(api.getUser(data.postedBy));
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleClaim = async () => {
    if (!item) return;
    setClaiming(true);
    try {
      const result = await api.claimItem(item.id, user.id);
      setClaimed(true);
      setContactInfo(result.contact);
      setItem(prev => ({ ...prev, status: 'claimed', claimedBy: user.id }));
      showToast('success', 'Item claimed! Contact info revealed.');
    } catch (err) {
      showToast('error', err.message || 'Failed to claim');
    } finally {
      setClaiming(false);
    }
  };

  if (loading) return <LoadingSpinner message="Loading item details..." />;

  if (!item) return (
    <div className="min-h-dvh flex flex-col items-center justify-center px-6">
      <p className="text-slate-500 font-medium">Item not found</p>
      <button onClick={() => navigate(-1)} className="mt-4 px-4 py-2 bg-green-600 text-white rounded-xl font-semibold">
        Go Back
      </button>
    </div>
  );

  const icon = ITEM_ICONS[item.category] || ITEM_ICONS.default;
  const isOwner = item.postedBy === user?.id;
  const isClaimed = item.status === 'claimed';
  const daysLeft = Math.max(0, Math.ceil((new Date(item.expiresAt) - new Date()) / (1000 * 60 * 60 * 24)));

  return (
    <div className="min-h-dvh bg-slate-50 pb-safe">
      {/* Top back bar for desktop */}
      <div className="max-w-5xl mx-auto px-5 pt-6 pb-2 flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Marketplace</span>
        </button>
      </div>

      <div className="max-w-5xl mx-auto px-5 py-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
          {/* Left Column: Photo / Visual card */}
          <div className="md:col-span-5 bg-white rounded-3xl border border-slate-200/80 overflow-hidden shadow-xs relative">
            <div className="relative bg-gradient-to-br from-slate-100 to-slate-50 aspect-square flex items-center justify-center">
              <span className="text-8xl sm:text-9xl transition-transform hover:scale-105 duration-300">
                {icon}
              </span>

              {/* Route badge */}
              <div className="absolute top-4 right-4">
                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-xs ${
                  item.route === 'reuse'
                    ? 'bg-green-600 text-white'
                    : item.route === 'ewaste'
                      ? 'bg-rose-500 text-white'
                      : 'bg-amber-500 text-white'
                }`}>
                  {item.route === 'ewaste' ? 'E-Waste' : item.route}
                </span>
              </div>

              {/* Status Overlay */}
              {isClaimed && !claimed && (
                <div className="absolute inset-0 bg-black/45 backdrop-blur-[2px] flex items-center justify-center">
                  <div className="bg-white px-5 py-2.5 rounded-2xl shadow-xl text-center">
                    <p className="font-extrabold text-slate-800 text-base">Claimed</p>
                    <p className="text-[11px] text-slate-500">Reserved by a neighbour</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Information, Seller info, Claim Action */}
          <div className="md:col-span-7 space-y-4">
            <div className="bg-white rounded-3xl shadow-xs border border-slate-200/80 p-6 space-y-5">
              {/* Header Title & Price */}
              <div>
                <h1 className="text-2xl font-bold text-slate-800 leading-snug">{item.title}</h1>
                <div className="flex items-center gap-3 mt-2.5">
                  {item.priceType === 'free' ? (
                    <span className="text-green-600 font-extrabold text-3xl">Free</span>
                  ) : item.priceType === 'scrap' ? (
                    <span className="text-amber-600 font-bold text-xl">Scrap / Recycler</span>
                  ) : (
                    <span className="text-slate-800 font-extrabold text-3xl">₹{item.askingPrice}</span>
                  )}

                  {item.priceType === 'price' && item.suggestedPrice && (
                    <span className="text-xs text-slate-400 font-medium">
                      Suggested range: ₹{item.suggestedPrice.min}–₹{item.suggestedPrice.max}
                    </span>
                  )}
                </div>
              </div>

              {/* Badges */}
              <div className="flex flex-wrap gap-2">
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${conditionColors[item.condition] || conditionColors.na}`}>
                  {conditionLabels[item.condition] || item.condition}
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-600 capitalize flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5" /> {item.category}
                </span>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 ${daysLeft <= 2 ? 'bg-rose-100 text-rose-600' : 'bg-slate-100 text-slate-500'}`}>
                  <Clock className="w-3.5 h-3.5" /> {daysLeft}d remaining
                </span>
              </div>

              {/* Description */}
              <div>
                <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Item Description</h3>
                <p className="text-sm text-slate-700 leading-relaxed bg-slate-50/70 p-3.5 rounded-2xl border border-slate-100">
                  {item.description || 'No additional description provided.'}
                </p>
              </div>

              {/* Posted by User */}
              {poster && (
                <div className="flex items-center gap-3 bg-slate-50 rounded-2xl p-3.5 border border-slate-100">
                  <div className="w-10 h-10 bg-green-600 text-white rounded-xl flex items-center justify-center font-bold text-sm shadow-xs">
                    {poster.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-800">{poster.name}</p>
                    <p className="text-xs text-slate-400">Community Member • Posted {new Date(item.postedAt).toLocaleDateString()}</p>
                  </div>
                  <span className="text-xs text-emerald-600 font-medium bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                    Verified
                  </span>
                </div>
              )}

              {/* Expiry Warning */}
              {daysLeft <= 2 && daysLeft > 0 && (
                <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3.5 flex items-start gap-2.5">
                  <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
                  <p className="text-xs text-amber-800">
                    This item expires in {daysLeft} day{daysLeft !== 1 ? 's' : ''}. Unclaimed items may be routed to Scrap Day.
                  </p>
                </div>
              )}

              {/* Contact Info (Displayed if user claimed it) */}
              {claimed && contactInfo && (
                <div className="bg-green-50 border border-green-200 rounded-2xl p-5 space-y-3 animate-fade-in">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                    <h3 className="font-bold text-green-800">Item Successfully Claimed!</h3>
                  </div>
                  <p className="text-xs text-green-700">Contact the resident to coordinate pickup within your community:</p>
                  <div className="space-y-2 pt-1">
                    <div className="flex items-center gap-3 bg-white rounded-xl p-3 border border-green-100">
                      <Phone className="w-4 h-4 text-green-600" />
                      <span className="text-sm font-medium text-slate-800">{contactInfo.phone || 'Phone shared via app'}</span>
                    </div>
                    <div className="flex items-center gap-3 bg-white rounded-xl p-3 border border-green-100">
                      <MessageSquare className="w-4 h-4 text-green-600" />
                      <span className="text-sm font-medium text-slate-800">{contactInfo.email}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="pt-2">
                {!isOwner && !isClaimed && (
                  <button
                    onClick={handleClaim}
                    disabled={claiming}
                    className="w-full py-4 bg-green-600 hover:bg-green-700 active:bg-green-800 text-white font-bold text-base rounded-2xl shadow-lg shadow-green-600/30 transition-all flex items-center justify-center gap-2 disabled:opacity-60"
                  >
                    {claiming ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        <CheckCircle2 className="w-5 h-5" />
                        {item.priceType === 'free'
                          ? 'Claim for Free'
                          : item.priceType === 'scrap'
                            ? 'Claim for Scrap'
                            : `Claim for ₹${item.askingPrice}`}
                      </>
                    )}
                  </button>
                )}

                {!isOwner && isClaimed && !claimed && (
                  <div className="bg-slate-100 border border-slate-200 rounded-2xl p-4 text-center">
                    <p className="text-sm text-slate-700 font-semibold">This item has already been claimed</p>
                    <p className="text-xs text-slate-500 mt-0.5">Another community resident claimed this item in this session.</p>
                  </div>
                )}

                {isOwner && (
                  <div className="bg-sky-50 border border-sky-200 rounded-2xl p-3.5 text-center">
                    <p className="text-sm text-sky-800 font-medium">This is your listing</p>
                    <p className="text-xs text-sky-600 mt-0.5">Other residents in {user?.communityId || 'your circle'} can claim it.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
