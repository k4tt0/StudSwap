import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

export const getListingDetailsStyles = (colors) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  imageCarouselContainer: {
    width: width,
    height: width * 1.1,
    backgroundColor: colors.surface,
    position: 'relative',
  },
  image: {
    width: width,
    height: '100%',
    resizeMode: 'cover',
  },
  paginationContainer: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: 15,
    alignSelf: 'center',
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
  },
  activeDot: {
    backgroundColor: '#FFF',
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 5,
  },
  title: {
    fontSize: 20, 
    fontWeight: 'bold',
    color: colors.textDark,
    flex: 1,
    marginRight: 10,
  },
  price: {
    fontSize: 18, 
    fontWeight: 'bold',
    color: colors.accent,
  },
  divider: {
    height: 1,
    backgroundColor: colors.inputBorder,
    marginVertical: 15,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
    marginBottom: 10, 
  },
  metaText: {
    fontSize: 16, 
    color: colors.textDark,
    fontWeight: '500',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.textDark,
    marginBottom: 10,
  },
  description: {
    fontSize: 15,
    color: colors.textDark,
    lineHeight: 24,
  },
  sellerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    padding: 15,
    backgroundColor: colors.surface,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: colors.inputBorder,
  },
  sellerAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  sellerInitials: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  sellerName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.textDark,
  },
  
  carouselSection: {
    marginTop: 30,
  },
  carouselTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.textDark,
    marginBottom: 15,
  },
  miniCard: {
    width: 140,
    marginRight: 15,
    backgroundColor: colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.inputBorder,
    overflow: 'hidden',
  },
  miniCardImage: {
    width: '100%',
    height: 120,
    resizeMode: 'cover',
  },
  miniCardInfo: {
    padding: 10,
  },
  miniCardTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.textDark,
  },
  miniCardPrice: {
    fontSize: 14,
    color: colors.accent,
    marginTop: 4,
    fontWeight: 'bold'
  },
  
  footer: {
    padding: 20,
    backgroundColor: colors.background,
    borderTopWidth: 1,
    borderColor: colors.inputBorder,
    paddingBottom: 30,
  },
  contactBtn: {
    backgroundColor: colors.accent,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 16,
    borderRadius: 30,
    gap: 10,
  },
  contactBtnText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  }
});