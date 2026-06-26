import { useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL } from '../firebaseConfig';

export const useVerifyEmail = (navigation) => {
  const [checking, setChecking] = useState(false);

  const handleCheckVerification = async () => {
    setChecking(true);
    try {
      const userId = await AsyncStorage.getItem('userId');

      if (!userId) {
        navigation.navigate('Login');
        return { type: 'error', title: 'Error', message: 'User session lost. Please log in again.' };
      }

      const response = await fetch(`${API_BASE_URL}/api/auth/check-verification/${userId}`);
      const data = await response.json();

      if (data && data.emailVerified === true) {
        navigation.navigate('Home');
        return { type: 'success', title: 'Success!', message: 'Your email is verified. Welcome to StudSwap!' };
      } else {
        return {
          type: 'error',
          title: 'Not verified yet',
          message: 'Please check your student email inbox (and spam folder) and click the verification link.',
        };
      }
    } catch (error) {
      console.error("Verification Check Error:", error);
      return { type: 'error', title: 'Error', message: 'Could not check verification status.' };
    } finally {
      setChecking(false);
    }
  };

  const handleResendEmail = () => {
    return { type: 'error', title: 'WIP', message: 'Resend email logic coming soon' };
  };

  return {
    checking,
    handleCheckVerification,
    handleResendEmail
  };
};