import React from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform} from 'react-native';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext'; 
import { getGlobalStyles, getRegisterStyles } from '../styles/RegisterScreenStyle'; 
import { useRegister } from '../hooks/useRegister';

export default function RegisterScreen({ navigation }) {
  const { colors } = useTheme();
  const globalStyles = getGlobalStyles(colors);
  const localStyles = getRegisterStyles(colors);

  const {
    displayName,
    setDisplayName,
    email,
    setEmail,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    loading,
    showPassword,
    setShowPassword,
    showConfirmPassword,
    setShowConfirmPassword,
    handleRegister
  } = useRegister(navigation);

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

      <ScrollView contentContainerStyle={localStyles.registerScrollContainer} keyboardShouldPersistTaps="handled">
        <View style={localStyles.registerInnerContainer}>
          
          <Text style={localStyles.registerTitle}>Create an account</Text>
          
          <Text style={localStyles.registerLabel}>Name</Text>
          <View style={globalStyles.inputContainer}>
            <TextInput
              value={displayName}
              onChangeText={setDisplayName}
              style={globalStyles.inputField}
              placeholderTextColor={colors.muted}
              autoCorrect={false}
            />
          </View>
          
          <Text style={localStyles.registerLabel}>Student Email Address</Text>
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
          
          <Text style={localStyles.registerLabel}>Password</Text>
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
                name={showPassword ? "eye-off-outline" : "eye-outline"} 
                size={22} 
                color={colors.muted} 
              />
            </TouchableOpacity>
          </View>

          <Text style={localStyles.registerLabel}>Confirm Password</Text>
          <View style={globalStyles.inputContainer}>
            <TextInput
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              style={globalStyles.inputField}
              placeholderTextColor={colors.muted}
              secureTextEntry={!showConfirmPassword}
            />
            <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)} style={{ padding: 4 }}>
              <MaterialCommunityIcons 
                name={showConfirmPassword ? "eye-off-outline" : "eye-outline"} 
                size={22} 
                color={colors.muted} 
              />
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            onPress={handleRegister}
            disabled={loading}
            style={[globalStyles.buttonSolid, localStyles.registerButtonMargin, loading && { opacity: 0.7 }]}
            activeOpacity={0.8}
          >
            <Text style={[globalStyles.buttonTextSolid, { color: '#FFF' }]} numberOfLines={1}>
              {loading ? 'CREATING ACCOUNT...' : 'SIGN UP'}
            </Text>
          </TouchableOpacity>

        </View>
      </ScrollView>
      </KeyboardAvoidingView>

    </View>
  );
}