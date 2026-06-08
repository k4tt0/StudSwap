import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { styles } from '../styles/StartPageStyle';
import { colors } from '../styles/RegisterScreenStyle';

export default function StartScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <View style={{ width: 120, height: 120, borderRadius: 60, backgroundColor: colors.accent }} />
      </View>
      <View style={{ width: 220, height: 36, marginBottom: 48, borderRadius: 18, backgroundColor: colors.textDark, opacity: 0.12 }} />

      <TouchableOpacity
        style={styles.buttonOutline}
        onPress={() => navigation.navigate('Login')}
        activeOpacity={0.8}
      >
        <View style={{ width: 64, height: 16, borderRadius: 8, backgroundColor: colors.accent }} />
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.buttonSolid}
        onPress={() => navigation.navigate('Register')}
        activeOpacity={0.8}
      >
        <View style={{ width: 74, height: 16, borderRadius: 8, backgroundColor: colors.surface }} />
      </TouchableOpacity>

    </View>
  );
}