import React, {useState} from 'react';
import { View, TouchableOpacity, Text, TextInput, KeyboardAvoidingView, ScrollView, Platform } from 'react-native';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext'; 
import { getGlobalStyles } from '../styles/RegisterScreenStyle'; 
import { getLoginStyles } from '../styles/LoginScreenStyle';
import { useLogin } from '../hooks/useLogin'; 
import InfoModal from '../components/InfoModal';

export default function LoginScreen({ navigation }) {
  const { colors } = useTheme();
  const globalStyles = getGlobalStyles(colors);
  const localStyles = getLoginStyles(colors);

  const {
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
  } = useLogin(navigation);

  const [infoVisible, setInfoVisible] = useState(false);
  const [infoConfig, setInfoConfig] = useState({
      title: '',
      message: '',
      buttonText: 'OK',
  });

  const showInfo = (config) => {
    setInfoConfig({
      title: config.title,
      message: config.message,
      buttonText: config.buttonText || 'OK',
    });
    setInfoVisible(true);
  };

  const onLoginPress = async () => {
  const result = await handleLogin();
    if (result && result.type === 'error') {
      showInfo(result);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
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
          showsVerticalScrollIndicator={false}
        >
          <View style={[localStyles.headerContainer, { marginTop: 60 }]}>
            <MaterialCommunityIcons name="school-outline" size={80} color={colors.textDark} />
            <Text style={localStyles.headerTitle}>Log into your account</Text>
          </View>

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

          <Text style={localStyles.label}>Password</Text>
          <View style={globalStyles.inputContainer}>
            <TextInput
              value={password}
              onChangeText={setPassword}
              style={globalStyles.inputField}
              placeholderTextColor={colors.muted}
              secureTextEntry={!showPassword}
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={{ padding: 4 }}>
              <MaterialCommunityIcons
                name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                size={22}
                color={colors.muted}
              />
            </TouchableOpacity>
          </View>

          <View style={localStyles.optionsRow}>
            <TouchableOpacity style={localStyles.checkboxContainer} onPress={() => setRememberMe(!rememberMe)} activeOpacity={0.7}>
              <MaterialCommunityIcons
                name={rememberMe ? 'checkbox-marked' : 'checkbox-blank-outline'}
                size={24}
                color={rememberMe ? colors.accent : colors.muted}
              />
              <Text style={localStyles.rememberText}>Remember me</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
              <Text style={localStyles.forgotPassword}>Forgot password?</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            onPress={onLoginPress}
            disabled={loading}
            style={[globalStyles.buttonSolid, loading && { opacity: 0.7 }]}
            activeOpacity={0.8}
          >
            <Text style={[globalStyles.buttonTextSolid, { color: '#FFF' }]} numberOfLines={1}>
              {loading ? 'LOGGING IN...' : 'LOG IN'}
            </Text>
          </TouchableOpacity>

          <View style={localStyles.footerContainer}>
            <Text style={localStyles.footerText}>Don't have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Register')}>
              <Text style={localStyles.linkText}>Sign up</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <InfoModal
        visible={infoVisible}
        title={infoConfig.title}
        message={infoConfig.message}
        buttonText={infoConfig.buttonText}
        colors={colors}
        onClose={() => setInfoVisible(false)}
      />
    </View>
  );
}