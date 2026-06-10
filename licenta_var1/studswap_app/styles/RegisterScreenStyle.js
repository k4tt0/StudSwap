import { StyleSheet } from 'react-native';

// We create a function to generate global styles dynamically
export const getGlobalStyles = (colors) => StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    backgroundColor: colors.background,
  },
  backButton: {
    position: 'absolute',
    top: 60,
    left: 24,
    zIndex: 10,
    width: 40, // Force a specific width
    height: 40, // Force a specific height
    alignItems: 'center', // Center the icon
    justifyContent: 'center', // Center the icon
    backgroundColor: colors.surface,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.inputBorder,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.inputBorder,
    borderRadius: 12, 
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  inputField: {
    flex: 1,
    paddingVertical: 14,
    fontSize: 16,
    color: colors.textDark,
  },
  buttonSolid: {
    backgroundColor: colors.accent,
    borderRadius: 30, 
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  buttonTextSolid: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

// Function for specific Register styles
export const getRegisterStyles = (colors) => StyleSheet.create({
  registerScrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    backgroundColor: colors.background, 
  },
  registerInnerContainer: {
    padding: 24,
    backgroundColor: colors.background,
  },
  registerTitle: {
    fontSize: 32,
    fontWeight: '800',
    color: colors.textDark,
    textAlign: 'center',
    marginBottom: 40,
    letterSpacing: -1,
  },
  registerLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textDark,
    marginBottom: 8,
    marginLeft: 4,
  },
  registerButtonMargin: {
    marginTop: 24,
  }
});

// import { StyleSheet } from 'react-native';

// export const colors = {
//   background: '#F9F9F7', 
//   textDark: '#1A1A1A',   
//   accent: '#4C7D5B',     
//   surface: '#FFFFFF',    
//   navbar: '#1B241E',     
//   muted: '#A0AAB2',      
//   inputBorder: '#E0E0E0',
// };

// export const styles = StyleSheet.create({
//   // --- GLOBALE (Folosite peste tot) ---
//   container: {
//     flex: 1,
//     padding: 24,
//     justifyContent: 'center',
//     backgroundColor: colors.background,
//   },
//   input: {
//     backgroundColor: colors.surface,
//     borderWidth: 1,
//     borderColor: colors.inputBorder,
//     borderRadius: 12, 
//     paddingHorizontal: 16,
//     paddingVertical: 14,
//     fontSize: 16,
//     marginBottom: 16,
//     color: colors.textDark,
//   },
//   buttonSolid: {
//     backgroundColor: colors.accent,
//     borderRadius: 30, 
//     paddingVertical: 14,
//     alignItems: 'center',
//     marginTop: 8,
//   },
//   buttonTextSolid: {
//     color: '#FFF',
//     fontSize: 16,
//     fontWeight: 'bold',
//   },
  
//   // --- SPECIFICE REGISTER SCREEN ---
//   registerScrollContainer: {
//     flexGrow: 1,
//     justifyContent: 'center',
//     backgroundColor: colors.background,
//   },
//   registerInnerContainer: {
//     padding: 24,
//     backgroundColor: colors.background,
//   },
//   registerTitle: {
//     fontSize: 32,
//     fontWeight: '800',
//     color: colors.textDark,
//     marginBottom: 40,
//     letterSpacing: -1,
//   },
//   registerLabel: {
//     fontSize: 14,
//     fontWeight: '600',
//     color: colors.textDark,
//     marginBottom: 8,
//     marginLeft: 4,
//   },
//   registerButtonMargin: {
//     marginTop: 24,
//   }
// });

// export const paperStyles = {
//   buttonLabel: { 
//     fontSize: 18, 
//     fontWeight: 'bold' 
//   }
// };

// export const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 24,
//     justifyContent: 'center',
//     backgroundColor: colors.background,
//   },
//   title: {
//     fontSize: 36,
//     fontWeight: '900', 
//     color: colors.textDark,
//     marginBottom: 8,
//     letterSpacing: -1, 
//   },
//   subtitle: {
//     fontSize: 16,
//     color: colors.textDark,
//     opacity: 0.7,
//     marginBottom: 32,
//     lineHeight: 24,
//   },
//   input: {
//     marginBottom: 16,
//     backgroundColor: colors.surface,
//     borderColor: colors.textDark,
//   },
//   button: {
//     marginTop: 20,
//     backgroundColor: colors.textDark, 
//     borderRadius: 8,
//     paddingVertical: 8,
//   },
// });