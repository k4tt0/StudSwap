import { useState } from 'react';
import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL } from '../firebaseConfig';

export const useVerifyEmail = (navigation) => {
  const [checking, setChecking] = useState(false);

  const handleCheckVerification = async () => {
    setChecking(true);
    try {
      const userId = await AsyncStorage.getItem('userId');
      
      if (!userId) {
        Alert.alert("Error", "User session lost. Please log in again.");
        navigation.navigate('Login');
        return;
      }
      
      const response = await fetch(`${API_BASE_URL}/api/auth/check-verification/${userId}`);
      const data = await response.json();

      if (data && data.emailVerified === true) {
        Alert.alert("Success!", "Your email is verified. Welcome to StudSwap!");
        navigation.navigate('Home'); 
      } else {
        Alert.alert(
          "Not verified yet", 
          "Please check your student email inbox (and spam folder) and click the verification link."
        );
      }
    } catch (error) {
      console.error("Verification Check Error:", error);
      Alert.alert("Error", "Could not check verification status.");
    } finally {
      setChecking(false);
    }
  };

  const handleResendEmail = () => {
    Alert.alert("WIP", "Resend email logic coming soon");
  };

  return {
    checking,
    handleCheckVerification,
    handleResendEmail
  };
};