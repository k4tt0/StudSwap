import { StyleSheet } from 'react-native';

export const colors = {
  background: '#faf6ee', // A lighter, cleaner Oatmeal
  textDark: '#2C362F',   // Deep Forest Charcoal (softer than pure black)
  accent: '#4A8B5B',     // Vibrant Sage/Emerald Green
  surface: '#FFFFFF',    // Pure white for floating cards
  navbar: '#1B241E',     // Dark Forest Green for the bottom menu
  muted: '#A0AAB2',      // Cool grey for inactive icons
  inputBorder: '#E0E0E0' // gri ibchis input
};

export const paperStyles = {
  buttonLabel: { 
    fontSize: 18, 
    fontWeight: 'bold' 
  }
};

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    backgroundColor: colors.background,
  },
  title: {
    fontSize: 36,
    fontWeight: '900', 
    color: colors.textDark,
    marginBottom: 8,
    letterSpacing: -1, 
  },
  subtitle: {
    fontSize: 16,
    color: colors.textDark,
    opacity: 0.7,
    marginBottom: 32,
    lineHeight: 24,
  },
  input: {
    marginBottom: 16,
    backgroundColor: colors.surface,
    borderColor: colors.textDark,
  },
  button: {
    marginTop: 20,
    backgroundColor: colors.textDark, 
    borderRadius: 8,
    paddingVertical: 8,
  },
});