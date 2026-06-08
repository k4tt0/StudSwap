import { StyleSheet } from 'react-native';
import { colors } from './RegisterScreenStyle';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    backgroundColor: colors.background,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.textDark,
    textAlign: 'center',
    marginBottom: 32,
  },
  input: {
    marginBottom: 16,
    backgroundColor: colors.surface,
  },
  forgotPassword: {
    textAlign: 'right',
    color: colors.textDark,
    fontSize: 12,
    textDecorationLine: 'underline',
    marginBottom: 32,
  },
  button: {
    backgroundColor: colors.accent, // <-- Eco Green!
    borderRadius: 30,
    paddingVertical: 6,
  },
  footerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 40,
  },
  footerText: {
    color: colors.textDark,
    fontSize: 14,
  },
  linkText: {
    color: colors.accent, // <-- Eco Green!
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  }
});