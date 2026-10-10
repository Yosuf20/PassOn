import { Routes, Route, Navigate } from 'react-router-dom';
import { useApp } from './context/AppContext';

// Components
import BottomNav from './components/BottomNav';
import TopNavbar from './components/TopNavbar';
import Toast from './components/Toast';

// Pages
import LoginPage from './pages/LoginPage';
import JoinCommunityPage from './pages/JoinCommunityPage';
import CommunityHomePage from './pages/CommunityHomePage';
import ClearingOutPage from './pages/ClearingOutPage';
import AIResultsPage from './pages/AIResultsPage';
import MarketplacePage from './pages/MarketplacePage';
import ItemDetailPage from './pages/ItemDetailPage';
import WishlistPage from './pages/WishlistPage';
import ScrapDayPage from './pages/ScrapDayPage';
import ImpactPage from './pages/ImpactPage';
import NotificationsPage from './pages/NotificationsPage';
import ProfilePage from './pages/ProfilePage';

function ProtectedRoute({ children }) {
  const { user, community } = useApp();
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  if (!community) {
    return <Navigate to="/join" replace />;
  }
  return children;
}

function JoinRoute({ children }) {
  const { user } = useApp();
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

function PublicOnlyRoute({ children }) {
  const { user, community } = useApp();
  if (user && community) {
    return <Navigate to="/home" replace />;
  }
  if (user) {
    return <Navigate to="/join" replace />;
  }
  return children;
}

function RootRedirect() {
  const { user, community } = useApp();
  if (user && community) return <Navigate to="/home" replace />;
  if (user) return <Navigate to="/join" replace />;
  return <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <div className="min-h-dvh flex flex-col bg-slate-50 text-slate-800 antialiased selection:bg-green-100 selection:text-green-800">
      <Toast />
      <TopNavbar />

      <main className="flex-1 w-full max-w-5xl lg:max-w-6xl mx-auto bg-slate-50 relative min-h-dvh">
        <Routes>
          {/* Public Authentication */}
          <Route
            path="/login"
            element={
              <PublicOnlyRoute>
                <LoginPage />
              </PublicOnlyRoute>
            }
          />

          {/* Join / Create Community */}
          <Route
            path="/join"
            element={
              <JoinRoute>
                <JoinCommunityPage />
              </JoinRoute>
            }
          />

          {/* Protected Community Pages */}
          <Route
            path="/home"
            element={
              <ProtectedRoute>
                <CommunityHomePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/marketplace"
            element={
              <ProtectedRoute>
                <MarketplacePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/item/:itemId"
            element={
              <ProtectedRoute>
                <ItemDetailPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/items/:itemId"
            element={
              <ProtectedRoute>
                <ItemDetailPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/clearing-out"
            element={
              <ProtectedRoute>
                <ClearingOutPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/ai-results"
            element={
              <ProtectedRoute>
                <AIResultsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/wishlist"
            element={
              <ProtectedRoute>
                <WishlistPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/scrap-day"
            element={
              <ProtectedRoute>
                <ScrapDayPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/impact"
            element={
              <ProtectedRoute>
                <ImpactPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/notifications"
            element={
              <ProtectedRoute>
                <NotificationsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />

          {/* Root & Catch-all */}
          <Route path="/" element={<RootRedirect />} />
          <Route path="*" element={<RootRedirect />} />
        </Routes>

        <BottomNav />
      </main>
    </div>
  );
}
