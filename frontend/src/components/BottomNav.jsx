import { NavLink, useLocation } from 'react-router-dom';
import { Home, Search, PlusCircle, Bell, User } from 'lucide-react';

const navItems = [
  { to: '/home', label: 'Home', icon: Home },
  { to: '/marketplace', label: 'Browse', icon: Search },
  { to: '/clearing-out', label: 'List', icon: PlusCircle, primary: true },
  { to: '/notifications', label: 'Alerts', icon: Bell },
  { to: '/profile', label: 'Profile', icon: User },
];

export default function BottomNav() {
  const location = useLocation();

  // Hide on auth/community setup pages
  const hiddenPaths = ['/', '/login', '/join'];
  if (hiddenPaths.includes(location.pathname)) return null;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 glass border-t border-slate-200/60 md:hidden">
      <div className="max-w-lg mx-auto flex items-center justify-around px-2 h-16">
        {navItems.map(({ to, label, icon: Icon, primary }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-all duration-200 min-w-[3.5rem]
              ${primary
                ? 'relative -mt-5'
                : isActive
                  ? 'text-green-700'
                  : 'text-slate-400 hover:text-slate-600'
              }`
            }
          >
            {({ isActive }) => (
              <>
                {primary ? (
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg transition-all duration-200 ${isActive ? 'bg-green-600 shadow-green-300/50 scale-105' : 'bg-green-600 shadow-green-300/40 hover:scale-105'}`}>
                    <Icon className="w-7 h-7 text-white" strokeWidth={2.5} />
                  </div>
                ) : (
                  <>
                    <Icon className={`w-6 h-6 transition-all duration-200 ${isActive ? 'scale-110' : ''}`} strokeWidth={isActive ? 2.5 : 1.8} />
                    <span className={`text-[10px] font-medium ${isActive ? 'font-semibold' : ''}`}>{label}</span>
                  </>
                )}
              </>
            )}
          </NavLink>
        ))}
      </div>
      {/* Safe area spacer for iOS */}
      <div className="h-[env(safe-area-inset-bottom)]" />
    </nav>
  );
}
