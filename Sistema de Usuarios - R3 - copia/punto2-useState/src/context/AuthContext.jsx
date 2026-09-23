import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { apiPost } from '../api/client.js';

const AuthContext = createContext(null);
const TOKEN_KEY = 'tp_state_token';
const THEME_KEY = 'tp_state_theme';

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage[TOKEN_KEY] || '');
  const [user, setUser] = useState(null);
  const [theme, setTheme] = useState(() => localStorage[THEME_KEY] || 'light');
  const [loading, setLoading] = useState(Boolean(token));

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage[THEME_KEY] = theme;
  }, [theme]);

  useEffect(() => {
    if (!token) {
      setLoading(false);
      setUser(null);
      return;
    }

    apiPost('/session', {}, token)
      .then((data) => setUser(data.user))
      .catch(() => {
        delete localStorage[TOKEN_KEY];
        setToken('');
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, [token]);

  const saveSession = (data) => {
    localStorage[TOKEN_KEY] = data.token;
    setToken(data.token);
    setUser(data.user);
  };

  const login = async (payload) => saveSession(await apiPost('/login', payload));
  const register = async (payload) => saveSession(await apiPost('/register', payload));

  const updateProfile = async (payload) => {
    const data = await apiPost('/profile', payload, token);
    setUser(data.user);
  };

  const logout = () => {
    delete localStorage[TOKEN_KEY];
    setToken('');
    setUser(null);
  };

  const value = useMemo(
    () => ({
      token,
      user,
      theme,
      loading,
      login,
      register,
      updateProfile,
      logout,
      toggleTheme: () => setTheme((current) => (current === 'light' ? 'dark' : 'light'))
    }),
    [token, user, theme, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
