import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform} from 'react-native';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext'; 
import { getGlobalStyles, getRegisterStyles } from '../styles/RegisterScreenStyle'; 
import { useRegister } from '../hooks/useRegister';
import InfoModal from '../components/InfoModal'; 

export default function RegisterScreen({ navigation }) {
  const { colors } = useTheme();
  const globalStyles = getGlobalStyles(colors);
  const localStyles = getRegisterStyles(colors);

  const {
    displayName, setDisplayName,
    email, setEmail,
    password, setPassword,
    confirmPassword, setConfirmPassword,
    loading,
    showPassword, setShowPassword,
    showConfirmPassword, setShowConfirmPassword,
    usernameStatus,
    handleRegister
  } = useRegister(); 

  const [infoVisible, setInfoVisible] = useState(false);
  const [infoConfig, setInfoConfig] = useState({ title: '', message: '', buttonText: 'OK', redirect: false });

  const showInfo = (config) => {
    setInfoConfig({
      title: config.title,
      message: config.message,
      buttonText: config.buttonText || 'OK',
      redirect: !!config.redirect,
    });
    setInfoVisible(true);
  };

  const onRegisterPress = async () => {
    const result = await handleRegister();
    if (!result) return;

    showInfo(result);

    if (result.type === 'success' && result.redirect) {
      setTimeout(() => {
        setInfoVisible(false);
        navigation.replace('Home');
      }, 1500); 
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <TouchableOpacity style={globalStyles.backButton} onPress={() => navigation.goBack()}>
        <Ionicons name="chevron-back" size={24} color={colors.textDark} />
      </TouchableOpacity>

      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView contentContainerStyle={localStyles.registerScrollContainer} keyboardShouldPersistTaps="handled">
          <View style={localStyles.registerInnerContainer}>
            
            <Text style={localStyles.registerTitle}>Create an account</Text>
            
            <Text style={localStyles.registerLabel}>Username</Text>
            <View style={[globalStyles.inputContainer, usernameStatus === 'taken' && { borderColor: '#E63946', borderWidth: 1 }]}>
              <TextInput
                value={displayName}
                onChangeText={setDisplayName}
                style={globalStyles.inputField}
                placeholderTextColor={colors.muted}
                autoCorrect={false}
              />
            </View>
            
            {usernameStatus === 'checking' && <Text style={{ color: colors.muted, fontSize: 12, marginTop: 4, marginLeft: 15 }}>Checking availability...</Text>}
            {usernameStatus === 'available' && <Text style={{ color: colors.accent, fontSize: 12, marginTop: 4, marginLeft: 15 }}>Username is available! ✓</Text>}
            {usernameStatus === 'taken' && <Text style={{ color: '#E63946', fontSize: 12, marginTop: 4, marginLeft: 15 }}>Username is already taken ✗</Text>}

            <Text style={[localStyles.registerLabel, { marginTop: 15 }]}>Student Email Address</Text>
            <View style={globalStyles.inputContainer}>
              <TextInput value={email} onChangeText={setEmail} style={globalStyles.inputField} placeholderTextColor={colors.muted} keyboardType="email-address" autoCapitalize="none" autoCorrect={false} />
            </View>
            
            <Text style={localStyles.registerLabel}>Password</Text>
            <View style={globalStyles.inputContainer}>
              <TextInput value={password} onChangeText={setPassword} style={globalStyles.inputField} placeholderTextColor={colors.muted} secureTextEntry={!showPassword} />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={{ padding: 4 }}>
                <MaterialCommunityIcons name={showPassword ? "eye-off-outline" : "eye-outline"} size={22} color={colors.muted} />
              </TouchableOpacity>
            </View>

            <Text style={localStyles.registerLabel}>Confirm Password</Text>
            <View style={globalStyles.inputContainer}>
              <TextInput value={confirmPassword} onChangeText={setConfirmPassword} style={globalStyles.inputField} placeholderTextColor={colors.muted} secureTextEntry={!showConfirmPassword} />
              <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)} style={{ padding: 4 }}>
                <MaterialCommunityIcons name={showConfirmPassword ? "eye-off-outline" : "eye-outline"} size={22} color={colors.muted} />
              </TouchableOpacity>
            </View>

            <TouchableOpacity 
              onPress={onRegisterPress} 
              disabled={loading || usernameStatus === 'taken'} 
              style={[globalStyles.buttonSolid, localStyles.registerButtonMargin, (loading || usernameStatus === 'taken') && { opacity: 0.7 }]} 
              activeOpacity={0.8}
            >
              <Text style={[globalStyles.buttonTextSolid, { color: '#FFF' }]} numberOfLines={1}>
                {loading ? 'CREATING ACCOUNT...' : 'SIGN UP'}
              </Text>
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
        onClose={() => {
          setInfoVisible(false);
          if (infoConfig.redirect) {
            navigation.replace('Home');
          }
        }}
      />
    </View>
  );
}