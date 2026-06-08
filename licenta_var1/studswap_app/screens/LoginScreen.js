import React, { useState } from 'react';
import { View, Alert, TouchableOpacity, Text, TextInput } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { styles } from '../styles/LoginScreenStyle';
import { colors } from '../styles/RegisterScreenStyle'; 
import { API_BASE_URL } from '../firebaseConfig';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please enter both email and password.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          password: password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Store user ID and token in AsyncStorage
        await AsyncStorage.setItem('userId', data.userId);
        await AsyncStorage.setItem('userToken', data.token);
        
        Alert.alert("Success!", "You are logged in.");
        navigation.navigate('Home');
      } else {
        Alert.alert("Login Failed", data.error || "Invalid credentials");
      }
    } catch (error) {
      Alert.alert("Network Error", "Could not connect to the server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      
      <View style={styles.logoContainer}>
        <MaterialCommunityIcons name="school-outline" size={80} color={colors.textDark} />
      </View>

      <Text style={styles.title}>Log into your account</Text>

      <TextInput
        value={email}
        onChangeText={setEmail}
        placeholder="Student Email Address"
        placeholderTextColor={colors.muted}
        keyboardType="email-address"
        autoCapitalize="none"
        style={styles.input}
        autoCorrect={false}
      />
      
      <TextInput
        value={password}
        onChangeText={setPassword}
        placeholder="Password"
        placeholderTextColor={colors.muted}
        secureTextEntry
        style={styles.input}
      />

      <TouchableOpacity onPress={() => Alert.alert("WIP", "Forgot password coming soon!")}>
        <Text style={styles.forgotPassword}>Forgot password?</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={handleLogin}
        disabled={loading}
        style={[styles.button, loading && { opacity: 0.75 }]}
        activeOpacity={0.85}
      >
        <Text style={{ color: '#FFF', fontSize: 18, fontWeight: 'bold', textAlign: 'center' }}>
          {loading ? 'LOGGING IN...' : 'LOG IN'}
        </Text>
      </TouchableOpacity>

      {/* Partea de jos: Don't have an account? Sign up */}
      <View style={styles.footerContainer}>
        <Text style={styles.footerText}>Don't have an account? </Text>
        <TouchableOpacity onPress={() => navigation.navigate('Register')}>
          <Text style={styles.linkText}>Sign up</Text>
        </TouchableOpacity>
      </View>

    </View>
  );
}