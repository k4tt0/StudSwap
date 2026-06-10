import { StyleSheet } from "react-native";

export const getVerifyStyles = (colors) => StyleSheet.create({
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.textDark,
    textAlign: 'center',
    marginBottom: 24,
    letterSpacing: -1,
  },
  description: {
    fontSize: 16,
    color: colors.textDark,
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 20,
  },
  resendContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 32,
  },
  resendText: {
    color: colors.textDark,
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  }
});