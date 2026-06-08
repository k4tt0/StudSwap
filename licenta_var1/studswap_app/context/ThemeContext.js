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
}

export const darkTheme = {
  background: '#131314', // Deep dark grey
  textDark: '#F9F9F7',   // Text becomes light!
  accent: '#5E9C71',     // Slightly lighter green so it pops on dark backgrounds
  surface: '#1E1E1E',    // Dark grey cards
  navbar: '#000000',     // Pitch black navbar
  muted: '#666666',      // Dark grey for inactive stuff
  inputBorder: '#333333',
};

export const ThemeProvider = ({ children }) => {
  const systemColorScheme = useColorScheme(); // Detects phone's system theme
  const [themeMode, setThemeMode] = useState('system'); // 'system', 'light', 'dark'
  const [isThemeLoading, setIsThemeLoading] = useState(true);

  // Load the user's saved preference when the app starts
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

  // Function to let the user manually change the theme later in the Profile Settings
  const updateTheme = async (newMode) => {
    setThemeMode(newMode);
    await AsyncStorage.setItem('appTheme', newMode);
  };

  // Figure out which colors to actually show right now
  const isDarkMode = themeMode === 'system' ? systemColorScheme === 'dark' : themeMode === 'dark';
  const colors = isDarkMode ? darkTheme : lightTheme;

  if (isThemeLoading) return null; // Don't render until we know the theme

  return (
    <ThemeContext.Provider value={{ colors, isDarkMode, themeMode, updateTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Custom hook to easily grab colors in any screen
export const useTheme = () => useContext(ThemeContext);