import { StyleSheet } from 'react-native';

export const getHomeStyles = (colors) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  // --- HEADER & SEARCH ---
  headerContainer: {
    paddingHorizontal: 20,
    paddingTop: 50, 
    paddingBottom: 10,
  },
  locationPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.inputBorder, // Dynamic background
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 16,
  },
  locationText: {
    fontSize: 12,
    color: colors.textDark,
    marginLeft: 4,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: colors.inputBorder,
    marginBottom: 16,
  },
  searchInput: {
    color: colors.textDark,
    marginLeft: 8,
    fontSize: 16,
    flex: 1,
  },
  // --- FILTERS ---
  filtersContainer: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  filterPill: {
    borderWidth: 1,
    borderColor: colors.inputBorder,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 6,
    marginRight: 10,
    backgroundColor: colors.surface,
    flexDirection: 'row',
    alignItems: 'center',
  },
  filterPillActive: {
    backgroundColor: colors.accent,
    borderColor: colors.accent,
  },
  filterText: {
    color: colors.textDark,
    fontSize: 14,
  },
  filterTextActive: {
    color: '#FFF', // White text always looks good on the solid green active pill
    fontWeight: 'bold',
  },
  // --- FEED CARDS ---
  feedContainer: {
    paddingHorizontal: 20,
    paddingBottom: 100, 
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    marginBottom: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3, 
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.muted,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    color: colors.surface,
    fontWeight: 'bold',
  },
  headerTextContainer: {
    flex: 1,
  },
  headerTitle: {
    width: '60%',
    height: 10,
    backgroundColor: colors.inputBorder,
    borderRadius: 5,
    marginBottom: 6,
  },
  headerSubtitle: {
    width: '80%',
    height: 6,
    backgroundColor: colors.inputBorder,
    borderRadius: 3,
  },
  imagePlaceholder: {
    width: '100%',
    height: 250,
    backgroundColor: colors.inputBorder, // Adapts to dark mode
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardFooter: {
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  footerLines: {
    flex: 1,
  },
  footerLineLong: {
    width: '70%',
    height: 8,
    backgroundColor: colors.inputBorder,
    borderRadius: 4,
    marginBottom: 6,
  },
  footerLineShort: {
    width: '40%',
    height: 8,
    backgroundColor: colors.inputBorder,
    borderRadius: 4,
  },
});