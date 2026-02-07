import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface ThemeColors {
  background: string;
  text: string;
  textSecondary: string;
  textMuted: string;
  card: string;
  border: string;
  primary: string;
  headerText: string;
  sectionTitle: string;
  icon: string;
  switchTrackFalse: string;
}

export const lightColors: ThemeColors = {
  background: '#fafdffff', 
  text: '#3C2F2F',      
  textSecondary: '#6A6A6A', 
  textMuted: '#9CA3AF',
  card: '#FFFFFF',   
  border: '#E5E7EB',
  primary: '#EF2A39',  
  headerText: '#FFFFFF', 
  sectionTitle: '#3C2F2F',
  icon: '#6A6A6A',
  switchTrackFalse: '#D1D5DB',
};

export const darkColors: ThemeColors = {
  background: '#222222ff', 
  text: '#EDEDED',   
  textSecondary: '#A1A1AA', 
  textMuted: '#525252',
  card: '#1E1E1E',     
  border: '#2C2C2C',    
  primary: '#d52e3c',   
  headerText: '#EDEDED',
  sectionTitle: '#FFFFFF',
  icon: '#A1A1AA',
  switchTrackFalse: '#3E3E3E',
};

interface ThemeContextType {
  isDark: boolean;
  colors: ThemeColors;
  toggleTheme: () => void;
  setScheme: (scheme: 'light' | 'dark') => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const systemScheme = useColorScheme();
  const [isDark, setIsDark] = useState<boolean>(false);

  useEffect(() => {
    const loadTheme = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem('appTheme');
        if (savedTheme) {
          setIsDark(savedTheme === 'dark');
        } else {
          setIsDark(systemScheme === 'dark');
        }
      } catch (error) {
        console.log('Error loading theme:', error);
      }
    };
    loadTheme();
  }, [systemScheme]);

  const toggleTheme = async () => {
    const newMode = !isDark;
    setIsDark(newMode);
    try {
      await AsyncStorage.setItem('appTheme', newMode ? 'dark' : 'light');
    } catch (error) {
      console.log('Error saving theme:', error);
    }
  };

  const setScheme = (scheme: 'light' | 'dark') => {
    setIsDark(scheme === 'dark');
    AsyncStorage.setItem('appTheme', scheme);
  };

  const colors = isDark ? darkColors : lightColors;

  return (
    <ThemeContext.Provider value={{ isDark, colors, toggleTheme, setScheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};