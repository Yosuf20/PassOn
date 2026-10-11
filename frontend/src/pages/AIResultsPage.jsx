import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import api, { ITEM_ICONS } from '../services/api';
import { ArrowLeft, Check, Trash2, ChevronDown, ChevronUp, Package, Sparkles, Image as ImageIcon } from 'lucide-react';

const categories = ['electronics', 'books', 'home', 'appliances', 'fitness', 'furniture', 'clothing', 'paper', 'stationary'];

const priceTypes = [
  { value: 'free', label: 'Free Giveaway' },
  { value: 'price', label: 'Set Price' },
  { value: 'scrap', label: 'Scrap Recycle' },
];

const routes = [
  { value: 'reuse', label: 'Reuse (Giveaway / Sale)' },
  { value: 'scrap', label: 'Scrap (Collector Drive)' },
  { value: 'ewaste', label: 'E-Waste (Safe Disposal)' },
];

const routeLabels = { reuse: 'Reuse', scrap: 'Scrap', ewaste: 'E-Waste' };
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
        photo: photoPreview || item.photo || null,
        imageUrl: photoPreview || item.imageUrl || null,
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
      <div className="min-h-dvh flex flex-col items-center justify-center px-6 pb-safe text-center bg-white">
        <div className="bg-gray-100 p-8 rounded-2xl max-w-sm">
          <Package className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <h2 className="font-extrabold text-xl text-gray-900">No Items Detected</h2>
          <p className="text-sm text-gray-500 mt-1 mb-5 font-medium">
            The photo did not produce recognizable physical items. Try submitting a well-lit photo.
          </p>
          <button
            onClick={() => navigate('/clearing-out')}
            className="px-5 py-2.5 bg-blue-500 hover:bg-blue-600 text-white font-bold text-xs rounded-lg transition"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const includedCount = items.filter(i => i.included).length;

  return (
    <div className="min-h-dvh bg-white text-gray-900 flex flex-col pb-safe">
      {/* Top Header */}
      <div className="bg-white border-b-2 border-gray-100 px-5 sm:px-8 pt-6 pb-4 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(-1)}
              className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 transition"
              title="Return"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div>
              <h1 className="font-extrabold text-2xl text-gray-900 tracking-tight">Review AI Listings</h1>
              <p className="text-xs text-gray-500 font-medium">
                {items.length} items detected • Review and edit details before publishing
              </p>
            </div>
          </div>
          <div className="text-xs font-bold bg-blue-50 text-blue-700 px-3 py-1.5 rounded-lg hidden sm:block">
            {includedCount} of {items.length} selected
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto w-full px-5 sm:px-8 py-6 flex-1 space-y-6">

        {/* 2-Column Responsive Layout */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
          {/* Photo Preview Column */}
          {photoPreview && (
            <div className="md:col-span-4 bg-gray-100 p-4 rounded-2xl md:sticky md:top-28">
              <div className="flex items-center gap-1.5 text-xs font-bold text-gray-700 mb-2.5">
                <ImageIcon className="w-4 h-4 text-blue-500" />
                <span>Uploaded Source Photo</span>
              </div>
              <img
                src={photoPreview}
                alt="Source items"
                className="w-full aspect-[4/3] object-cover rounded-xl"
              />
              <p className="text-xs text-gray-500 mt-2 text-center font-medium">
                Detected items from this image
              </p>
            </div>
          )}

          {/* Items Editor Column */}
          <div className={`${photoPreview ? 'md:col-span-8' : 'md:col-span-12'} space-y-4`}>
            {items.map((item) => {
              const icon = ITEM_ICONS[item.category] || ITEM_ICONS.default;
              return (
                <div
                  key={item.id}
                  className={`rounded-2xl transition-all ${
                    item.included
                      ? 'bg-gray-100 p-1'
                      : 'bg-gray-100/60 opacity-60 p-1'
                  }`}
                >
                  {/* Collapsed Header Bar */}
                  <div className="flex items-center gap-3 p-3.5 rounded-xl bg-white">
                    <input
                      type="checkbox"
                      checked={item.included}
                      onChange={e => updateItem(item.id, 'included', e.target.checked)}
                      className="w-5 h-5 rounded-md text-blue-500 focus:ring-blue-500 cursor-pointer accent-blue-500"
                      title="Include in listing"
                    />

                    {photoPreview ? (
                      <img
                        src={photoPreview}
                        alt={item.title}
                        onClick={() => toggleExpand(item.id)}
                        className="w-9 h-9 rounded-lg object-cover cursor-pointer shrink-0"
                      />
                    ) : (
                      <span className="text-2xl cursor-pointer" onClick={() => toggleExpand(item.id)}>
                        {icon}
                      </span>
                    )}

                    <div className="flex-1 min-w-0 cursor-pointer" onClick={() => toggleExpand(item.id)}>
                      <p className="font-bold text-sm text-gray-900 truncate">{item.title}</p>
                      <div className="flex items-center gap-2 mt-0.5 text-xs text-gray-500 font-medium">
                        <span className="capitalize">{item.category}</span>
                        <span>•</span>
                        <span>{routeLabels[item.route] || item.route}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-xs font-bold">
                      {item.priceType === 'free' && (
                        <span className="text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-md">Free</span>
                      )}
                      {item.priceType === 'price' && (
                        <span className="text-gray-900 font-extrabold text-sm">₹{item.askingPrice}</span>
                      )}
                      {item.priceType === 'scrap' && (
                        <span className="text-amber-600 bg-amber-50 px-2 py-1 rounded-md">Scrap</span>
                      )}
                      <button
                        onClick={() => toggleExpand(item.id)}
                        className="p-1 text-gray-400 hover:text-gray-700 rounded-md"
                        title={item.expanded ? 'Collapse' : 'Expand'}
                      >
                        {item.expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Expanded Item Form */}
                  {item.expanded && (
                    <div className="p-4 space-y-4 pt-4">
                      {/* Title */}
                      <div>
                        <label className="text-xs font-bold uppercase tracking-wider text-gray-700 block mb-1.5">
                          Item Title
                        </label>
                        <input
                          type="text"
                          value={item.title}
                          onChange={e => updateItem(item.id, 'title', e.target.value)}
                          className="w-full px-3.5 py-2.5 bg-white border-2 border-transparent focus:border-blue-500 rounded-lg text-sm text-gray-900 font-medium outline-none"
                        />
                      </div>

                      {/* Route Selection */}
                      <div>
                        <label className="text-xs font-bold uppercase tracking-wider text-gray-700 block mb-1.5">
                          Recycling / Disposal Route
                        </label>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                          {routes.map((r) => (
                            <button
                              key={r.value}
                              type="button"
                              onClick={() => {
                                updateItem(item.id, 'route', r.value);
                                if (r.value === 'ewaste' || r.value === 'scrap') {
                                  updateItem(item.id, 'priceType', 'scrap');
                                }
                              }}
                              className={`py-2 px-3 text-xs font-bold rounded-lg transition-all text-center ${
                                item.route === r.value
                                  ? 'bg-blue-500 text-white'
                                  : 'bg-white text-gray-700 hover:bg-gray-200'
                              }`}
                            >
                              {r.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Category & Condition */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="text-xs font-bold uppercase tracking-wider text-gray-700 block mb-1.5">
                            Category
                          </label>
                          <select
                            value={item.category}
                            onChange={e => updateItem(item.id, 'category', e.target.value)}
                            className="w-full px-3.5 py-2.5 bg-white border-2 border-transparent focus:border-blue-500 rounded-lg text-sm text-gray-900 font-medium capitalize outline-none"
                          >
                            {categories.map(c => (
                              <option key={c} value={c} className="capitalize">
                                {c}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="text-xs font-bold uppercase tracking-wider text-gray-700 block mb-1.5">
                            Condition
                          </label>
                          <div className="flex gap-1.5 flex-wrap">
                            {conditionOptions.map(c => (
                              <button
                                key={c}
                                type="button"
                                onClick={() => updateItem(item.id, 'condition', c)}
                                className={`px-2.5 py-1.5 text-xs font-bold capitalize rounded-lg transition ${
                                  item.condition === c
                                    ? 'bg-emerald-500 text-white'
                                    : 'bg-white text-gray-700 hover:bg-gray-200'
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
                        <label className="text-xs font-bold uppercase tracking-wider text-gray-700 block mb-1.5">
                          Description
                        </label>
                        <textarea
                          value={item.description}
                          onChange={e => updateItem(item.id, 'description', e.target.value)}
                          rows={2}
                          className="w-full px-3.5 py-2.5 bg-white border-2 border-transparent focus:border-blue-500 rounded-lg text-sm text-gray-900 font-medium outline-none resize-none"
                          placeholder="Factual notes on visible condition..."
                        />
                      </div>

                      {/* Pricing Type */}
                      <div>
                        <label className="text-xs font-bold uppercase tracking-wider text-gray-700 block mb-1.5">
                          Listing Type
                        </label>
                        <div className="grid grid-cols-3 gap-2">
                          {priceTypes.map((pt) => (
                            <button
                              key={pt.value}
                              type="button"
                              onClick={() => updateItem(item.id, 'priceType', pt.value)}
                              className={`py-2 px-2 text-xs font-bold rounded-lg transition text-center ${
                                item.priceType === pt.value
                                  ? 'bg-blue-500 text-white'
                                  : 'bg-white text-gray-700 hover:bg-gray-200'
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
                          <label className="text-xs font-bold uppercase tracking-wider text-gray-700 block mb-1.5">
                            Asking Price (₹)
                            {item.suggestedPrice?.max > 0 && (
                              <span className="text-gray-500 font-normal ml-1">
                                — Suggested: ₹{item.suggestedPrice?.min}–₹{item.suggestedPrice?.max}
                              </span>
                            )}
                          </label>
                          <input
                            type="number"
                            value={item.askingPrice}
                            onChange={e => updateItem(item.id, 'askingPrice', parseInt(e.target.value) || 0)}
                            className="w-full px-3.5 py-2.5 bg-white border-2 border-transparent focus:border-blue-500 rounded-lg text-sm text-gray-900 font-medium outline-none"
                            min={0}
                          />
                        </div>
                      )}

                      {/* Remove Button */}
                      <div className="pt-2 flex justify-end">
                        <button
                          type="button"
                          onClick={() => removeItem(item.id)}
                          className="flex items-center gap-1.5 text-xs text-rose-600 font-bold hover:text-rose-800 transition"
                        >
                          <Trash2 className="w-4 h-4" /> Remove from batch
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

      {/* Sticky Bottom Publishing Bar */}
      <div className="sticky bottom-0 bg-white border-t-2 border-gray-100 px-5 sm:px-8 py-4 z-30">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="text-xs text-gray-600 font-medium hidden sm:block">
            Publishing <strong className="text-gray-900">{includedCount} items</strong> to living circle{' '}
            <strong className="text-gray-900">{community?.name}</strong>
          </div>
          <button
            onClick={handlePublish}
            disabled={publishing || includedCount === 0}
            className="w-full sm:w-auto px-8 py-3.5 bg-blue-500 hover:bg-blue-600 active:scale-95 text-white font-bold text-sm rounded-xl transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer hover:scale-105 disabled:opacity-50"
          >
            {publishing ? (
              <span>Publishing...</span>
            ) : (
              <>
                <Check className="w-5 h-5" />
                <span>Publish {includedCount} Item{includedCount !== 1 ? 's' : ''}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
