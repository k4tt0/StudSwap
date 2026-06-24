import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

export const getMessagesStyles = (colors) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  headerContainer: {
    paddingTop: 60,
    backgroundColor: colors.surface,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: colors.textDark,
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  twitterTabBar: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: colors.inputBorder,
  },
  twitterTab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 14,
    position: 'relative',
  },
  twitterTabText: {
    fontSize: 15,
    fontWeight: 'bold',
  },
  activeIndicator: {
    position: 'absolute',
    bottom: 0,
    width: 80,
    height: 3,
    borderRadius: 2,
    backgroundColor: colors.accent,
  },
  viewPager: {
    width: width,
  },
  feedContainer: {
    width: width,
    paddingHorizontal: 20,
    paddingTop: 15,
    paddingBottom: 110,
  },
  chatCard: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    padding: 12,
    borderRadius: 16,
    marginBottom: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.inputBorder,
  },
  listingAvatar: {
    width: 52,
    height: 52,
    borderRadius: 12,
    backgroundColor: colors.background,
    marginRight: 15,
  },
  chatInfo: {
    flex: 1,
  },
  chatName: {
    fontSize: 15,
    fontWeight: 'bold',
    color: colors.textDark,
    marginBottom: 4,
  },
  lastMessage: {
    fontSize: 13,
    color: colors.muted,
  },
  timeText: {
    fontSize: 12,
    color: colors.muted,
    marginLeft: 10,
  },
  emptyContainer: {
    flex: 1,
    width: width,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100,
  },
  emptyText: {
    marginTop: 12,
    color: colors.muted,
    fontSize: 15,
  }
});