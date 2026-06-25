import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL } from '../firebaseConfig';

export const useSettings = (navigation) => {
  const [account, setAccount] = useState({ email: '', university: '', city: '' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAccount = async () => {
      try {
        const userId = await AsyncStorage.getItem('userId');
        if (!userId) return setLoading(false);
        const res = await fetch(`${API_BASE_URL}/api/users/${userId}`);
        if (res.ok) {
          const data = await res.json();
          setAccount({
            email: data.email || '',
            university: data.university || '',
            city: data.city || '',
          });
        }
      } catch (e) {
        console.error('Error loading account:', e);
      } finally {
        setLoading(false);
      }
    };
    loadAccount();
  }, []);

 const handleLogout = async (navigation) => {
    try {
      await AsyncStorage.removeItem('userId');
      await AsyncStorage.removeItem('userToken');
      await AsyncStorage.removeItem('rememberUser');
      navigation.reset({ index: 0, routes: [{ name: 'Start' }] });
    } catch (e) {
      throw e;
    }
  };

  return { account, loading, handleLogout };
};