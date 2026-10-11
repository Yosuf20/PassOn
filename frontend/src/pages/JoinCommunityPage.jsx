import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import api from '../services/api';
import { Users, Plus, ArrowRight, Hash, Recycle } from 'lucide-react';

export default function JoinCommunityPage() {
  const [mode, setMode] = useState('join'); // 'join' | 'create'
  const [code, setCode] = useState('SUN2026');
  const [communityName, setCommunityName] = useState('');
  const [communityType, setCommunityType] = useState('pg');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { setCommunity, user, showToast } = useApp();
  const navigate = useNavigate();

  const communityTypes = [
    { value: 'hostel', label: 'Hostel' },
    { value: 'pg', label: 'PG Facility' },
    { value: 'apartment', label: 'Apartment' },
    { value: 'campus', label: 'Campus' },
    { value: 'society', label: 'Society' },
  ];

  const handleJoin = async (e) => {
    e.preventDefault();
    if (!code.trim()) { setError('Enter an invite code'); return; }
    setError('');
    setLoading(true);
    try {
      const comm = await api.joinCommunity(code.trim());
      setCommunity(comm);
      showToast('success', `Joined ${comm.name}!`);
      navigate('/home');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!communityName.trim()) { setError('Community name is required'); return; }
    setError('');
    setLoading(true);
    try {
      const comm = await api.createCommunity(communityName, communityType, description);
      setCommunity(comm);
      showToast('success', `Created "${comm.name}"! Invite code: ${comm.code}`);
      navigate('/home');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-dvh bg-white flex flex-col justify-center items-center px-4 py-12 pb-safe">
      {/* Header */}
      <div className="max-w-md w-full mb-6">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-8 h-8 rounded-lg bg-blue-500 text-white flex items-center justify-center">
            <Recycle className="w-4 h-4" strokeWidth={2.5} />
          </div>
          <span className="font-extrabold text-blue-600 tracking-tight text-sm">PassOn Registry</span>
        </div>
        <h1 className="font-extrabold text-3xl text-gray-900 tracking-tight">
          {user ? `Hey, ${user.name.split(' ')[0]}!` : 'Welcome!'}
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          Join your living circle or establish a new circular exchange community.
        </p>
      </div>

      {/* Main Card */}
      <div className="bg-gray-100 rounded-2xl max-w-md w-full p-8 animate-slide-up">
        {/* Toggle Mode */}
        <div className="grid grid-cols-2 p-1.5 bg-gray-200 rounded-xl mb-6 gap-1">
          <button
            onClick={() => { setMode('join'); setError(''); }}
            className={`py-3 px-3 rounded-lg font-bold text-sm transition-all duration-200 flex items-center justify-center gap-1.5 ${
              mode === 'join'
                ? 'bg-blue-500 text-white'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Hash className="w-4 h-4" strokeWidth={2.5} />
            Join with Code
          </button>
          <button
            onClick={() => { setMode('create'); setError(''); }}
            className={`py-3 px-3 rounded-lg font-bold text-sm transition-all duration-200 flex items-center justify-center gap-1.5 ${
              mode === 'create'
                ? 'bg-blue-500 text-white'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Plus className="w-4 h-4" strokeWidth={2.5} />
            Create New
          </button>
        </div>

        {error && (
          <div className="bg-rose-100 text-rose-700 text-sm font-semibold p-3.5 rounded-lg mb-5">
            {error}
          </div>
        )}

        {mode === 'join' ? (
          <form onSubmit={handleJoin} className="space-y-5 animate-fade-in">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-gray-700 block mb-2">
                Invite Code
              </label>
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                placeholder="e.g. SUN2026"
                className="w-full px-4 py-3.5 bg-white border-2 border-transparent focus:border-blue-500 rounded-lg text-2xl font-black text-center tracking-widest uppercase text-gray-900 outline-none transition"
                maxLength={10}
              />
              <p className="text-xs text-gray-500 mt-2 text-center">
                Ask your hostel, PG, or apartment admin for the code
              </p>
            </div>

            {/* Demo Codes Callout */}
            <div className="bg-emerald-50 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <Users className="w-5 h-5 text-emerald-600 mt-0.5 shrink-0" strokeWidth={2.5} />
                <div className="text-xs">
                  <p className="font-bold text-emerald-900">Demo circles to try:</p>
                  <p className="text-emerald-700 mt-1">
                    <strong>SUN2026</strong> — Sunshine PG (24 members)
                  </p>
                  <p className="text-emerald-700">
                    <strong>GVA2026</strong> — Green Valley Apts (56 members)
                  </p>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-blue-500 hover:bg-blue-600 active:scale-95 text-white font-bold text-base rounded-lg transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 hover:scale-105"
            >
              {loading ? (
                <span>Validating...</span>
              ) : (
                <>
                  <span>Join Community</span>
                  <ArrowRight className="w-5 h-5" strokeWidth={2.5} />
                </>
              )}
            </button>
          </form>
        ) : (
          <form onSubmit={handleCreate} className="space-y-4 animate-fade-in">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-gray-700 block mb-1.5">
                Community Name
              </label>
              <input
                type="text"
                value={communityName}
                onChange={(e) => setCommunityName(e.target.value)}
                placeholder="e.g. Sunrise PG – HSR Layout"
                className="w-full px-4 py-3 bg-white border-2 border-transparent focus:border-blue-500 rounded-lg text-gray-900 font-medium placeholder:text-gray-400 outline-none transition text-sm"
              />
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-gray-700 block mb-1.5">
                Type of Community
              </label>
              <div className="grid grid-cols-3 gap-2">
                {communityTypes.map(t => (
                  <button
                    key={t.value}
                    type="button"
                    onClick={() => setCommunityType(t.value)}
                    className={`py-2.5 px-2 text-xs font-bold rounded-lg transition-all duration-150 ${
                      communityType === t.value
                        ? 'bg-blue-500 text-white'
                        : 'bg-white text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-gray-700 block mb-1.5">
                Description (Optional)
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Brief notes about community rules or pickup location..."
                rows={3}
                className="w-full px-4 py-3 bg-white border-2 border-transparent focus:border-blue-500 rounded-lg text-gray-900 font-medium placeholder:text-gray-400 outline-none transition text-sm resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-blue-500 hover:bg-blue-600 active:scale-95 text-white font-bold text-base rounded-lg transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 hover:scale-105"
            >
              {loading ? (
                <span>Creating...</span>
              ) : (
                <>
                  <span>Create Community</span>
                  <ArrowRight className="w-5 h-5" strokeWidth={2.5} />
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
