import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import api from '../services/api';
import ItemCard from '../components/ItemCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { Search, SlidersHorizontal, X } from 'lucide-react';

const categories = ['all', 'electronics', 'books', 'home', 'appliances', 'fitness', 'furniture', 'clothing', 'paper'];
const routes = ['all', 'reuse', 'scrap', 'ewaste'];
const routeLabels = { all: 'All Routes', reuse: 'Reuse', scrap: 'Scrap', ewaste: 'E-Waste' };

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
    <div className="min-h-dvh bg-white text-gray-900 pb-safe">
      {/* Sticky Header */}
      <div className="bg-white border-b-2 border-gray-100 px-5 sm:px-8 pt-6 pb-4 sticky top-0 z-30">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
          <h1 className="font-extrabold text-2xl sm:text-3xl text-gray-900 tracking-tight">
            Marketplace
          </h1>
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">
            {available.length} available • {claimed.length} claimed
          </p>
        </div>

        {/* Flat Search Bar */}
        <div className="relative mb-3">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search items (e.g. lamp, textbook, kettle)..."
            className="w-full pl-10 pr-10 py-3 bg-gray-100 border-2 border-transparent focus:border-blue-500 rounded-lg text-sm text-gray-900 placeholder:text-gray-400 outline-none transition font-medium"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Route Filter Chips */}
        <div className="flex gap-2 overflow-x-auto scrollbar-hide -mx-1 px-1">
          {routes.map(r => (
            <button
              key={r}
              onClick={() => setSelectedRoute(r)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                selectedRoute === r
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {routeLabels[r]}
            </button>
          ))}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
              showFilters
                ? 'bg-emerald-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            Category
          </button>
        </div>

        {/* Category Filters */}
        {showFilters && (
          <div className="flex gap-1.5 mt-2.5 flex-wrap pt-2.5 border-t border-gray-100 animate-fade-in">
            {categories.map(c => (
              <button
                key={c}
                onClick={() => setSelectedCategory(c)}
                className={`px-3 py-1 rounded-md text-xs font-semibold capitalize transition ${
                  selectedCategory === c
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        )}
      </div>

      {loading ? (
        <LoadingSpinner message="Loading marketplace items..." />
      ) : (
        <div className="px-5 sm:px-8 py-6">
          {available.length === 0 ? (
            <div className="bg-gray-100 rounded-2xl p-12 text-center max-w-md mx-auto my-8">
              <p className="font-bold text-xl text-gray-900 mb-2">No Matching Items</p>
              <p className="text-sm text-gray-500 mb-4 font-medium">
                Try loosening your search terms or clearing your category filters.
              </p>
              <button
                onClick={() => { setSearch(''); setSelectedCategory('all'); setSelectedRoute('all'); }}
                className="px-5 py-2.5 bg-blue-500 hover:bg-blue-600 text-white font-bold text-xs rounded-lg transition"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {available.map(item => (
                <ItemCard key={item.id} item={item} />
              ))}
            </div>
          )}

          {/* Recently Claimed Section */}
          {claimed.length > 0 && (
            <div className="mt-12 pt-8 border-t-2 border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-extrabold text-xl text-gray-900">
                  Recently Claimed Goods
                </h3>
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wide">
                  Reserved by neighbours
                </span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 opacity-75">
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
