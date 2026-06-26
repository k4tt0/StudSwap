import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, ScrollView, Platform } from 'react-native';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { getGlobalStyles } from '../styles/RegisterScreenStyle';
import { getLoginStyles } from '../styles/LoginScreenStyle';
import { useForgotPassword } from '../hooks/useForgotPassword';
import InfoModal from '../components/InfoModal';

export default function ForgotPasswordScreen({ navigation }) {
  const { colors } = useTheme();
  const globalStyles = getGlobalStyles(colors);
  const localStyles = getLoginStyles(colors); // We can reuse login styles for headers!

  const { email, setEmail, loading, handleResetPassword } = useForgotPassword(navigation);

  const [infoVisible, setInfoVisible] = useState(false);
  const [infoConfig, setInfoConfig] = useState({ title: '', message: '', redirect: false });

  const onResetPress = async () => {
    const result = await handleResetPassword();
    if (!result) return;
    setInfoConfig({ title: result.title, message: result.message, redirect: !!result.redirect });
    setInfoVisible(true);
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      
      {/* BACK BUTTON */}
      <TouchableOpacity style={globalStyles.backButton} onPress={() => navigation.goBack()}>
        <Ionicons name="chevron-back" size={24} color={colors.textDark} />
      </TouchableOpacity>

      <KeyboardAvoidingView 
        style={{ flex: 1 }} 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView 
          contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', paddingHorizontal: 24, paddingBottom: 40 }} 
          keyboardShouldPersistTaps="handled"
        >
          
          <View style={[localStyles.headerContainer, { marginTop: 60, marginBottom: 20 }]}>
            <MaterialCommunityIcons name="lock-reset" size={80} color={colors.textDark} />
            <Text style={localStyles.headerTitle}>Reset Password</Text>
          </View>

          <Text style={{ color: colors.textDark, textAlign: 'center', marginBottom: 32, fontSize: 16, lineHeight: 24 }}>
            Enter your university email address and we'll send you a link to securely reset your password.
          </Text>

          <Text style={localStyles.label}>Student Email Address</Text>
          <View style={globalStyles.inputContainer}>
            <TextInput
              value={email}
              onChangeText={setEmail}
              style={globalStyles.inputField}
              placeholderTextColor={colors.muted}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          <TouchableOpacity
            onPress={onResetPress}
            disabled={loading}
            style={[globalStyles.buttonSolid, { marginTop: 24 }, loading && { opacity: 0.7 }]}
            activeOpacity={0.8}
          >
            <Text style={[globalStyles.buttonTextSolid, { color: '#FFF' }]}>
              {loading ? 'SENDING...' : 'SEND RESET LINK'}
            </Text>
          </TouchableOpacity>

        </ScrollView>
      </KeyboardAvoidingView>

      <InfoModal
        visible={infoVisible}
        title={infoConfig.title}
        message={infoConfig.message}
        colors={colors}
        onClose={() => {
          setInfoVisible(false);
          if (infoConfig.redirect) navigation.goBack();
        }}
      />

    </View>
  );
}