import React, { useState } from 'react';
import { View, Alert, Text, TextInput, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { styles, colors } from '../styles/RegisterScreenStyle'; 
import { API_BASE_URL } from '../firebaseConfig';

export default function RegisterScreen({ navigation }) {
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

 

  const handleRegister = async () => {
    if (!email || !password || !displayName) {
      Alert.alert("Error", "Please fill in all the boxes.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          password: password,
          displayName: displayName.trim(),
          // 'city' a dispărut! Backend-ul se ocupă de asta acum.
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Store user ID in AsyncStorage after successful registration
        await AsyncStorage.setItem('userId', data.userId);
        
        Alert.alert("Success!", `Your account has been created! City: ${data.city}`);
        navigation.navigate('Home'); 
      } else {
        Alert.alert("Registration Failed", data.error || "Something went wrong");
      }
    } catch (error) {
      Alert.alert("Network Error", "Could not connect to the server.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create an account</Text>
      
      
      <TextInput
        value={displayName}
        onChangeText={setDisplayName}
        placeholder="Name"
        placeholderTextColor={colors.muted}
        style={styles.input}
        autoCorrect={false}
      />
      
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

      <TouchableOpacity
        onPress={handleRegister}
        disabled={loading}
        style={[styles.button, { backgroundColor: colors.accent, borderRadius: 30, marginTop: 24 }, loading && { opacity: 0.75 }]}
        activeOpacity={0.85}
      >
        <Text style={{ color: '#FFF', fontSize: 18, fontWeight: 'bold', textAlign: 'center' }}>
          {loading ? 'CREATING ACCOUNT...' : 'SIGN UP'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}