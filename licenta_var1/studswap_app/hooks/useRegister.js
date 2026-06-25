import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL } from '../firebaseConfig';

export const useRegister = () => {
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [usernameStatus, setUsernameStatus] = useState('');

  useEffect(() => {
    const checkUsername = async () => {
      if (displayName.trim().length < 3) {
        setUsernameStatus('');
        return;
      }
      
      setUsernameStatus('checking');
      try {
        const response = await fetch(`${API_BASE_URL}/api/auth/check-username?username=${encodeURIComponent(displayName.trim())}`);
        if (response.ok) {
          const data = await response.json();
          setUsernameStatus(data.available ? 'available' : 'taken');
        }
      } catch (error) {
        setUsernameStatus(''); 
      }
    };

    const delayDebounceFn = setTimeout(() => {
      checkUsername();
    }, 250);

    return () => clearTimeout(delayDebounceFn);
  }, [displayName]);

  const handleRegister = async () => {
    if (!email || !password || !displayName || !confirmPassword) {
      return { type: 'error', title: 'Error', message: 'Please fill in all fields.' };
    }
    if (password !== confirmPassword) {
      return { type: 'error', title: 'Error', message: 'Passwords do not match.' };
    }
    if (usernameStatus === 'taken') {
      return { type: 'error', title: 'Invalid Username', message: 'Please choose a different username.' };
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email: email.trim().toLowerCase(), 
          password, 
          displayName: displayName.trim() 
        }),
      });

      const data = await response.json();

      if (response.ok) {
        await AsyncStorage.setItem('userId', data.userId);
        return { 
          type: 'success', 
          title: 'Welcome!', 
          message: 'Account created successfully!', 
          redirect: true 
        };
      } else {
        return { type: 'error', title: 'Registration Failed', message: data.error || 'Something went wrong.' };
      }
    } catch (error) {
      console.error("Registration Error:", error);
      return { type: 'error', title: 'Network Error', message: 'Could not connect to the server.' };
    } finally {
      setLoading(false);
    }
  };

  return {
    displayName, setDisplayName,
    email, setEmail,
    password, setPassword,
    confirmPassword, setConfirmPassword,
    loading,
    showPassword, setShowPassword,
    showConfirmPassword, setShowConfirmPassword,
    usernameStatus,
    handleRegister
  };
};