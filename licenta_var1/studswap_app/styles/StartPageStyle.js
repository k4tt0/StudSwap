import { StyleSheet } from 'react-native';

export const getStartStyles = (colors) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background, // <-- Powered by Context!
    padding: 24,
    justifyContent: 'space-between', 
  },
  themeToggle: {
    position: 'absolute',
    top: 60, // Pushes it down past the phone's status bar
    right: 24,
    zIndex: 10,
    padding: 8,
    backgroundColor: colors.surface,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.inputBorder,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,    
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 30,
    fontWeight: '900',
    color: colors.textDark,
    marginTop: 24,
    letterSpacing: -1,
    textAlign: 'center'
  },
  buttonContainer: {
    marginBottom: 40,
    gap: 16, 
  },
  buttonOutline: {
    borderWidth: 1,
    borderColor: colors.textDark,
    borderRadius: 30,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  buttonTextDark: {
    color: colors.textDark,
    fontSize: 16,
    fontWeight: 'bold',
  },
  buttonSolid: {
    backgroundColor: colors.accent,
    borderRadius: 30,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  buttonTextLight: {
    color: colors.surface, 
    fontSize: 16,
    fontWeight: 'bold',
  }
});