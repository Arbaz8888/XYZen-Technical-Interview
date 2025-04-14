import React, { createContext, useContext, useState, ReactNode } from 'react';

interface User {
  id: string;
  role: 'artist' | 'user';
}

interface AuthContextType {
  user: User | null;
  login: (id: string, role: 'artist' | 'user') => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  login: () => {},
  logout: () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  const login = (id: string, role: 'artist' | 'user') => {
    setUser({ id, role });
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
