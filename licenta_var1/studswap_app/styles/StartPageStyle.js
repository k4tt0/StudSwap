import { StyleSheet } from 'react-native';
import { colors } from './RegisterScreenStyle'; 

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  logoContainer: {
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: '900',
    color: colors.textDark,
    marginBottom: 48,
    letterSpacing: -0.5,
  },
  buttonOutline: {
    width: '100%',
    marginBottom: 16,
    borderColor: colors.accent, // Sage Green outline
    borderWidth: 2,
    borderRadius: 30,
  },
  buttonSolid: {
    width: '100%',
    backgroundColor: colors.accent, // Sage Green solid
    borderRadius: 30,
  },
  buttonLabelOutline: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.accent,
    paddingVertical: 6,
  },
  buttonLabelSolid: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.surface,
    paddingVertical: 6,
  }
});