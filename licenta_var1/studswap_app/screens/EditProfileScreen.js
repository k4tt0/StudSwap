import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Image, ActivityIndicator, KeyboardAvoidingView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../context/ThemeContext';
import { getEditProfileStyles } from '../styles/EditProfileScreenStyle';
import { useEditProfile } from '../hooks/useEditProfile';
import InfoModal from '../components/InfoModal';

export default function EditProfileScreen({ navigation }) {
  const { colors } = useTheme();
  const styles = getEditProfileStyles(colors);
  const insets = useSafeAreaInsets();

  const {
    displayName,
    setDisplayName,
    email,
    avatar,
    loading,
    saving,
    usernameStatus, 
    handlePickAvatar,
    handleSave,
  } = useEditProfile(navigation);

  const [infoVisible, setInfoVisible] = useState(false);
  const [infoConfig, setInfoConfig] = useState({
    title: '',
    message: '',
    buttonText: 'OK',
    redirect: false,
  });

  const showInfo = (config) => {
    setInfoConfig({
      title: config.title,
      message: config.message,
      buttonText: config.buttonText || 'OK',
      redirect: !!config.redirect,
    });
    setInfoVisible(true);
  };

  const onAvatarPress = async () => {
    const result = await handlePickAvatar();
    if (result) {
      showInfo(result);
    }
  };

  const onSavePress = async () => {
    const result = await handleSave();
    if (!result) return;

    showInfo(result);

    if (result.type === 'success' && result.redirect) {
      setTimeout(() => {
        setInfoVisible(false);
        navigation.goBack();
      }, 800);
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={colors.accent} />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="close" size={28} color={colors.textDark} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edit Profile</Text>
        <View style={{ width: 28 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.avatarSection}>
          <TouchableOpacity style={styles.avatarContainer} onPress={onAvatarPress} activeOpacity={0.8}>
            {avatar ? (
              <Image source={{ uri: avatar }} style={styles.avatarImage} />
            ) : (
              <Text style={styles.avatarInitials}>{displayName ? displayName.charAt(0) : '?'}</Text>
            )}
            <View style={styles.avatarCameraIcon}>
              <Ionicons name="camera" size={16} color={colors.textDark} />
            </View>
          </TouchableOpacity>
          <Text style={styles.changePhotoText}>Tap to change photo</Text>
        </View>

        <Text style={styles.label}>Display Name</Text>
        <TextInput
          style={[styles.input, usernameStatus === 'taken' && { borderColor: '#E63946', borderWidth: 1 }]}
          value={displayName}
          onChangeText={setDisplayName}
          placeholder="Your name"
          placeholderTextColor={colors.muted}
        />
        
        {usernameStatus === 'checking' && <Text style={{ color: colors.muted, fontSize: 12, marginTop: -15, marginBottom: 15 }}>Checking availability...</Text>}
        {usernameStatus === 'available' && <Text style={{ color: colors.accent, fontSize: 12, marginTop: -15, marginBottom: 15 }}>Username is available! ✓</Text>}
        {usernameStatus === 'taken' && <Text style={{ color: '#E63946', fontSize: 12, marginTop: -15, marginBottom: 15 }}>Username is already taken ✗</Text>}

        <Text style={styles.label}>Email</Text>
        <View style={[styles.input, styles.inputDisabled]}>
          <Text style={styles.disabledValue} numberOfLines={1}>{email || '—'}</Text>
          <Ionicons name="lock-closed-outline" size={18} color={colors.muted} />
        </View>
        <Text style={styles.helperText}>
          Your institutional email can't be changed since it verifies your university and city.
        </Text>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.saveBtn, (saving || usernameStatus === 'taken') && { opacity: 0.7 }]}
          onPress={onSavePress}
          disabled={saving || usernameStatus === 'taken'} 
        >
          {saving ? (
            <ActivityIndicator color="#FFF" />
          ) : (
            <Text style={styles.saveBtnText}>Save Changes</Text>
          )}
        </TouchableOpacity>
      </View>

      <InfoModal
        visible={infoVisible}
        title={infoConfig.title}
        message={infoConfig.message}
        buttonText={infoConfig.buttonText}
        colors={colors}
        onClose={() => setInfoVisible(false)}
      />
    </KeyboardAvoidingView>
  );
}