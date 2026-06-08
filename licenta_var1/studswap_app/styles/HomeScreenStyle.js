import { StyleSheet } from 'react-native';
import { colors } from './RegisterScreenStyle';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background, // Oatmeal
  },
  // --- HEADER & SEARCH ---
  headerContainer: {
    paddingHorizontal: 20,
    paddingTop: 50, // Spațiu pentru bara de status a telefonului
    paddingBottom: 10,
  },
  locationPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EAE6DF',
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
    borderColor: '#E0E0E0',
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
    borderColor: '#CCC',
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
    color: '#FFF',
    fontWeight: 'bold',
  },
  // --- FEED CARDS ---
  feedContainer: {
    paddingHorizontal: 20,
    paddingBottom: 100, // Lăsăm spațiu ca să nu fie acoperite de meniul de jos
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    marginBottom: 20,
    overflow: 'hidden',
    // --- REMOVED BORDERS, ADDED SHADOWS ---
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3, // This makes the shadow work on Android!
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
    backgroundColor: '#4A4A4A',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
  headerTextContainer: {
    flex: 1,
  },
  headerTitle: {
    width: '60%',
    height: 10,
    backgroundColor: '#333',
    borderRadius: 5,
    marginBottom: 6,
  },
  headerSubtitle: {
    width: '80%',
    height: 6,
    backgroundColor: '#333',
    borderRadius: 3,
  },
  imagePlaceholder: {
    width: '100%',
    height: 250,
    backgroundColor: '#E0E0E0',
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
    backgroundColor: '#333',
    borderRadius: 4,
    marginBottom: 6,
  },
  footerLineShort: {
    width: '40%',
    height: 8,
    backgroundColor: '#333',
    borderRadius: 4,
  },
  cardButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  cardButtonOutline: {
    width: 50,
    height: 24,
    borderWidth: 1,
    borderColor: '#CCC',
    borderRadius: 12,
  },
  cardButtonSolid: {
    width: 50,
    height: 24,
    backgroundColor: '#000',
    borderRadius: 12,
  },
  // --- CUSTOM BOTTOM NAVIGATION ---
  bottomNavContainer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: 70,
    backgroundColor: '#3B2A27', // Culoarea închisă din wireframe
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  navIcon: {
    padding: 10,
  },
  // --- DIAMOND FAB (Butonul central) ---
  fabWrapper: {
    position: 'absolute',
    bottom: 30, // Îl ridicăm peste bara de navigație
    alignSelf: 'center',
    width: 80,
    height: 80,
    backgroundColor: colors.background, // Falsificăm efectul de "cutout" cu un fundal de aceeași culoare ca ecranul
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  fabDiamond: {
    width: 56,
    height: 56,
    backgroundColor: '#FF6B6B', // Culoarea roz/coral
    borderRadius: 16,
    transform: [{ rotate: '45deg' }], // Aici creăm rombul!
    justifyContent: 'center',
    alignItems: 'center',
  },
  fabIcon: {
    transform: [{ rotate: '-45deg' }], // Rotim iconița înapoi ca să stea dreaptă
  }
});