import { createContext, useContext, useReducer, useCallback } from 'react';

const AppContext = createContext(null);

const getInitialState = () => {
  let savedUser = null;
  let savedCommunity = null;
  let savedToken = null;
  try {
    const u = localStorage.getItem('passon_user');
    if (u) savedUser = JSON.parse(u);
    const c = localStorage.getItem('passon_community');
    if (c) savedCommunity = JSON.parse(c);
    savedToken = localStorage.getItem('passon_token');
  } catch (e) {
    console.error('Failed to parse localStorage state:', e);
  }

  return {
    // Auth
    user: savedUser,
    token: savedToken,
    isAuthenticated: !!savedUser,

    // Community
    community: savedCommunity,

    // UI
    loading: false,
    toast: null, // { type: 'success' | 'error' | 'info', message: string }
  };
};

function appReducer(state, action) {
  switch (action.type) {
    case 'LOGIN': {
      try {
        localStorage.setItem('passon_user', JSON.stringify(action.payload.user));
        if (action.payload.token) localStorage.setItem('passon_token', action.payload.token);
      } catch (e) { console.error(e); }
      return { ...state, user: action.payload.user, token: action.payload.token, isAuthenticated: true };
    }
    case 'LOGOUT': {
      try {
        localStorage.removeItem('passon_user');
        localStorage.removeItem('passon_token');
        localStorage.removeItem('passon_community');
      } catch (e) { console.error(e); }
      return {
        user: null,
        token: null,
        isAuthenticated: false,
        community: null,
        loading: false,
        toast: null,
      };
    }
    case 'SET_COMMUNITY': {
      try {
        if (action.payload) {
          localStorage.setItem('passon_community', JSON.stringify(action.payload));
        } else {
          localStorage.removeItem('passon_community');
        }
      } catch (e) { console.error(e); }
      return { ...state, community: action.payload };
    }
    case 'UPDATE_USER': {
      const updatedUser = { ...state.user, ...action.payload };
      try {
        localStorage.setItem('passon_user', JSON.stringify(updatedUser));
      } catch (e) { console.error(e); }
      return { ...state, user: updatedUser };
    }
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SHOW_TOAST':
      return { ...state, toast: action.payload };
    case 'CLEAR_TOAST':
      return { ...state, toast: null };
    default:
      return state;
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, undefined, getInitialState);

  const login = useCallback((user, token) => {
    dispatch({ type: 'LOGIN', payload: { user, token } });
  }, []);

  const logout = useCallback(() => {
    dispatch({ type: 'LOGOUT' });
  }, []);

  const updateUser = useCallback((userData) => {
    dispatch({ type: 'UPDATE_USER', payload: userData });
  }, []);

  const setCommunity = useCallback((community) => {
    dispatch({ type: 'SET_COMMUNITY', payload: community });
  }, []);

  const setLoading = useCallback((loading) => {
    dispatch({ type: 'SET_LOADING', payload: loading });
  }, []);

  const showToast = useCallback((type, message) => {
    dispatch({ type: 'SHOW_TOAST', payload: { type, message } });
    setTimeout(() => dispatch({ type: 'CLEAR_TOAST' }), 3500);
  }, []);

  const value = {
    ...state,
    login,
    logout,
    updateUser,
    setCommunity,
    setLoading,
    showToast,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
