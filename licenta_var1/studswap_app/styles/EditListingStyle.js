import { StyleSheet } from 'react-native';

export const getEditListingStyles = (colors) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 60,
    paddingBottom: 15,
    paddingHorizontal: 20,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderColor: colors.inputBorder,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.textDark,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.textDark,
    marginBottom: 10,
    marginTop: 5,
  },
  input: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.inputBorder,
    borderRadius: 12,
    padding: 15,
    fontSize: 16,
    color: colors.textDark,
    marginBottom: 20,
  },
  textArea: {
    minHeight: 120,
    textAlignVertical: 'top',
  },
  pillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 25,
  },
  pill: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.inputBorder,
    backgroundColor: colors.surface,
  },
  pillActive: {
    backgroundColor: colors.accent,
    borderColor: colors.accent,
  },
  pillText: {
    color: colors.textDark,
    fontSize: 14,
  },
  pillTextActive: {
    color: '#FFF',
    fontWeight: 'bold',
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderColor: colors.inputBorder,
    backgroundColor: colors.surface,
  },
  updateBtn: {
    backgroundColor: colors.accent,
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: 'center',
  },
  updateBtnText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  }
});