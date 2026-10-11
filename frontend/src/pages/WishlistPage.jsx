import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import api, { ITEM_ICONS } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import { ArrowLeft, Heart, Plus, X, Trash2, Sparkles } from 'lucide-react';

const categoryOptions = ['electronics', 'books', 'home', 'appliances', 'fitness', 'furniture', 'clothing', 'paper'];

export default function WishlistPage() {
  const { user, community, showToast } = useApp();
  const navigate = useNavigate();
  const [wishlist, setWishlist] = useState([]);
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [keyword, setKeyword] = useState('');
  const [category, setCategory] = useState('');

  useEffect(() => {
    if (!community) { navigate('/join'); return; }
    loadData();
  }, [community]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [wl, m] = await Promise.all([
        api.getWishlist(user.id, community.id),
        api.getWishlistMatches(user.id, community.id),
      ]);
      setWishlist(wl);
      setMatches(m);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!keyword.trim()) return;
    try {
      await api.addToWishlist(user.id, community.id, keyword.trim(), category);
      showToast('success', `Added "${keyword}" to wishlist`);
      setKeyword('');
      setCategory('');
      setShowAdd(false);
      loadData();
    } catch (err) {
      showToast('error', 'Failed to add');
    }
  };

  const handleRemove = async (wishId) => {
    try {
      await api.removeFromWishlist(wishId);
      loadData();
    } catch (err) {
      showToast('error', 'Failed to remove');
    }
  };

  if (loading) return <LoadingSpinner message="Loading wishlist..." />;

  return (
    <div className="min-h-dvh bg-white text-gray-900 pb-safe">
      {/* Header */}
      <div className="border-b-2 border-gray-100 px-5 sm:px-8 pt-6 pb-4 bg-white sticky top-0 z-30">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(-1)}
              className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 transition"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <h1 className="font-extrabold text-2xl sm:text-3xl text-gray-900 tracking-tight flex items-center gap-2">
              <Heart className="w-6 h-6 text-rose-500" strokeWidth={2.5} />
              <span>Wanted Wishlist</span>
            </h1>
          </div>
          <button
            onClick={() => setShowAdd(!showAdd)}
            className="px-4 py-2.5 bg-blue-500 hover:bg-blue-600 active:scale-95 text-white font-bold text-xs rounded-lg transition-transform hover:scale-105 flex items-center gap-1.5"
          >
            {showAdd ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" strokeWidth={2.5} />}
            <span>{showAdd ? 'Cancel' : 'Add Item'}</span>
          </button>
        </div>

        {/* Add Form */}
        {showAdd && (
          <div className="max-w-4xl mx-auto mt-4">
            <form onSubmit={handleAdd} className="bg-gray-100 rounded-2xl p-5 space-y-3.5 animate-fade-in">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-gray-700 block mb-1">
                  What are you looking for?
                </label>
                <input
                  type="text"
                  value={keyword}
                  onChange={e => setKeyword(e.target.value)}
                  placeholder="e.g. Study Lamp, Kettle, Economics Textbook..."
                  className="w-full px-4 py-3 bg-white border-2 border-transparent focus:border-blue-500 rounded-lg text-sm text-gray-900 font-medium outline-none"
                  autoFocus
                />
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-gray-700 block mb-1.5">
                  Optional Category Tag
                </label>
                <div className="flex gap-1.5 flex-wrap">
                  {categoryOptions.map(c => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setCategory(category === c ? '' : c)}
                      className={`px-3 py-1 text-xs font-bold capitalize rounded-lg transition ${
                        category === c
                          ? 'bg-blue-500 text-white'
                          : 'bg-white text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-blue-500 hover:bg-blue-600 active:scale-95 text-white font-bold text-sm rounded-lg transition-transform hover:scale-105"
              >
                Add to Wishlist
              </button>
            </form>
          </div>
        )}
      </div>

      <div className="max-w-4xl mx-auto w-full px-5 sm:px-8 py-6 space-y-8">
        {/* Matches Found */}
        {matches.length > 0 && (
          <section>
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-5 h-5 text-amber-500" strokeWidth={2.5} />
              <h2 className="font-extrabold text-xl text-gray-900">
                Active Community Matches
              </h2>
            </div>
            <div className="space-y-3">
              {matches.map(match => (
                <div key={match.wish.id} className="bg-rose-50 rounded-2xl p-5">
                  <div className="flex items-center justify-between text-sm font-bold text-rose-900 mb-3">
                    <span>Wanted: "{match.wish.keyword}"</span>
                    <span className="bg-rose-200 text-rose-900 px-2.5 py-0.5 rounded-md text-xs font-extrabold">
                      {match.items.length} match{match.items.length !== 1 ? 'es' : ''}
                    </span>
                  </div>
                  <div className="space-y-2">
                    {match.items.map(item => (
                      <button
                        key={item.id}
                        onClick={() => navigate(`/item/${item.id}`)}
                        className="w-full flex items-center justify-between p-3.5 bg-white rounded-xl hover:bg-rose-100/50 transition text-left cursor-pointer"
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{ITEM_ICONS[item.category] || '📦'}</span>
                          <div>
                            <p className="font-bold text-sm text-gray-900">{item.title}</p>
                            <p className="text-xs text-gray-500 capitalize">
                              {item.category} • {item.condition}
                            </p>
                          </div>
                        </div>
                        <div className="text-xs font-extrabold">
                          {item.priceType === 'free' ? (
                            <span className="text-emerald-600">Free</span>
                          ) : item.priceType === 'scrap' ? (
                            <span className="text-amber-600">Scrap</span>
                          ) : (
                            <span className="text-gray-900">₹{item.askingPrice}</span>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Current Wishlist */}
        <section>
          <div className="mb-4">
            <h2 className="font-extrabold text-xl text-gray-900">Your Monitored Items</h2>
            <p className="text-xs text-gray-500 font-medium mt-0.5">
              You will be alerted when someone lists an item matching these titles
            </p>
          </div>

          {wishlist.length === 0 ? (
            <div className="bg-gray-100 rounded-2xl p-8 text-center">
              <Heart className="w-8 h-8 text-gray-400 mx-auto mb-2" strokeWidth={2} />
              <p className="font-bold text-base text-gray-900">Your wishlist is empty</p>
              <p className="text-xs text-gray-500 mt-1 font-medium">
                Looking for a textbook, fan, or kettle? Click Add Item above to start monitoring.
              </p>
            </div>
          ) : (
            <div className="space-y-2.5">
              {wishlist.map(w => (
                <div key={w.id} className="bg-gray-100 rounded-xl p-4 flex items-center justify-between">
                  <div>
                    <p className="font-bold text-sm text-gray-900">{w.keyword}</p>
                    {w.category && (
                      <p className="text-xs text-gray-500 capitalize mt-0.5 font-medium">Category: {w.category}</p>
                    )}
                  </div>
                  <button
                    onClick={() => handleRemove(w.id)}
                    className="p-2 text-gray-400 hover:text-rose-600 rounded-lg transition"
                    title="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
