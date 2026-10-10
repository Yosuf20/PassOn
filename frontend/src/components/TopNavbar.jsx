import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import {
  Recycle,
  Home,
  Search,
  Sparkles,
  Heart,
  TrendingUp,
  CalendarDays,
  Bell,
  User,
  LogOut,
  ChevronDown
} from 'lucide-react';

export default function TopNavbar() {
  const { user, community, logout } = useApp();
  const navigate = useNavigate();
  const location = useLocation();

  // Hide on public / setup routes
  const hiddenPaths = ['/', '/login', '/join'];
  if (hiddenPaths.includes(location.pathname) || !user || !community) return null;

  const navLinks = [
    { to: '/home', label: 'Home', icon: Home },
    { to: '/marketplace', label: 'Marketplace', icon: Search },
    { to: '/clearing-out', label: 'Clearing Out', icon: Sparkles, highlight: true },
    { to: '/wishlist', label: 'Wishlist', icon: Heart },
    { to: '/scrap-day', label: 'Scrap Day', icon: CalendarDays },
    { to: '/impact', label: 'Impact', icon: TrendingUp },
  ];

  return (
    <header className="hidden md:block sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between gap-6">
        {/* Brand & Community */}
        <div className="flex items-center gap-4 shrink-0">
          <NavLink to="/home" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-green-700 to-emerald-500 flex items-center justify-center text-white shadow-sm shadow-green-600/30 group-hover:scale-105 transition">
              <Recycle className="w-5 h-5" />
            </div>
            <div>
              <span className="font-extrabold text-base tracking-tight text-slate-800 flex items-center gap-1">
                PassOn <span className="text-[10px] bg-green-100 text-green-800 font-semibold px-1.5 py-0.2 rounded-sm uppercase tracking-wider">MVP</span>
              </span>
              <span className="text-[11px] text-slate-400 block -mt-0.5 truncate max-w-[140px] font-medium">
                {community?.name || 'Local Circle'}
              </span>
            </div>
          </NavLink>
        </div>

        {/* Center Nav Links */}
        <nav className="flex items-center gap-1.5 flex-1 justify-center">
          {navLinks.map(({ to, label, icon: Icon, highlight }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all duration-150 ${
                  highlight
                    ? isActive
                      ? 'bg-green-600 text-white shadow-sm shadow-green-600/20'
                      : 'bg-green-50 text-green-700 hover:bg-green-100'
                    : isActive
                      ? 'bg-slate-100 text-green-800'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`
              }
            >
              <Icon className="w-4 h-4" />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Right Actions: Notifications & User */}
        <div className="flex items-center gap-3 shrink-0">
          <NavLink
            to="/notifications"
            className={({ isActive }) =>
              `relative p-2.5 rounded-xl border transition ${
                isActive
                  ? 'bg-green-50 border-green-200 text-green-700'
                  : 'bg-slate-50 border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`
            }
            title="Notifications"
          >
            <Bell className="w-4.5 h-4.5" />
          </NavLink>

          <NavLink
            to="/profile"
            className={({ isActive }) =>
              `flex items-center gap-2.5 pl-2 pr-3 py-1.5 rounded-xl border transition ${
                isActive
                  ? 'bg-green-50 border-green-200 text-green-800'
                  : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
              }`
            }
          >
            <div className="w-7 h-7 rounded-lg bg-green-600 text-white font-bold text-xs flex items-center justify-center shadow-xs">
              {user?.avatar || 'U'}
            </div>
            <span className="text-xs font-semibold max-w-[100px] truncate">{user?.name}</span>
          </NavLink>
        </div>
      </div>
    </header>
  );
}
