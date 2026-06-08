import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

// import { colors } from '../styles/RegisterScreenStyle';
// import { styles } from '../styles/StartPageStyle'; 

import { useTheme } from '../context/ThemeContext';
import { getStartStyles } from '../styles/StartPageStyle';

export default function StartScreen({ navigation }) {
  const { colors, isDarkMode, updateTheme } = useTheme();
  const styles = getStartStyles(colors);

  return (
    <View style={styles.container}>
      
      <TouchableOpacity 
        style={styles.themeToggle}
        onPress={() => updateTheme(isDarkMode ? 'light' : 'dark')}
        activeOpacity={0.7}
      >
        <MaterialCommunityIcons 
          name={isDarkMode ? "weather-sunny" : "weather-night"} 
          size={24} 
          color={colors.textDark} 
        />
      </TouchableOpacity>

      <View style={styles.centerContent}>
        <MaterialCommunityIcons name="school-outline" size={100} color={colors.textDark} />
        <Text style={styles.title}>Welcome to StudSwap!</Text>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={styles.buttonOutline} 
          onPress={() => navigation.navigate('Login')}
          activeOpacity={0.7}
        >
          <Text style={[styles.buttonTextDark, { color: colors.textDark }]} numberOfLines={1} >Log In</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.buttonSolid} 
          onPress={() => navigation.navigate('Register')}
          activeOpacity={0.7}
        >
          <Text style={[styles.buttonTextLight, { color: '#FFF' }]} numberOfLines={1}>Sign Up</Text>
        </TouchableOpacity>
      </View>

    </View>
  );
}

// export default function StartScreen({ navigation }) {
//   return (
//     <View style={styles.container}>
      
//       <View style={styles.centerContent}>
//         <MaterialCommunityIcons name="school-outline" size={100} color={colors.textDark} />
//         <Text style={styles.title}>Welcome to StudSwap!</Text>
//       </View>

//       <View style={styles.buttonContainer}>
//         <TouchableOpacity 
//           style={styles.buttonOutline} 
//           onPress={() => navigation.navigate('Login')}
//           activeOpacity={0.7}
//         >
//           <Text style={styles.buttonTextDark}>Log In</Text>
//         </TouchableOpacity>

//         <TouchableOpacity 
//           style={styles.buttonSolid} 
//           onPress={() => navigation.navigate('Register')}
//           activeOpacity={0.7}
//         >
//           <Text style={styles.buttonTextDark}>Sign Up</Text>
//         </TouchableOpacity>
//       </View>

//     </View>
//   );
// }