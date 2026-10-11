import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import api, { ITEM_ICONS } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import { ArrowLeft, Clock, Tag, AlertTriangle, CheckCircle2, Phone, MessageSquare } from 'lucide-react';

const conditionLabels = {
  like_new: 'Like New',
  good: 'Good Condition',
  fair: 'Fair / Usable',
  broken: 'Broken / For Parts',
  na: 'Unspecified'
};

const conditionColors = {
  like_new: 'bg-emerald-100 text-emerald-800',
  good: 'bg-blue-100 text-blue-800',
  fair: 'bg-amber-100 text-amber-800',
  broken: 'bg-rose-100 text-rose-800',
  na: 'bg-gray-200 text-gray-700'
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
    <div className="min-h-dvh flex flex-col items-center justify-center px-6 bg-white">
      <div className="bg-gray-100 p-8 rounded-2xl text-center max-w-sm">
        <p className="font-bold text-xl text-gray-900">Item Not Found</p>
        <p className="text-sm text-gray-500 mt-2 font-medium">This item may have expired or been removed.</p>
        <button
          onClick={() => navigate(-1)}
          className="mt-5 px-5 py-2.5 bg-blue-500 text-white font-bold text-xs rounded-lg hover:bg-blue-600 transition"
        >
          Return to Marketplace
        </button>
      </div>
    </div>
  );

  const icon = ITEM_ICONS[item.category] || ITEM_ICONS.default;
  const isOwner = item.postedBy === user?.id;
  const isClaimed = item.status === 'claimed';
  const daysLeft = Math.max(0, Math.ceil((new Date(item.expiresAt) - new Date()) / (1000 * 60 * 60 * 24)));

  return (
    <div className="min-h-dvh bg-white text-gray-900 pb-safe">
      {/* Top back bar */}
      <div className="max-w-7xl mx-auto px-5 sm:px-8 pt-6 pb-2 flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-xs font-bold text-gray-800 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Marketplace</span>
        </button>
      </div>

      <div className="max-w-7xl mx-auto px-5 sm:px-8 py-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          {/* Left Column: Visual Icon / Illustration Block */}
          <div className="md:col-span-5 bg-gray-100 rounded-2xl overflow-hidden relative">
            <div className="relative aspect-square flex items-center justify-center">
              <span className="text-9xl transition-transform hover:scale-105 duration-200">
                {icon}
              </span>

              {/* Route badge */}
              <div className="absolute top-4 left-4">
                <span className={`px-3 py-1 rounded-md text-xs font-bold uppercase tracking-wider ${
                  item.route === 'reuse'
                    ? 'bg-emerald-500 text-white'
                    : item.route === 'ewaste'
                      ? 'bg-rose-500 text-white'
                      : 'bg-amber-500 text-white'
                }`}>
                  {item.route === 'ewaste' ? 'E-Waste' : item.route}
                </span>
              </div>

              {/* Status Overlay */}
              {isClaimed && !claimed && (
                <div className="absolute inset-0 bg-gray-900/60 flex items-center justify-center">
                  <div className="bg-white px-6 py-3 rounded-xl text-center">
                    <p className="font-extrabold text-gray-900 text-base uppercase">Claimed</p>
                    <p className="text-xs text-gray-500 mt-0.5">Reserved by a neighbour</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Details, Seller, Action */}
          <div className="md:col-span-7 bg-gray-100 rounded-2xl p-6 sm:p-8 space-y-6">
            {/* Title & Price Header */}
            <div>
              <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">
                Category: {item.category}
              </div>
              <h1 className="font-extrabold text-3xl sm:text-4xl text-gray-900 tracking-tight leading-tight">
                {item.title}
              </h1>

              <div className="flex items-baseline gap-4 mt-3">
                {item.priceType === 'free' ? (
                  <span className="font-extrabold text-3xl text-emerald-600">
                    Free
                  </span>
                ) : item.priceType === 'scrap' ? (
                  <span className="font-extrabold text-2xl text-amber-600">
                    Scrap / Recycle
                  </span>
                ) : (
                  <span className="font-extrabold text-3xl text-blue-600">
                    ₹{item.askingPrice}
                  </span>
                )}

                {item.priceType === 'price' && item.suggestedPrice && (
                  <span className="text-xs font-medium text-gray-500">
                    Suggested range: ₹{item.suggestedPrice.min}–₹{item.suggestedPrice.max}
                  </span>
                )}
              </div>
            </div>

            {/* Badges */}
            <div className="flex flex-wrap gap-2 text-xs">
              <span className={`px-3 py-1 rounded-md font-bold ${conditionColors[item.condition] || conditionColors.na}`}>
                {conditionLabels[item.condition] || item.condition}
              </span>
              <span className="px-3 py-1 rounded-md font-bold bg-white text-gray-700 capitalize flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5" /> {item.category}
              </span>
              <span className={`px-3 py-1 rounded-md font-bold flex items-center gap-1.5 ${
                daysLeft <= 2
                  ? 'bg-rose-100 text-rose-700'
                  : 'bg-white text-gray-700'
              }`}>
                <Clock className="w-3.5 h-3.5" /> {daysLeft}d remaining
              </span>
            </div>

            {/* Description */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
                Item Description
              </h3>
              <p className="text-sm text-gray-800 leading-relaxed bg-white p-4 rounded-xl font-medium">
                {item.description || 'No additional description provided.'}
              </p>
            </div>

            {/* Posted By User */}
            {poster && (
              <div className="bg-white rounded-xl p-4 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-500 text-white font-extrabold text-sm flex items-center justify-center">
                    {poster.avatar}
                  </div>
                  <div>
                    <p className="font-bold text-sm text-gray-900">{poster.name}</p>
                    <p className="text-xs text-gray-500">Community Member • Posted {new Date(item.postedAt).toLocaleDateString()}</p>
                  </div>
                </div>
                <span className="text-xs font-bold bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded-md">
                  Verified
                </span>
              </div>
            )}

            {/* Expiry Warning */}
            {daysLeft <= 2 && daysLeft > 0 && (
              <div className="bg-amber-100 rounded-xl p-3.5 flex items-start gap-2.5 text-xs text-amber-900 font-semibold">
                <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
                <span>
                  This item expires in {daysLeft} day{daysLeft !== 1 ? 's' : ''}. Unclaimed goods are routed to Scrap Day.
                </span>
              </div>
            )}

            {/* Contact Info (Revealed on claim) */}
            {claimed && contactInfo && (
              <div className="bg-emerald-50 rounded-xl p-5 space-y-3 animate-fade-in">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  <h3 className="font-extrabold text-emerald-900 text-base">
                    Item Successfully Claimed!
                  </h3>
                </div>
                <p className="text-xs text-emerald-700 font-medium">
                  Coordinate pickup directly within your residence facility:
                </p>
                <div className="space-y-2 pt-1">
                  <div className="flex items-center gap-3 bg-white rounded-lg p-3">
                    <Phone className="w-4 h-4 text-emerald-600" />
                    <span className="text-sm font-bold text-gray-900">{contactInfo.phone || 'Phone verified via app'}</span>
                  </div>
                  <div className="flex items-center gap-3 bg-white rounded-lg p-3">
                    <MessageSquare className="w-4 h-4 text-emerald-600" />
                    <span className="text-sm font-bold text-gray-900">{contactInfo.email}</span>
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
                  className="w-full py-4 bg-blue-500 hover:bg-blue-600 active:scale-95 text-white font-bold text-base rounded-xl transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer hover:scale-105 disabled:opacity-60"
                >
                  {claiming ? (
                    <span>Claiming...</span>
                  ) : (
                    <>
                      <CheckCircle2 className="w-5 h-5" />
                      <span>
                        {item.priceType === 'free'
                          ? 'Claim for Free'
                          : item.priceType === 'scrap'
                            ? 'Claim for Scrap'
                            : `Claim for ₹${item.askingPrice}`}
                      </span>
                    </>
                  )}
                </button>
              )}

              {!isOwner && isClaimed && !claimed && (
                <div className="bg-gray-200/80 rounded-xl p-4 text-center">
                  <p className="text-sm font-bold text-gray-800">This item has been claimed</p>
                  <p className="text-xs text-gray-500 mt-0.5 font-medium">Another community resident claimed this item in this session.</p>
                </div>
              )}

              {isOwner && (
                <div className="bg-blue-50 rounded-xl p-4 text-center">
                  <p className="text-sm font-bold text-blue-900">This is your listing</p>
                  <p className="text-xs text-blue-700 mt-0.5 font-medium">Other residents in your circle can view and claim it.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
