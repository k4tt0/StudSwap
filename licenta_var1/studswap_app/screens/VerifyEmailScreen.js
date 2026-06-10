import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '../context/ThemeContext'; 
import { getGlobalStyles } from '../styles/RegisterScreenStyle'; 
import { useVerifyEmail } from '../hooks/useVerifyEmail';
import { getVerifyStyles } from '../styles/VerifyEmailStyle';

export default function VerifyEmailScreen({ navigation }) {
  // 1. Get UI Theme
  const { colors } = useTheme();
  const globalStyles = getGlobalStyles(colors);
  const styles = getVerifyStyles(colors);
  
  // 2. Get Business Logic from Hook
  const { checking, handleCheckVerification, handleResendEmail } = useVerifyEmail(navigation);

  // 3. Render purely UI
  return (
    <View style={globalStyles.container}>
      <View style={styles.contentContainer}>
        
        <Text style={styles.title}>Verify your email address</Text>
        
        <Text style={styles.description}>
          We sent you an email to verify your student email address. 
          Please click the link inside it, then press the button below.
        </Text>

        <TouchableOpacity
          onPress={handleCheckVerification}
          disabled={checking}
          style={[globalStyles.buttonSolid, { width: '80%', marginTop: 40 }]}
          activeOpacity={0.8}
        >
          <Text style={globalStyles.buttonTextSolid}>
            {checking ? 'CHECKING...' : 'I VERIFIED IT'}
          </Text>
        </TouchableOpacity>

        <View style={styles.resendContainer}>
          <Text style={{ color: colors.textDark }}>Didn't receive the email? </Text>
          <TouchableOpacity onPress={handleResendEmail}>
            <Text style={styles.resendText}>Resend</Text>
          </TouchableOpacity>
        </View>

      </View>
    </View>
  );
}