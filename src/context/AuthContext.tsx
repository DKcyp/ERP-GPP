import React, { createContext, useContext, useState, ReactNode } from 'react';
import { AuthState, User } from '../types';

interface AuthContextType extends AuthState {
  login: (username: string, password: string) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

const mockUsers = [
  {
    username: 'marketing',
    password: '12345',
    role: 'marketing' as const,
    fullName: 'Marketing Manager',
    profilePicture: 'https://images.pexels.com/photos/3777931/pexels-photo-3777931.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop&crop=face'
  },
  {
    username: 'operational',
    password: '12345',
    role: 'operational' as const,
    fullName: 'Operations Manager',
    profilePicture: 'https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop&crop=face'
  },
  {
    username: 'hrd',
    password: '12345',
    role: 'hrd' as const,
    fullName: 'HRD Manager',
    profilePicture: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop&crop=face'
  },
  {
    username: 'pengadaan',
    password: '12345',
    role: 'pengadaan' as const,
    fullName: 'Procurement Manager',
    profilePicture: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop&crop=face'
  },
  {
    username: 'finance',
    password: '12345',
    role: 'finance' as const,
    fullName: 'Finance Manager',
    profilePicture: 'https://images.pexels.com/photos/3184405/pexels-photo-3184405.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop&crop=face'
  },
  {
    username: 'gudang',
    password: '12345',
    role: 'gudang' as const,
    fullName: 'Gudang Manager',
    profilePicture: 'https://images.pexels.com/photos/3184405/pexels-photo-3184405.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop&crop=face'
  }
];

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    user: null
  });

  const login = (username: string, password: string): boolean => {
    const user = mockUsers.find(u => u.username === username && u.password === password);
    if (user) {
      setAuthState({
        isAuthenticated: true,
        user: {
          username: user.username,
          role: user.role,
          fullName: user.fullName,
          profilePicture: user.profilePicture
        }
      });
      return true;
    }
    return false;
  };

  const logout = () => {
    setAuthState({
      isAuthenticated: false,
      user: null
    });
  };

  return (
    <AuthContext.Provider value={{ ...authState, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
