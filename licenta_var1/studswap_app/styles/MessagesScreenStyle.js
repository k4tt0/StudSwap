import { StyleSheet } from 'react-native';

export const getMessagesStyles = (colors) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  headerContainer: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.textDark,
  },
  feedContainer: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  chatCard: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    padding: 15,
    borderRadius: 16,
    marginBottom: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.inputBorder,
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  avatarText: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
  chatInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  chatName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.textDark,
    marginBottom: 4,
  },
  lastMessage: {
    fontSize: 14,
    color: colors.muted,
  },
  timeText: {
    fontSize: 12,
    color: colors.muted,
    marginLeft: 10,
    alignSelf: 'flex-start',
    marginTop: 2,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    marginTop: 16,
    color: colors.muted,
    fontSize: 16,
  }
});