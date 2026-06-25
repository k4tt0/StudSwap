import React, { createContext, useState, useEffect, useContext } from "react";
import { useColorScheme } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const ThemeContext = createContext();

export const lightTheme = {
    background: '#F9F9F7',
    textDark: '#1A1A1A',
    accent: '#4C7D5B',
    surface: '#FFFFFF',
    navbar: '#1B241E',
    muted: '#A0AAB2',
    inputBorder: '#E0E0E0',
    profileCardBg: '#EEF0E5', 
}

export const darkTheme = {
  background: '#131314', 
  textDark: '#F9F9F7',   
  accent: '#5E9C71',    
  surface: '#1E1E1E',   
  navbar: '#000000',     
  muted: '#666666',      
  inputBorder: '#333333',
  profileCardBg: '#2A2B2A',
};

export const ThemeProvider = ({ children }) => {
  const systemColorScheme = useColorScheme(); 
  const [themeMode, setThemeMode] = useState('system'); 
  const [isThemeLoading, setIsThemeLoading] = useState(true);

  useEffect(() => {
    const loadTheme = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem('appTheme');
        if (savedTheme) {
          setThemeMode(savedTheme);
        }
      } catch (error) {
        console.error("Failed to load theme", error);
      } finally {
        setIsThemeLoading(false);
      }
    };
    loadTheme();
  }, []);

  const updateTheme = async (newMode) => {
    setThemeMode(newMode);
    await AsyncStorage.setItem('appTheme', newMode);
  };

  const isDarkMode = themeMode === 'system' ? systemColorScheme === 'dark' : themeMode === 'dark';
  const colors = isDarkMode ? darkTheme : lightTheme;

  if (isThemeLoading) return null; 

  return (
    <ThemeContext.Provider value={{ colors, isDarkMode, themeMode, updateTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);