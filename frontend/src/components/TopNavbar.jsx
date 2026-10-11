import { NavLink, useLocation } from 'react-router-dom';
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
} from 'lucide-react';

export default function TopNavbar() {
  const { user, community } = useApp();
  const location = useLocation();

  // Hide on public / setup routes
  const hiddenPaths = ['/', '/login', '/join'];
  if (hiddenPaths.includes(location.pathname) || !user || !community) return null;

  const navLinks = [
    { to: '/home', label: 'Home', icon: Home },
    { to: '/marketplace', label: 'Marketplace', icon: Search },
    { to: '/clearing-out', label: 'Clear Out', icon: Sparkles, highlight: true },
    { to: '/wishlist', label: 'Wishlist', icon: Heart },
    { to: '/scrap-day', label: 'Scrap Day', icon: CalendarDays },
    { to: '/impact', label: 'Impact', icon: TrendingUp },
  ];

  return (
    <header className="hidden md:block sticky top-0 z-40 bg-white border-b-2 border-gray-100">
      <div className="max-w-7xl mx-auto px-6 h-18 flex items-center justify-between gap-6">
        {/* Brand & Community Badge */}
        <div className="flex items-center gap-3 shrink-0">
          <NavLink to="/home" className="flex items-center gap-3 group">
            <div className="w-11 h-11 rounded-lg bg-blue-500 text-white flex items-center justify-center transition-transform duration-200 group-hover:scale-105">
              <Recycle className="w-6 h-6" strokeWidth={2.5} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-xl tracking-tight text-gray-900 leading-none">
                  PassOn
                </span>
                <span className="text-[11px] font-bold bg-blue-50 text-blue-600 px-2 py-0.5 rounded-md uppercase tracking-wider">
                  Community
                </span>
              </div>
              <span className="text-xs text-gray-500 block mt-1 font-medium truncate max-w-[160px]">
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
                `flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
                  highlight
                    ? isActive
                      ? 'bg-emerald-500 text-white'
                      : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                    : isActive
                      ? 'bg-blue-500 text-white'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`
              }
            >
              <Icon className="w-4 h-4" strokeWidth={2} />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Right Actions: Notifications & User */}
        <div className="flex items-center gap-2.5 shrink-0">
          <NavLink
            to="/notifications"
            className={({ isActive }) =>
              `relative p-2.5 rounded-lg transition-colors ${
                isActive
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`
            }
            title="Notifications"
          >
            <Bell className="w-5 h-5" strokeWidth={2} />
          </NavLink>

          <NavLink
            to="/profile"
            className={({ isActive }) =>
              `flex items-center gap-2.5 pl-2 pr-3.5 py-1.5 rounded-lg transition-colors ${
                isActive
                  ? 'bg-blue-50 text-blue-700'
                  : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
              }`
            }
          >
            <div className="w-8 h-8 rounded-md bg-blue-500 text-white font-bold text-xs flex items-center justify-center">
              {user?.avatar || 'U'}
            </div>
            <span className="text-xs font-semibold max-w-[100px] truncate">
              {user?.name?.split(' ')[0] || 'User'}
            </span>
          </NavLink>
        </div>
      </div>
    </header>
  );
}
