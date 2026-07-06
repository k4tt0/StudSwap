import { StyleSheet, Platform } from 'react-native';

export const getCreateListingStyles = (colors) => StyleSheet.create({
  header: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between', 
    paddingTop: 60, 
    paddingBottom: 15, 
    paddingHorizontal: 20, 
    borderBottomWidth: 1,
    borderBottomColor: colors.inputBorder 
  },
  headerTitle: { 
    fontSize: 18, 
    fontWeight: '600',
    color: colors.textDark 
  },
  carouselContainer: { 
    paddingVertical: 20, 
    paddingLeft: 20 
  },
  carouselImage: { 
    width: 120, 
    height: 120, 
    borderRadius: 12, 
    marginRight: 15 
  },
  imageWrapper: { 
    position: 'relative' 
  },
  removeIcon: { 
    position: 'absolute', 
    top: 5, 
    right: 20, 
    backgroundColor: 'rgba(0,0,0,0.6)', 
    borderRadius: 15,
    padding: 2,
  },
  addImageBtn: { 
    width: 120, 
    height: 120, 
    borderRadius: 12, 
    borderWidth: 2, 
    borderStyle: 'dashed', 
    justifyContent: 'center', 
    alignItems: 'center', 
    marginRight: 20,
    backgroundColor: colors.surface, 
    borderColor: colors.muted 
  },
  formContainer: { 
    paddingHorizontal: 20 
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    marginLeft: 4,
    color: colors.textDark
  },
  errorText: {
    color: '#E63946',
    fontSize: 12,
    marginTop: 6,
    marginLeft: 4,
  },
  inputBox: { 
    borderWidth: 1, 
    borderRadius: 12, 
    paddingHorizontal: 16, 
    height: 50, 
    fontSize: 16,
    borderColor: colors.inputBorder, 
    color: colors.textDark, 
    backgroundColor: colors.surface,
    flexDirection: 'row', 
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  textArea: { 
    height: 100, 
    paddingTop: 12,
    alignItems: 'flex-start' 
  },
  dropdownContainer: { 
    marginTop: 16, 
  },
  bottomFooter: { 
    width: '100%', 
    padding: 20, 
    paddingBottom: Platform.OS === 'ios' ? 30 : 20, 
    backgroundColor: colors.background, 
    borderTopWidth: 1,
    borderTopColor: colors.inputBorder,
  },
  publishBtn: { 
    height: 56, 
    borderRadius: 28, 
    justifyContent: 'center', 
    alignItems: 'center', 
    shadowColor: colors.accent, 
    shadowOffset: { width: 0, height: 4 }, 
    shadowOpacity: 0.3, 
    shadowRadius: 5, 
    elevation: 5,
    backgroundColor: colors.accent 
  },
  publishBtnText: { 
    color: '#FFF', 
    fontSize: 16, 
    fontWeight: '700' 
  },

  reorderBar: {
    position: 'absolute',
    bottom: 5,
    left: 0,
    right: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 5,
  },
  reorderBtn: {
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  reorderBtnDisabled: {
    opacity: 0.25,
  },
  coverBadge: {
    position: 'absolute',
    top: 5,
    left: 5,
    backgroundColor: colors.accent,
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  coverBadgeText: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: '700',
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 25,
    maxHeight: '50%', 
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  modalOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 15,
    marginBottom: 10,
  }
});