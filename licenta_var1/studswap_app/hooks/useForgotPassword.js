import { useState } from 'react';
import { Alert } from 'react-native';
import { API_BASE_URL } from '../firebaseConfig';

export const useForgotPassword = (navigation) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleResetPassword = async () => {
    if (!email) {
      Alert.alert("Error", "Please enter your student email address.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim().toLowerCase() }),
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert(
          "Email Sent!", 
          "Check your inbox for a link to reset your password.",
          [{ text: "OK", onPress: () => navigation.goBack() }] // Send them back to Login
        );
      } else {
        Alert.alert("Request Failed", data.error || "Something went wrong");
      }
    } catch (error) {
      console.error("Forgot Password Error:", error);
      Alert.alert("Network Error", "Could not connect to the server.");
    } finally {
      setLoading(false);
    }
  };

  return {
    email,
    setEmail,
    loading,
    handleResetPassword
  };
};