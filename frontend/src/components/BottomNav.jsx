import { NavLink, useLocation } from 'react-router-dom';
import { Home, Search, Plus, Bell, User } from 'lucide-react';

const navItems = [
  { to: '/home', label: 'Home', icon: Home },
  { to: '/marketplace', label: 'Browse', icon: Search },
  { to: '/clearing-out', label: 'List', icon: Plus, primary: true },
  { to: '/notifications', label: 'Alerts', icon: Bell },
  { to: '/profile', label: 'Profile', icon: User },
];

export default function BottomNav() {
  const location = useLocation();

  // Hide on auth/community setup pages
  const hiddenPaths = ['/', '/login', '/join'];
  if (hiddenPaths.includes(location.pathname)) return null;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t-2 border-gray-100 md:hidden">
      <div className="grid grid-cols-5 h-16 max-w-lg mx-auto px-2 items-center">
        {navItems.map(({ to, label, icon: Icon, primary }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center py-1 rounded-lg transition-all duration-200 ${
                primary
                  ? 'relative -mt-4'
                  : isActive
                    ? 'text-blue-500 font-bold'
                    : 'text-gray-500 hover:text-gray-900 font-medium'
              }`
            }
          >
            {({ isActive }) => (
              <>
                {primary ? (
                  <div
                    className={`w-13 h-13 rounded-xl flex items-center justify-center transition-transform duration-200 hover:scale-105 active:scale-95 ${
                      isActive ? 'bg-blue-600' : 'bg-blue-500'
                    }`}
                  >
                    <Icon className="w-7 h-7 text-white" strokeWidth={2.5} />
                  </div>
                ) : (
                  <>
                    <Icon className="w-5 h-5 mb-0.5" strokeWidth={isActive ? 2.5 : 2} />
                    <span className="text-[11px] tracking-tight">{label}</span>
                  </>
                )}
              </>
            )}
          </NavLink>
        ))}
      </div>
      {/* Safe area spacer for mobile */}
      <div className="h-[env(safe-area-inset-bottom)] bg-white" />
    </nav>
  );
}
