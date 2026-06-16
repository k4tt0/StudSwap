import { StyleSheet } from 'react-native';

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
    top: -5, 
    right: 10, 
    backgroundColor: '#FFF', 
    borderRadius: 12 
  },
  addImageBtn: { 
    width: 120, 
    height: 120, 
    borderRadius: 12, 
    borderWidth: 1, 
    borderStyle: 'dashed', 
    justifyContent: 'center', 
    alignItems: 'center', 
    marginRight: 20,
    backgroundColor: colors.surface, 
    borderColor: colors.inputBorder 
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
  inputBox: { 
    borderWidth: 1, 
    borderRadius: 12, 
    paddingHorizontal: 16, 
    height: 50, 
    fontSize: 16,
    borderColor: colors.inputBorder, 
    color: colors.textDark, 
    backgroundColor: colors.surface 
  },
  textArea: { 
    height: 100, 
    paddingTop: 12 
  },
  dropdownContainer: { 
    marginTop: 16, 
    position: 'relative' 
  },
  optionsBox: { 
    borderWidth: 1, 
    borderRadius: 12, 
    marginTop: 4, 
    paddingVertical: 4,
    backgroundColor: colors.surface, 
    borderColor: colors.inputBorder 
  },
  optionItem: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    paddingVertical: 12, 
    paddingHorizontal: 16 
  },
  optionText: {
    color: colors.textDark 
  },
  floatingFooter: { 
    position: 'absolute', 
    bottom: 0, 
    width: '100%', 
    padding: 20, 
    paddingBottom: 40, 
    borderTopWidth: 1,
    backgroundColor: colors.background, 
    borderTopColor: colors.inputBorder,
    zIndex: 999,
    elevation: 10,
  },
  publishBtn: { 
    height: 56, 
    borderRadius: 28, 
    justifyContent: 'center', 
    alignItems: 'center', 
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 4 }, 
    shadowOpacity: 0.2, 
    shadowRadius: 5, 
    elevation: 5,
    backgroundColor: colors.textDark
  },
  publishBtnText: { 
    color: '#FFF', 
    fontSize: 16, 
    fontWeight: '700' 
  }
});