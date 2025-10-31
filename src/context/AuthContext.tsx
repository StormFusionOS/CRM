import { createContext, useContext, useMemo, useState } from 'react';

type Role = 'admin' | 'tech' | 'sales' | 'support';

interface User {
  id: string;
  name: string;
  role: Role;
}

interface AuthContextValue {
  user: User;
  setRole: (role: Role) => void;
  hasRole: (roles: Role[]) => boolean;
}

const defaultUser: User = {
  id: '1',
  name: 'River Admin',
  role: 'admin'
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User>(defaultUser);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      setRole: (role) => setUser((prev) => ({ ...prev, role })),
      hasRole: (roles) => roles.includes(user.role)
    }),
    [user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return ctx;
};
