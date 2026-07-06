import { StyleSheet, Dimensions } from 'react-native';

const { height } = Dimensions.get('window');

export const getProfileStyles = (colors) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background, 
  },

 profileCardBackground: {
    display: 'none', 
  },

  headerRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 5,
    zIndex: 10,
  },
  settingsBtn: {
    padding: 8,
  },

  // LIST CONTAINER
  listContainer: {
    paddingHorizontal: 20,
    paddingBottom: 130,
    backgroundColor: colors.profileCardBg,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    marginTop: 10,
    paddingTop: 10,
  },

  // AVATAR SECTION
  profileSection: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 25,
  },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4, 
    borderColor: colors.background, 
    marginBottom: 12,
    position: 'relative',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  avatarImage: {
    width: '100%',
    height: '100%',
    borderRadius: 50,
    resizeMode: 'cover',
  },
  avatarInitials: {
    fontSize: 36,
    fontWeight: 'bold',
    color: colors.muted,
  },
  avatarCameraIcon: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    backgroundColor: colors.surface,
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.background,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
  },
  nameText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.textDark,
    marginBottom: 4,
    textAlign: 'center',
  },
  locationText: {
    fontSize: 13,
    color: colors.muted,
    fontWeight: '500',
    textAlign: 'center',
    lineHeight: 18,
    paddingHorizontal: 20,
  },
  listingsHeading: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.textDark,
    marginBottom: 14,
    marginTop: 4,
  },

  listingCard: {
    backgroundColor: colors.surface,
    borderRadius: 14,
    padding: 10,
    marginBottom: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 5,
    elevation: 2,
  },
  listingImage: {
    width: '100%',
    height: 120,
    borderRadius: 10,
    backgroundColor: colors.background,
    marginBottom: 10,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  typeTag: {
    position: 'absolute',
    top: 8,
    left: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  typeTagText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 11,
  },
  listingTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: colors.textDark,
    marginBottom: 2,
  },
  listingPrice: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.accent,
    marginBottom: 6,
  },
  listingDesc: {
    fontSize: 13,
    color: colors.muted,
    marginBottom: 10,
    lineHeight: 18,
  },
  cardActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
  },
  actionBtn: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
  },
  editBtn: {
    borderColor: colors.inputBorder,
    backgroundColor: colors.background,
  },
  editText: {
    color: colors.textDark,
    fontWeight: 'bold',
  },
  deleteBtn: {
    borderColor: '#FFEBEB',
    backgroundColor: '#FFF5F5',
  },
  deleteText: {
    color: '#E63946',
    fontWeight: 'bold',
  },
  emptyContainer: {
    alignItems: 'center',
    marginTop: 40,
  },
  emptyText: {
    color: colors.muted,
    marginTop: 10,
    fontSize: 16,
  }
});