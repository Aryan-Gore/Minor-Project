import { createContext, useContext, useState } from "react";

// Create the context
const AuthContext = createContext(null);

// Wrap your whole app with this provider
export function AuthProvider({ children }) {
  const [auth, setAuth] = useState(null);
  // auth = { token, role, name } after login
  // auth = null when logged out

  const login = (token, role, name) => {
    setAuth({ token, role, name });
    // Also store on window so axiosInstance can read it
    window.__authToken = token;
  };

  const logout = () => {
    setAuth(null);
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