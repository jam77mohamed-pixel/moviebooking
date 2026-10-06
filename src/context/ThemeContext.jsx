import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext(null);

const STORAGE_KEY_THEME = 'cinepass_theme_preference';
const STORAGE_KEY_CITY = 'cinepass_active_city';

export const THEME_PRESETS = [
  {
    id: 'gold',
    name: 'Golden Bronze & Dark Amber',
    label: 'Kalki Bronze Gold (Reference)',
    primaryColor: '#d97706',
    secondaryColor: '#f59e0b',
    emoji: '🏆'
  },
  {
    id: 'burgundy',
    name: 'Royale Burgundy & Warm Gold',
    label: 'Deep Burgundy Red',
    primaryColor: '#881337',
    secondaryColor: '#f59e0b',
    emoji: '🍷'
  },
  {
    id: 'crimson',
    name: 'Cinema Crimson & Amber Gold',
    label: 'AMC / Velvet Crimson',
    primaryColor: '#be123c',
    secondaryColor: '#f59e0b',
    emoji: '🍿'
  },
  {
    id: 'cyber',
    name: 'IMAX Sci-Fi Neon',
    label: 'Cyber Indigo & Cyan',
    primaryColor: '#6366f1',
    secondaryColor: '#06b6d4',
    emoji: '🌌'
  }
];

export const ThemeProvider = ({ children }) => {
  // Default to 'gold' - matching user's uploaded reference image model
  const [theme, setThemeState] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_THEME);
      if (!stored || stored === 'burgundy' || stored === 'crimson') return 'gold';
      return stored;
    } catch {
      return 'gold';
    }
  });

  const [activeCity, setActiveCityState] = useState(() => {
    try {
      return localStorage.getItem(STORAGE_KEY_CITY) || 'New York';
    } catch {
      return 'New York';
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_THEME, theme);
      document.documentElement.setAttribute('data-theme', theme);
    } catch (e) {
      console.warn('Storage error:', e);
    }
  }, [theme]);

  const setTheme = (newTheme) => {
    setThemeState(newTheme);
  };

  const setActiveCity = (city) => {
    setActiveCityState(city);
    try {
      localStorage.setItem(STORAGE_KEY_CITY, city);
    } catch (e) {
      console.warn('Storage error:', e);
    }
  };

  return (
    <ThemeContext.Provider
      value={{
        theme,
        setTheme,
        activeCity,
        setActiveCity,
        isBurgundy: theme === 'burgundy',
        isCrimson: theme === 'crimson',
        isCyber: theme === 'cyber',
        isGold: theme === 'gold'
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export default ThemeContext;
