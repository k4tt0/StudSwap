import { StyleSheet, Platform } from 'react-native';

export const getChatRoomStyles = (colors) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 50,
    paddingBottom: 12,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: colors.inputBorder,
    backgroundColor: colors.surface,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.textDark,
  },
  listingHeaderCard: {
    flexDirection: 'row',
    backgroundColor: colors.surface, 
    padding: 16,
    marginHorizontal: 15,
    marginTop: 12,
    marginBottom: 5,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.inputBorder,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  listingImageLeft: {
    width: 65,
    height: 65,
    borderRadius: 10,
    resizeMode: 'cover',
    marginRight: 15, 
  },
  listingDetailsRight: {
    flex: 1,
    justifyContent: 'center',
  },
  listingTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.textDark, 
    marginBottom: 4,
  },
  listingPrice: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.accent,
  },
  messageWrapper: {
    marginBottom: 12,
    maxWidth: '75%',
  },
  myMessageWrapper: {
    alignSelf: 'flex-end',
  },
  otherMessageWrapper: {
    alignSelf: 'flex-start',
  },
  messageBubble: {
    padding: 14,
    borderRadius: 20,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
  },
  chatImage: {
    width: 220, 
    height: 280, 
    borderRadius: 16, 
    resizeMode: 'cover'
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 14, 
    borderTopWidth: 1,
    borderTopColor: colors.inputBorder,
    backgroundColor: colors.surface, 
    paddingBottom: Platform.OS === 'ios' ? 30 : 14,
  },
  iconButtonsGroup: {
    flexDirection: 'row',
    gap: 14,
    marginRight: 10,
    alignItems: 'center',
  },
  actionIconBtn: {
    padding: 6,
  },
  inputFieldWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: colors.inputBorder,
    backgroundColor: colors.background, 
    paddingHorizontal: 14,
    minHeight: 45, 
    maxHeight: 100,
  },
  input: {
    flex: 1,
    paddingVertical: 8,
    fontSize: 15,
    color: colors.textDark,
  },
  sendButton: {
    marginLeft: 8,
    padding: 4,
  },

  offerTitle: {
    fontWeight: 'bold', 
    fontSize: 16, 
    marginBottom: 5
  },
  offerActionsContainer: {
    flexDirection: 'row', 
    gap: 10, 
    marginTop: 10
  },
  offerAcceptBtn: {
    backgroundColor: colors.accent, 
    padding: 8, 
    borderRadius: 8, 
    flex: 1, 
    alignItems: 'center'
  },
  offerDeclineBtn: {
    backgroundColor: '#E63946', 
    padding: 8, 
    borderRadius: 8, 
    flex: 1, 
    alignItems: 'center'
  },
  offerBtnText: {
    color: '#FFF', 
    fontWeight: 'bold'
  },
  offerStatusAccepted: {
    fontWeight: 'bold', 
    marginTop: 5
  },
  offerStatusDeclined: {
    fontWeight: 'bold', 
    marginTop: 5
  },

  modalOverlay: {
    flex: 1, 
    backgroundColor: 'rgba(0,0,0,0.6)', 
    justifyContent: 'center', 
    alignItems: 'center', 
    padding: 20
  },
  modalContent: {
    backgroundColor: colors.surface, 
    width: '100%', 
    borderRadius: 16, 
    padding: 25
  },
  modalTitle: {
    fontSize: 20, 
    fontWeight: 'bold', 
    color: colors.textDark, 
    marginBottom: 10
  },
  modalSubtitle: {
    color: colors.muted, 
    marginBottom: 20, 
    fontSize: 16
  },
  modalInput: {
    backgroundColor: colors.background, 
    borderWidth: 1, 
    borderColor: colors.inputBorder, 
    borderRadius: 12, 
    padding: 15, 
    fontSize: 18, 
    color: colors.textDark, 
    marginBottom: 25
  },
  modalButtonsRow: {
    flexDirection: 'row', 
    justifyContent: 'flex-end', 
    gap: 15
  },
  modalCancelBtn: {
    padding: 12
  },
  modalCancelText: {
    color: colors.muted, 
    fontWeight: 'bold', 
    fontSize: 16
  },
  modalSubmitBtn: {
    backgroundColor: colors.accent, 
    paddingVertical: 12, 
    paddingHorizontal: 25, 
    borderRadius: 12
  },
  modalSubmitText: {
    color: '#FFF', 
    fontWeight: 'bold', 
    fontSize: 16
  }
});