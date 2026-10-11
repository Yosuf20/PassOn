import { useEffect, useRef, useState } from 'react';
import { ArrowRight, Eye, EyeOff, Leaf, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import api from '../../services/api';

export default function LoginModal({ item, onClose }) {
  const [isJoin, setIsJoin] = useState(false);
  const [email, setEmail] = useState('priya@example.com');
  const [password, setPassword] = useState('password123');
  const [name, setName] = useState('');
  const [inviteCode, setInviteCode] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const dialogRef = useRef(null);
  const closeRef = useRef(null);
  const { login } = useApp();
  const navigate = useNavigate();

  useEffect(() => {
    const previousFocus = document.activeElement;
    document.body.style.overflow = 'hidden';
    closeRef.current?.focus();
    const onKeyDown = (event) => {
      if (event.key === 'Escape') onClose();
      if (event.key === 'Tab' && dialogRef.current) {
        const focusable = dialogRef.current.querySelectorAll('button, input, a');
        if (!focusable.length) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
      }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = '';
      document.removeEventListener('keydown', onKeyDown);
      previousFocus?.focus?.();
    };
  }, [onClose]);

  const submit = async (event) => {
    event.preventDefault();
    setError('');
    if (isJoin && !name.trim()) { setError('Please add your name.'); return; }
    if (isJoin && !inviteCode.trim()) { setError('Please add your invite code.'); return; }
    setLoading(true);
    try {
      const result = isJoin ? await api.signup(name, email, password) : await api.login(email, password);
      login(result.user, result.token);
      onClose();
      navigate('/home');
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return <div className="fixed inset-0 z-[60] flex items-end justify-center bg-stone-950/40 p-0 sm:items-center sm:p-4" role="presentation" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
    <div ref={dialogRef} role="dialog" aria-modal="true" aria-labelledby="login-modal-title" className="landing-card w-full max-w-md rounded-t-3xl bg-[#fffdf8] p-6 sm:rounded-3xl sm:p-8">
      <div className="flex items-start justify-between"><div className="flex items-center gap-2"><span className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700"><Leaf className="h-5 w-5" /></span><div><h2 id="login-modal-title" className="text-xl font-black text-stone-950">{isJoin ? 'Join your community' : 'Welcome back'}</h2><p className="text-xs font-semibold text-stone-500">{item ? `Log in to claim '${item.title}'` : 'Log in to keep passing things on.'}</p></div></div><button ref={closeRef} onClick={onClose} aria-label="Close login dialog" className="rounded-full p-2 text-stone-500 hover:bg-stone-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"><X className="h-5 w-5" /></button></div>
      {error && <p role="alert" className="mt-5 rounded-xl bg-rose-50 p-3 text-sm font-semibold text-rose-700">{error}</p>}
      <form onSubmit={submit} className="mt-6 space-y-4">
        {isJoin && <label className="block text-sm font-bold text-stone-700">Full name<input value={name} onChange={(e) => setName(e.target.value)} className="mt-1.5 w-full rounded-xl border border-stone-200 bg-white px-4 py-3 font-medium outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100" placeholder="Your name" required /></label>}
        {isJoin && <label className="block text-sm font-bold text-stone-700">Invite code<input value={inviteCode} onChange={(e) => setInviteCode(e.target.value)} className="mt-1.5 w-full rounded-xl border border-stone-200 bg-white px-4 py-3 font-medium uppercase outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100" placeholder="COMMUNITY-123" required /></label>}
        <label className="block text-sm font-bold text-stone-700">Email<input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1.5 w-full rounded-xl border border-stone-200 bg-white px-4 py-3 font-medium outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100" placeholder="you@example.com" required /></label>
        <label className="block text-sm font-bold text-stone-700">Password<div className="relative mt-1.5"><input type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} className="w-full rounded-xl border border-stone-200 bg-white px-4 py-3 pr-12 font-medium outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100" placeholder="Your password" required /><button type="button" onClick={() => setShowPassword(!showPassword)} aria-label={showPassword ? 'Hide password' : 'Show password'} className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-stone-500">{showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}</button></div></label>
        <button disabled={loading} className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 py-3.5 font-bold text-white transition hover:bg-emerald-700 disabled:opacity-60">{loading ? 'Working...' : isJoin ? 'Join community' : 'Log in'} {!loading && <ArrowRight className="h-4 w-4" />}</button>
      </form>
      <button onClick={() => { setIsJoin(!isJoin); setError(''); }} className="mt-5 w-full text-center text-sm font-bold text-emerald-700 hover:text-emerald-900 focus:outline-none focus:underline">{isJoin ? 'Already have an account? Log in' : 'Have an invite code? Join a community'}</button>
    </div>
  </div>;
}
