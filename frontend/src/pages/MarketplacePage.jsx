import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import api from '../services/api';
import ItemCard from '../components/ItemCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { Search, SlidersHorizontal, X } from 'lucide-react';

const categories = ['all', 'electronics', 'books', 'home', 'appliances', 'fitness', 'furniture', 'clothing', 'paper'];
const routes = ['all', 'reuse', 'scrap', 'ewaste'];
const routeLabels = { all: 'All', reuse: 'Reuse', scrap: 'Scrap', ewaste: 'E-Waste' };

export default function MarketplacePage() {
  const { community } = useApp();
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedRoute, setSelectedRoute] = useState('all');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    if (!community) { navigate('/join'); return; }
    loadItems();
  }, [community]);

  const loadItems = async () => {
    setLoading(true);
    try {
      const data = await api.getItems(community.id);
      setItems(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filtered = items.filter(item => {
    if (selectedCategory !== 'all' && item.category !== selectedCategory) return false;
    if (selectedRoute !== 'all' && item.route !== selectedRoute) return false;
    if (search && !item.title.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const available = filtered.filter(i => i.status === 'available');
  const claimed = filtered.filter(i => i.status === 'claimed');

  return (
    <div className="min-h-dvh bg-slate-50 pb-safe">
      {/* Header */}
      <div className="bg-white border-b border-slate-100 px-5 pt-12 pb-4 sticky top-0 z-30">
        <h1 className="font-bold text-xl text-slate-800 mb-3">Marketplace</h1>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search items..."
            className="w-full pl-10 pr-10 py-3 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
          />
          {search && (
            <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Route filter chips */}
        <div className="flex gap-2 mt-3 overflow-x-auto scrollbar-hide -mx-1 px-1">
          {routes.map(r => (
            <button
              key={r}
              onClick={() => setSelectedRoute(r)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200 ${selectedRoute === r ? 'bg-green-600 text-white shadow-sm' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
            >
              {routeLabels[r]}
            </button>
          ))}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1 transition ${showFilters ? 'bg-sky-100 text-sky-700' : 'bg-slate-100 text-slate-500'}`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            Category
          </button>
        </div>

        {/* Category filters */}
        {showFilters && (
          <div className="flex gap-2 mt-2 flex-wrap animate-fade-in">
            {categories.map(c => (
              <button
                key={c}
                onClick={() => setSelectedCategory(c)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium capitalize transition ${selectedCategory === c ? 'bg-green-100 text-green-700' : 'bg-slate-50 text-slate-500 border border-slate-200'}`}
              >
                {c}
              </button>
            ))}
          </div>
        )}
      </div>

      {loading ? (
        <LoadingSpinner message="Loading items..." />
      ) : (
        <div className="px-5 pt-4">
          {/* Results count */}
          <p className="text-xs text-slate-400 mb-3">{available.length} available • {claimed.length} claimed</p>

          {available.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-4xl mb-3">📭</p>
              <p className="text-slate-500 font-medium">No items match your filters</p>
              <button
                onClick={() => { setSearch(''); setSelectedCategory('all'); setSelectedRoute('all'); }}
                className="text-green-600 text-sm font-semibold mt-2"
              >
                Clear filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4 stagger-children">
              {available.map(item => (
                <ItemCard key={item.id} item={item} />
              ))}
            </div>
          )}

          {/* Claimed section */}
          {claimed.length > 0 && (
            <div className="mt-8">
              <p className="text-sm font-semibold text-slate-400 mb-3">Recently Claimed</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
                {claimed.map(item => (
                  <ItemCard key={item.id} item={item} />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
