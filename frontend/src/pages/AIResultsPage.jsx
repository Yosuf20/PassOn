import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import api, { ITEM_ICONS } from '../services/api';
import { ArrowLeft, Check, Trash2, ChevronDown, ChevronUp, Package, Sparkles, AlertCircle, Image as ImageIcon } from 'lucide-react';

const categories = ['electronics', 'books', 'home', 'appliances', 'fitness', 'furniture', 'clothing', 'paper'];

const priceTypes = [
  { value: 'free', label: 'Free', color: 'bg-green-100 text-green-700 border-green-200' },
  { value: 'price', label: 'Set Price', color: 'bg-sky-100 text-sky-700 border-sky-200' },
  { value: 'scrap', label: 'Scrap / E-Waste', color: 'bg-amber-100 text-amber-700 border-amber-200' },
];

const routes = [
  { value: 'reuse', label: '♻️ Reuse (Giveaway / Resale)', badge: 'bg-green-600 text-white' },
  { value: 'scrap', label: '📦 Scrap (Recycler drive)', badge: 'bg-amber-500 text-white' },
  { value: 'ewaste', label: '⚡ E-Waste (Safe disposal)', badge: 'bg-rose-500 text-white' },
];

const routeLabels = { reuse: '♻️ Reuse', scrap: '📦 Scrap', ewaste: '⚡ E-Waste' };
const conditionOptions = ['like_new', 'good', 'fair', 'broken'];

export default function AIResultsPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { community, user, showToast } = useApp();

  const rawAiData = location.state?.aiItems || [];
  const photoPreview = location.state?.photoPreview || null;
  const aiItems = Array.isArray(rawAiData) ? rawAiData : (rawAiData.items || []);
  const provider = rawAiData.provider || (Array.isArray(rawAiData) ? 'mock' : 'unknown');
  const isMock = rawAiData.mock ?? (provider === 'mock');

  const [items, setItems] = useState(
    aiItems.map((item, i) => ({
      ...item,
      id: `ai-${i}`,
      title: item.name || item.title || 'Identified Item',
      category: item.category || 'home',
      route: item.route || 'reuse',
      condition: item.condition || 'good',
      description: item.description || '',
      priceType: item.route === 'ewaste' || item.route === 'scrap' ? 'scrap' : 'free',
      askingPrice: item.suggestedPrice?.min || 0,
      included: true,
      expanded: i === 0,
    }))
  );
  const [publishing, setPublishing] = useState(false);

  const updateItem = (id, field, value) => {
    setItems(prev => prev.map(item =>
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  const toggleExpand = (id) => {
    setItems(prev => prev.map(item =>
      item.id === id ? { ...item, expanded: !item.expanded } : item
    ));
  };

  const removeItem = (id) => {
    setItems(prev => prev.filter(item => item.id !== id));
  };

  const handlePublish = async () => {
    const included = items.filter(i => i.included);
    if (included.length === 0) {
      showToast('error', 'Select at least one item to publish');
      return;
    }
    setPublishing(true);
    try {
      const payload = included.map(item => ({
        title: item.title,
        category: item.category,
        condition: item.condition,
        description: item.description,
        askingPrice: item.priceType === 'price' ? item.askingPrice : 0,
        priceType: item.priceType,
        route: item.route,
      }));
      await api.createItems(community.id, payload, user.id);
      showToast('success', `${included.length} item${included.length > 1 ? 's' : ''} listed!`);
      navigate('/marketplace');
    } catch (err) {
      showToast('error', 'Failed to publish items');
    } finally {
      setPublishing(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-dvh flex flex-col items-center justify-center px-6 pb-safe text-center">
        <Package className="w-16 h-16 text-slate-300 mb-4" />
        <h2 className="text-lg font-bold text-slate-700">No items identified</h2>
        <p className="text-slate-500 text-sm mt-1 mb-6 max-w-sm">
          The photo did not produce recognizable physical items. Try taking a well-lit photo of your items.
        </p>
        <button
          onClick={() => navigate('/clearing-out')}
          className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl font-semibold shadow-md transition"
        >
          Try Again
        </button>
      </div>
    );
  }

  const includedCount = items.filter(i => i.included).length;

  return (
    <div className="min-h-dvh bg-slate-50 flex flex-col pb-safe">
      {/* Top Header */}
      <div className="bg-white border-b border-slate-100 px-5 pt-10 pb-4 sticky top-0 z-30">
        <div className="flex items-center gap-3 max-w-6xl mx-auto">
          <button onClick={() => navigate(-1)} className="p-2 -ml-2 text-slate-500 hover:text-slate-800 rounded-xl transition">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex-1">
            <h1 className="font-bold text-lg text-slate-800">Review & Confirm Listings</h1>
            <p className="text-xs text-slate-500">
              {items.length} item{items.length !== 1 ? 's' : ''} identified — edit or deselect any item before publishing
            </p>
          </div>
          <div className="hidden sm:block">
            <span className="text-xs font-semibold px-2.5 py-1 bg-slate-100 text-slate-700 rounded-full">
              {includedCount} of {items.length} selected
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto w-full px-5 py-4 flex-1">
        {/* Provider Banner */}
        <div className={`mb-4 p-4 rounded-2xl border flex items-start gap-3 transition-all ${
          !isMock && provider === 'groq'
            ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
            : 'bg-amber-50 border-amber-200 text-amber-900'
        }`}>
          <div className="text-2xl shrink-0 mt-0.5">
            {!isMock && provider === 'groq' ? '⚡' : '🧪'}
          </div>
          <div className="flex-1 text-xs">
            <p className="font-bold text-sm">
              {!isMock && provider === 'groq'
                ? 'Groq Vision AI Active (Qwen 3.8 Vision)'
                : 'Demo / Mock Analysis Mode'}
            </p>
            <p className="opacity-90 mt-0.5 leading-relaxed">
              {!isMock && provider === 'groq'
                ? 'Identified items, condition assessments, and routes from your uploaded photo. You can edit every detail.'
                : 'Showing simulated items. Configure GROQ_API_KEY in backend/.env to run live multimodal vision analysis.'}
            </p>
          </div>
        </div>

        {/* Responsive Layout: Photo preview on left on desktop, editor on right */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
          {photoPreview && (
            <div className="md:col-span-4 bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-xs md:sticky md:top-28">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 mb-2">
                <ImageIcon className="w-3.5 h-3.5 text-green-600" />
                <span>Uploaded Photo</span>
              </div>
              <img
                src={photoPreview}
                alt="Source items"
                className="w-full aspect-[4/3] object-cover rounded-xl border border-slate-100"
              />
              <p className="text-[11px] text-slate-400 mt-2 text-center">
                Review items detected from this image
              </p>
            </div>
          )}

          {/* Items List & Editor */}
          <div className={`${photoPreview ? 'md:col-span-8' : 'md:col-span-12'} space-y-3.5`}>
            {items.map((item, index) => {
              const icon = ITEM_ICONS[item.category] || ITEM_ICONS.default;
              return (
                <div
                  key={item.id}
                  className={`bg-white rounded-2xl border overflow-hidden transition-all duration-200 ${
                    item.included
                      ? 'border-green-300 shadow-sm'
                      : 'border-slate-200 opacity-60 bg-slate-50/50'
                  }`}
                >
                  {/* Collapsed Header */}
                  <div className="flex items-center gap-3 p-4">
                    {/* Checkbox */}
                    <input
                      type="checkbox"
                      checked={item.included}
                      onChange={e => updateItem(item.id, 'included', e.target.checked)}
                      className="w-5 h-5 rounded-md text-green-600 focus:ring-green-500 cursor-pointer accent-green-600"
                      title="Include in listing"
                    />

                    <span className="text-2xl cursor-pointer" onClick={() => toggleExpand(item.id)}>
                      {icon}
                    </span>

                    <div className="flex-1 min-w-0 cursor-pointer" onClick={() => toggleExpand(item.id)}>
                      <p className="font-semibold text-sm text-slate-800 truncate">{item.title}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[10px] font-medium text-slate-400 capitalize">{item.category}</span>
                        <span className="text-[10px]">{routeLabels[item.route] || item.route}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {item.priceType === 'free' && (
                        <span className="text-green-600 font-bold text-sm">Free</span>
                      )}
                      {item.priceType === 'price' && (
                        <span className="text-slate-800 font-bold text-sm">₹{item.askingPrice}</span>
                      )}
                      {item.priceType === 'scrap' && (
                        <span className="text-amber-600 font-semibold text-xs">Scrap</span>
                      )}
                      <button
                        onClick={() => toggleExpand(item.id)}
                        className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
                        title={item.expanded ? 'Collapse' : 'Expand editor'}
                      >
                        {item.expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Expanded Item Editor */}
                  {item.expanded && (
                    <div className="border-t border-slate-100 px-4 pb-4 pt-3 space-y-3.5 bg-slate-50/30">
                      {/* Name */}
                      <div>
                        <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1 block">
                          Item Title
                        </label>
                        <input
                          type="text"
                          value={item.title}
                          onChange={e => updateItem(item.id, 'title', e.target.value)}
                          className="w-full px-3 py-2 rounded-lg bg-white border border-slate-200 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-green-500"
                        />
                      </div>

                      {/* Route Selection */}
                      <div>
                        <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5 block">
                          Recycling / Disposal Route
                        </label>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                          {routes.map(r => (
                            <button
                              key={r.value}
                              type="button"
                              onClick={() => {
                                updateItem(item.id, 'route', r.value);
                                if (r.value === 'ewaste' || r.value === 'scrap') {
                                  updateItem(item.id, 'priceType', 'scrap');
                                }
                              }}
                              className={`py-2 px-2.5 rounded-lg text-xs font-semibold border transition text-left ${
                                item.route === r.value
                                  ? 'bg-green-600 text-white border-green-600 shadow-xs'
                                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                              }`}
                            >
                              {r.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Category & Condition Row */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {/* Category */}
                        <div>
                          <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1 block">
                            Category
                          </label>
                          <select
                            value={item.category}
                            onChange={e => updateItem(item.id, 'category', e.target.value)}
                            className="w-full px-3 py-2 rounded-lg bg-white border border-slate-200 text-sm text-slate-800 capitalize focus:outline-none focus:ring-2 focus:ring-green-500"
                          >
                            {categories.map(c => (
                              <option key={c} value={c} className="capitalize">
                                {c}
                              </option>
                            ))}
                          </select>
                        </div>

                        {/* Condition */}
                        <div>
                          <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1 block">
                            Condition
                          </label>
                          <div className="flex gap-1.5 flex-wrap">
                            {conditionOptions.map(c => (
                              <button
                                key={c}
                                type="button"
                                onClick={() => updateItem(item.id, 'condition', c)}
                                className={`px-2.5 py-1.5 rounded-lg text-xs font-medium border transition capitalize ${
                                  item.condition === c
                                    ? 'bg-emerald-600 text-white border-emerald-600'
                                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                                }`}
                              >
                                {c.replace('_', ' ')}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Description */}
                      <div>
                        <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1 block">
                          Description
                        </label>
                        <textarea
                          value={item.description}
                          onChange={e => updateItem(item.id, 'description', e.target.value)}
                          rows={2}
                          className="w-full px-3 py-2 rounded-lg bg-white border border-slate-200 text-sm text-slate-800 resize-none focus:outline-none focus:ring-2 focus:ring-green-500"
                          placeholder="Factual notes on visible condition..."
                        />
                      </div>

                      {/* Price / Listing Type */}
                      <div>
                        <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5 block">
                          Listing Type
                        </label>
                        <div className="flex gap-2">
                          {priceTypes.map(pt => (
                            <button
                              key={pt.value}
                              type="button"
                              onClick={() => updateItem(item.id, 'priceType', pt.value)}
                              className={`flex-1 py-2 rounded-lg text-xs font-semibold border transition ${
                                item.priceType === pt.value
                                  ? `${pt.color} border-current shadow-xs`
                                  : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'
                              }`}
                            >
                              {pt.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Price input */}
                      {item.priceType === 'price' && (
                        <div>
                          <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1 block">
                            Asking Price (₹)
                            {item.suggestedPrice?.max > 0 && (
                              <span className="text-slate-400 font-normal ml-1">
                                — Suggested: ₹{item.suggestedPrice?.min}–₹{item.suggestedPrice?.max}
                              </span>
                            )}
                          </label>
                          <input
                            type="number"
                            value={item.askingPrice}
                            onChange={e => updateItem(item.id, 'askingPrice', parseInt(e.target.value) || 0)}
                            className="w-full px-3 py-2 rounded-lg bg-white border border-slate-200 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-green-500"
                            min={0}
                          />
                        </div>
                      )}

                      {/* Remove Button */}
                      <div className="flex justify-between items-center pt-2">
                        <button
                          type="button"
                          onClick={() => removeItem(item.id)}
                          className="flex items-center gap-1.5 text-xs text-rose-500 font-medium hover:text-rose-700 transition"
                        >
                          <Trash2 className="w-3.5 h-3.5" /> Remove from batch
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Sticky Publish Bar */}
      <div className="sticky bottom-0 bg-white/95 backdrop-blur-md border-t border-slate-200 px-5 py-4 shadow-lg z-30">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
          <div className="hidden sm:block text-xs text-slate-500">
            Publishing <span className="font-bold text-slate-800">{includedCount}</span> items to{' '}
            <span className="font-bold text-slate-800">{community?.name}</span>
          </div>
          <button
            onClick={handlePublish}
            disabled={publishing || includedCount === 0}
            className="w-full sm:w-auto sm:min-w-[240px] py-3.5 px-6 bg-green-600 hover:bg-green-700 active:bg-green-800 text-white font-bold text-base rounded-xl shadow-lg shadow-green-600/30 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {publishing ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <Check className="w-5 h-5" />
                Publish {includedCount} Item{includedCount !== 1 ? 's' : ''}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
