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
    { value: 'pg', label: 'PG' },
    { value: 'apartment', label: 'Flat / Apartment' },
    { value: 'campus', label: 'Campus' },
    { value: 'society', label: 'Housing Society' },
  ];

  const handleJoin = async (e) => {
    e.preventDefault();
    if (!code.trim()) { setError('Enter an invite code'); return; }
    setError('');
    setLoading(true);
    try {
      const community = await api.joinCommunity(code.trim());
      setCommunity(community);
      showToast('success', `Joined ${community.name}!`);
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
      const community = await api.createCommunity(communityName, communityType, description);
      setCommunity(community);
      showToast('success', `Created "${community.name}"! Invite code: ${community.code}`);
      navigate('/home');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-dvh bg-slate-50 flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-br from-green-700 to-emerald-600 px-6 pt-12 pb-10 rounded-b-[2rem] relative overflow-hidden">
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/5 rounded-full" />
        <div className="absolute bottom-4 -left-8 w-24 h-24 bg-white/5 rounded-full" />

        <div className="flex items-center gap-2 mb-2">
          <Recycle className="w-5 h-5 text-green-200" />
          <span className="text-green-200 text-sm font-medium">PassOn</span>
        </div>
        <h1 className="text-2xl font-bold text-white">
          {user ? `Hey, ${user.name.split(' ')[0]}! 👋` : 'Welcome!'}
        </h1>
        <p className="text-green-100 text-sm mt-1">Join your community or start a new one</p>
      </div>

      {/* Toggle */}
      <div className="px-6 -mt-5 max-w-md w-full mx-auto">
        <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-1.5 flex gap-1">
          <button
            onClick={() => { setMode('join'); setError(''); }}
            className={`flex-1 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${mode === 'join' ? 'bg-green-600 text-white shadow-md' : 'text-slate-500 hover:text-slate-700'}`}
          >
            <Hash className="w-4 h-4 inline mr-1.5 -mt-0.5" />
            Join with Code
          </button>
          <button
            onClick={() => { setMode('create'); setError(''); }}
            className={`flex-1 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${mode === 'create' ? 'bg-green-600 text-white shadow-md' : 'text-slate-500 hover:text-slate-700'}`}
          >
            <Plus className="w-4 h-4 inline mr-1.5 -mt-0.5" />
            Create New
          </button>
        </div>
      </div>

      {/* Form */}
      <div className="flex-1 px-6 pt-6 pb-8 max-w-md w-full mx-auto">
        {error && (
          <div className="bg-rose-50 text-rose-600 text-sm px-4 py-2.5 rounded-xl mb-4 font-medium animate-fade-in">
            {error}
          </div>
        )}

        {mode === 'join' ? (
          <form onSubmit={handleJoin} className="space-y-5 animate-fade-in">
            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 block">Invite Code</label>
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                placeholder="e.g. SUN2026"
                className="w-full px-4 py-4 rounded-xl bg-white border border-slate-200 text-slate-800 text-lg font-mono tracking-widest text-center placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                maxLength={10}
              />
              <p className="text-xs text-slate-400 mt-2 text-center">Ask your PG/hostel admin for the invite code</p>
            </div>

            <div className="bg-green-50 border border-green-100 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <Users className="w-5 h-5 text-green-600 mt-0.5 shrink-0" />
                <div>
                  <p className="text-sm font-medium text-green-800">Demo codes to try:</p>
                  <p className="text-xs text-green-600 mt-1"><strong>SUN2026</strong> — Sunshine PG (24 members)</p>
                  <p className="text-xs text-green-600"><strong>GVA2026</strong> — Green Valley Apartments (56 members)</p>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-green-600 hover:bg-green-700 active:bg-green-800 text-white font-bold text-base rounded-xl shadow-lg shadow-green-600/30 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Join Community
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>
        ) : (
          <form onSubmit={handleCreate} className="space-y-5 animate-fade-in">
            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5 block">Community Name</label>
              <input
                type="text"
                value={communityName}
                onChange={(e) => setCommunityName(e.target.value)}
                placeholder="e.g. Sunrise PG – HSR Layout"
                className="w-full px-4 py-3.5 rounded-xl bg-white border border-slate-200 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition text-base"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5 block">Type</label>
              <div className="grid grid-cols-3 gap-2">
                {communityTypes.map(t => (
                  <button
                    key={t.value}
                    type="button"
                    onClick={() => setCommunityType(t.value)}
                    className={`py-2.5 px-3 rounded-xl text-sm font-medium border transition-all duration-200 ${communityType === t.value ? 'bg-green-600 text-white border-green-600 shadow-sm' : 'bg-white text-slate-600 border-slate-200 hover:border-green-300'}`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5 block">Description (optional)</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="What's this community about?"
                rows={3}
                className="w-full px-4 py-3.5 rounded-xl bg-white border border-slate-200 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition text-base resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-green-600 hover:bg-green-700 active:bg-green-800 text-white font-bold text-base rounded-xl shadow-lg shadow-green-600/30 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Create Community
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
