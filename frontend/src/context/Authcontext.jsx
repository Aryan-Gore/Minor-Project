import { createContext, useContext, useState } from "react";

// Create the context
const AuthContext = createContext(null);

// Wrap your whole app with this provider
export function AuthProvider({ children }) {
  const [auth, setAuth] = useState(() => {
    const saved = localStorage.getItem("auth");
    if (saved) {
      const parsed = JSON.parse(saved);
      window.__authToken = parsed.token;
      return parsed;
    }
    return null;
  });

  const login = (token, role, name) => {
    const userData = { token, role, name };
    setAuth(userData);
    localStorage.setItem("auth", JSON.stringify(userData));
    window.__authToken = token;
  };

  const logout = () => {
    setAuth(null);
    localStorage.removeItem("auth");
    window.__authToken = null;
  };

  return (
    <AuthContext.Provider value={{ auth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook — use this in any component
export function useAuth() {
  return useContext(AuthContext);
}