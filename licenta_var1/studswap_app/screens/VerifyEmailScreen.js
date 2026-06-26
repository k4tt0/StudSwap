import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { getGlobalStyles } from '../styles/RegisterScreenStyle';
import { useVerifyEmail } from '../hooks/useVerifyEmail';
import { getVerifyStyles } from '../styles/VerifyEmailStyle';
import InfoModal from '../components/InfoModal';

export default function VerifyEmailScreen({ navigation }) {
  const { colors } = useTheme();
  const globalStyles = getGlobalStyles(colors);
  const styles = getVerifyStyles(colors);

  const { checking, handleCheckVerification, handleResendEmail } = useVerifyEmail(navigation);

  const [infoVisible, setInfoVisible] = useState(false);
  const [infoConfig, setInfoConfig] = useState({ title: '', message: '' });

  const showInfo = (result) => {
    if (!result) return;
    setInfoConfig({ title: result.title, message: result.message });
    setInfoVisible(true);
  };

  const onCheckPress = async () => {
    const result = await handleCheckVerification();
    showInfo(result);
  };

  const onResendPress = () => {
    showInfo(handleResendEmail());
  };

  return (
    <View style={globalStyles.container}>
      <View style={styles.contentContainer}>
        
        <Text style={styles.title}>Verify your email address</Text>
        
        <Text style={styles.description}>
          We sent you an email to verify your student email address. 
          Please click the link inside it, then press the button below.
        </Text>

        <TouchableOpacity
          onPress={onCheckPress}
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
          <TouchableOpacity onPress={onResendPress}>
            <Text style={styles.resendText}>Resend</Text>
          </TouchableOpacity>
        </View>

      </View>

      <InfoModal
        visible={infoVisible}
        title={infoConfig.title}
        message={infoConfig.message}
        colors={colors}
        onClose={() => setInfoVisible(false)}
      />
    </View>
  );
}