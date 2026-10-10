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
    <div className="min-h-dvh bg-slate-50 pb-safe">
      {/* Header */}
      <div className="bg-white border-b border-slate-100 px-5 pt-12 pb-4 sticky top-0 z-30">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button onClick={() => navigate(-1)} className="p-2 -ml-2 text-slate-500 hover:text-slate-800">
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="font-bold text-xl text-slate-800 flex items-center gap-2">
                  <Heart className="w-5 h-5 text-rose-500" /> Wishlist
                </h1>
              </div>
            </div>
            <button
              onClick={() => setShowAdd(!showAdd)}
              className="p-2.5 bg-green-50 text-green-600 rounded-xl hover:bg-green-100 transition"
            >
              {showAdd ? <X className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
            </button>
          </div>

          {/* Add form */}
          {showAdd && (
            <form onSubmit={handleAdd} className="mt-4 space-y-3 animate-fade-in">
              <input
                type="text"
                value={keyword}
                onChange={e => setKeyword(e.target.value)}
                placeholder="What are you looking for?"
                className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                autoFocus
              />
              <div className="flex gap-2 flex-wrap">
                {categoryOptions.map(c => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setCategory(category === c ? '' : c)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium capitalize transition ${category === c ? 'bg-green-600 text-white' : 'bg-slate-100 text-slate-500'}`}
                  >
                    {c}
                  </button>
                ))}
              </div>
              <button
                type="submit"
                className="w-full py-3 bg-green-600 text-white rounded-xl font-semibold text-sm hover:bg-green-700 transition"
              >
                Add to Wishlist
              </button>
            </form>
          )}
        </div>
      </div>

      <div className="max-w-4xl mx-auto w-full px-5 pt-4 space-y-6">
        {/* Matches */}
        {matches.length > 0 && (
          <section>
            <h2 className="font-bold text-slate-800 mb-3 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500" /> Matches Found
            </h2>
            <div className="space-y-3 stagger-children">
              {matches.map(match => (
                <div key={match.wish.id} className="bg-gradient-to-r from-rose-50 to-amber-50 border border-rose-100 rounded-2xl p-4 animate-fade-in">
                  <p className="text-sm font-bold text-rose-700 mb-2">🎯 "{match.wish.keyword}" — {match.items.length} match{match.items.length !== 1 ? 'es' : ''}</p>
                  <div className="space-y-2">
                    {match.items.map(item => (
                      <button
                        key={item.id}
                        onClick={() => navigate(`/item/${item.id}`)}
                        className="w-full flex items-center gap-3 bg-white rounded-xl p-3 border border-rose-100 hover:shadow-sm transition"
                      >
                        <span className="text-2xl">{ITEM_ICONS[item.category] || '📦'}</span>
                        <div className="flex-1 text-left">
                          <p className="text-sm font-medium text-slate-700">{item.title}</p>
                          <p className="text-xs text-slate-400 capitalize">{item.category} • {item.condition}</p>
                        </div>
                        <span className="text-sm font-bold text-green-600">
                          {item.priceType === 'free' ? 'Free' : item.priceType === 'scrap' ? 'Scrap' : `₹${item.askingPrice}`}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Current wishlist */}
        <section>
          <h2 className="font-bold text-slate-800 mb-3">Your Wishlist</h2>
          {wishlist.length === 0 ? (
            <div className="text-center py-8">
              <Heart className="w-10 h-10 text-slate-200 mx-auto mb-3" />
              <p className="text-slate-400 text-sm">Your wishlist is empty</p>
              <button onClick={() => setShowAdd(true)} className="text-green-600 text-sm font-semibold mt-2">
                Add your first item
              </button>
            </div>
          ) : (
            <div className="space-y-2 stagger-children">
              {wishlist.map(w => (
                <div key={w.id} className="bg-white rounded-xl border border-slate-100 p-4 flex items-center justify-between animate-fade-in">
                  <div>
                    <p className="font-medium text-sm text-slate-700">{w.keyword}</p>
                    {w.category && <p className="text-xs text-slate-400 capitalize mt-0.5">{w.category}</p>}
                  </div>
                  <button
                    onClick={() => handleRemove(w.id)}
                    className="p-2 text-slate-400 hover:text-rose-500 transition"
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
