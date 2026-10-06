import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'react-toastify';

const AuthContext = createContext(null);

const STORAGE_KEY_USER = 'cinepass_auth_user';
const STORAGE_KEY_USERS_DB = 'cinepass_registered_users';
const STORAGE_KEY_REMEMBER = 'cinepass_remember_email';

// Default pre-seeded demo user accounts
const INITIAL_DEMO_USERS = [
  {
    id: 'usr-001',
    name: 'Malik S',
    email: 'malik@cinema.com',
    phone: '+1 (555) 892-4120',
    password: 'Password123',
    role: 'Premiere Moviegoer',
    joinedDate: 'Jan 2024',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150'
  },
  {
    id: 'usr-002',
    name: 'Demo Guest',
    email: 'demo@cinepass.com',
    phone: '+1 (555) 123-4567',
    password: 'Password123',
    role: 'Regular Member',
    joinedDate: 'Mar 2024',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150'
  }
];

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_USER);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [loading, setLoading] = useState(true);

  // Initialize pre-seeded users if first time
  useEffect(() => {
    try {
      const existingUsers = localStorage.getItem(STORAGE_KEY_USERS_DB);
      if (!existingUsers) {
        localStorage.setItem(STORAGE_KEY_USERS_DB, JSON.stringify(INITIAL_DEMO_USERS));
      }
    } catch (e) {
      console.error('LocalStorage init error', e);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Log in user with credentials
   */
  const login = async (email, password, rememberMe = false) => {
    // Human-feeling authentication delay
    await new Promise((res) => setTimeout(res, 450));

    const usersDb = JSON.parse(localStorage.getItem(STORAGE_KEY_USERS_DB) || '[]');
    const normalizedEmail = email.toLowerCase().trim();

    const matchedUser = usersDb.find(
      (u) => u.email.toLowerCase() === normalizedEmail && u.password === password
    );

    if (!matchedUser) {
      throw new Error('Invalid email or password. Please verify your credentials.');
    }

    const sessionUser = {
      id: matchedUser.id,
      name: matchedUser.name,
      email: matchedUser.email,
      phone: matchedUser.phone,
      role: matchedUser.role || 'Premiere Member',
      joinedDate: matchedUser.joinedDate || '2024',
      avatar: matchedUser.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150'
    };

    setCurrentUser(sessionUser);
    localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(sessionUser));

    if (rememberMe) {
      localStorage.setItem(STORAGE_KEY_REMEMBER, normalizedEmail);
    } else {
      localStorage.removeItem(STORAGE_KEY_REMEMBER);
    }

    toast.success(`Welcome back, ${sessionUser.name}!`);
    return sessionUser;
  };

  /**
   * Register a new user
   */
  const register = async ({ name, email, phone, password }) => {
    await new Promise((res) => setTimeout(res, 500));

    const usersDb = JSON.parse(localStorage.getItem(STORAGE_KEY_USERS_DB) || '[]');
    const normalizedEmail = email.toLowerCase().trim();

    if (usersDb.some((u) => u.email.toLowerCase() === normalizedEmail)) {
      throw new Error('An account with this email address already exists.');
    }

    const newUser = {
      id: `usr-${Date.now()}`,
      name: name.trim(),
      email: normalizedEmail,
      phone: phone.trim(),
      password,
      role: 'Premiere Member',
      joinedDate: 'Today',
      avatar: `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150`
    };

    usersDb.push(newUser);
    localStorage.setItem(STORAGE_KEY_USERS_DB, JSON.stringify(usersDb));

    const sessionUser = {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      phone: newUser.phone,
      role: newUser.role,
      joinedDate: newUser.joinedDate,
      avatar: newUser.avatar
    };

    setCurrentUser(sessionUser);
    localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(sessionUser));
    toast.success('Registration successful! Welcome to CinePass.');
    return sessionUser;
  };

  /**
   * Reset password for an email
   */
  const resetPassword = async (email, newPassword) => {
    await new Promise((res) => setTimeout(res, 400));
    const usersDb = JSON.parse(localStorage.getItem(STORAGE_KEY_USERS_DB) || '[]');
    const normalizedEmail = email.toLowerCase().trim();

    const userIndex = usersDb.findIndex((u) => u.email.toLowerCase() === normalizedEmail);
    if (userIndex === -1) {
      throw new Error('No account found associated with this email address.');
    }

    usersDb[userIndex].password = newPassword;
    localStorage.setItem(STORAGE_KEY_USERS_DB, JSON.stringify(usersDb));
    toast.success('Password has been reset successfully! Please sign in.');
    return true;
  };

  /**
   * Logout current user
   */
  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem(STORAGE_KEY_USER);
    toast.info('You have been logged out.');
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isAuthenticated: !!currentUser,
        loading,
        login,
        register,
        resetPassword,
        logout,
        rememberedEmail: localStorage.getItem(STORAGE_KEY_REMEMBER) || ''
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
