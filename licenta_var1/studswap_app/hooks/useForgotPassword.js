import { useState } from 'react';
import { API_BASE_URL } from '../firebaseConfig';

export const useForgotPassword = (navigation) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleResetPassword = async () => {
    if (!email) {
      return { type: 'error', title: 'Error', message: 'Please enter your student email address.' };
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
        return { type: 'success', title: 'Email Sent!', message: 'Check your inbox for a link to reset your password.', redirect: true };
      } else {
        return { type: 'error', title: 'Request Failed', message: data.error || 'Something went wrong' };
      }
    } catch (error) {
      console.error("Forgot Password Error:", error);
      return { type: 'error', title: 'Network Error', message: 'Could not connect to the server.' };
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