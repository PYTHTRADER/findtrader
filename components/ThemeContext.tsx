import React, { createContext, useContext, useEffect } from 'react';

type Theme = 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Always force 'dark'
  const theme: Theme = 'dark';

  useEffect(() => {
    const root = window.document.documentElement;
    // Remove 'light' class if it exists and force 'dark'
    root.classList.remove('light');
    root.classList.add('dark');
    
    // Ensure localStorage stays in sync just in case
    localStorage.setItem('theme', 'dark');
  }, []);

  const toggleTheme = () => {
    // No-op: Theme is locked to dark
    console.log("Theme is locked to Night Mode.");
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};