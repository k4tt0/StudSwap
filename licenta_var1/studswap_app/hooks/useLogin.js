import { useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL } from '../firebaseConfig';

export const useLogin = (navigation) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

    const handleLogin = async () => {
    if (!email || !password) {
      return {
        type: 'error',
        title: 'Error',
        message: 'Please enter both email and password.',
      };
    }

    setLoading(true);
    try {
      const response = await fetch(API_BASE_URL + '/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        await AsyncStorage.setItem('userId', data.userId);
        await AsyncStorage.setItem('userToken', data.token);

        if (rememberMe) {
          await AsyncStorage.setItem('rememberUser', 'true');
        } else {
          await AsyncStorage.removeItem('rememberUser');
        }

        navigation.navigate('Home');
        return { type: 'success' };
      }

      return {
        type: 'error',
        title: 'Login Failed',
        message: data.error || 'Invalid credentials',
      };
    } catch (error) {
      console.error('Login Error:', error);
      return {
        type: 'error',
        title: 'Network Error',
        message: 'Could not connect to the server.',
      };
    } finally {
      setLoading(false);
    }
  };

  return {
    email,
    setEmail,
    password,
    setPassword,
    loading,
    showPassword,
    setShowPassword,
    rememberMe,
    setRememberMe,
    handleLogin,
  };
};