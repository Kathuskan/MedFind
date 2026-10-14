import React, { createContext, useContext, useState } from 'react';

export type UserRole = 'patient' | 'pharmacy_staff' | 'admin';

export interface UserProfile {
  email: string;
  role: UserRole;
  full_name: string;
  pharmacyName?: string;
}

interface AuthContextType {
  user: UserProfile | null;
  role: UserRole | null;
  token: string | null;
  login: (profile: UserProfile, token: string) => void;
  quickLoginAs: (role: 'patient' | 'pharmacy_staff' | 'admin') => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('medfind_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem('medfind_token');
  });

  const login = (profile: UserProfile, authToken: string) => {
    setUser(profile);
    setToken(authToken);
    localStorage.setItem('medfind_user', JSON.stringify(profile));
    localStorage.setItem('medfind_token', authToken);
    localStorage.setItem('medfind_role', profile.role);
  };

  const quickLoginAs = (targetRole: 'patient' | 'pharmacy_staff' | 'admin') => {
    if (targetRole === 'pharmacy_staff') {
      const staffUser: UserProfile = {
        email: 'dispensary@metrocare.local',
        role: 'pharmacy_staff',
        full_name: 'Dr. Nihal Perera',
        pharmacyName: 'State Pharmaceuticals Corporation (Rajya Osusala)',
      };
      login(staffUser, 'mock-pharmacy-staff-token');
    } else if (targetRole === 'admin') {
      const adminUser: UserProfile = {
        email: 'admin@medfind.local',
        role: 'admin',
        full_name: 'MedFind System Administrator',
      };
      login(adminUser, 'mock-admin-token');
    } else {
      const patientUser: UserProfile = {
        email: 'patient@medfind.local',
        role: 'patient',
        full_name: 'Kasun Jayasuriya',
      };
      login(patientUser, 'mock-patient-token');
    }
  };


  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('medfind_user');
    localStorage.removeItem('medfind_token');
    localStorage.removeItem('medfind_role');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role: user?.role || null,
        token,
        login,
        quickLoginAs,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
