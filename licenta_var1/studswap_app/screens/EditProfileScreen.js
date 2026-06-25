import React from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Image, ActivityIndicator, KeyboardAvoidingView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { getEditProfileStyles } from '../styles/EditProfileScreenStyle';
import { useEditProfile } from '../hooks/useEditProfile';

export default function EditProfileScreen({ navigation }) {
  const { colors } = useTheme();
  const styles = getEditProfileStyles(colors);
  const {
    displayName, setDisplayName,
    email, avatar, loading, saving,
    handlePickAvatar, handleSave,
  } = useEditProfile(navigation);

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
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="close" size={28} color={colors.textDark} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edit Profile</Text>
        <View style={{ width: 28 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

        {/* AVATAR */}
        <View style={styles.avatarSection}>
          <TouchableOpacity style={styles.avatarContainer} onPress={handlePickAvatar} activeOpacity={0.8}>
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

        {/* DISPLAY NAME */}
        <Text style={styles.label}>Display Name</Text>
        <TextInput
          style={styles.input}
          value={displayName}
          onChangeText={setDisplayName}
          placeholder="Your name"
          placeholderTextColor={colors.muted}
        />

        {/* EMAIL (read-only) */}
        <Text style={styles.label}>Email</Text>
        <View style={[styles.input, styles.inputDisabled]}>
          <Text style={styles.disabledValue} numberOfLines={1}>{email || '—'}</Text>
          <Ionicons name="lock-closed-outline" size={18} color={colors.muted} />
        </View>
        <Text style={styles.helperText}>
          Your institutional email can't be changed — it verifies your university and city.
        </Text>

      </ScrollView>

      {/* FOOTER */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.saveBtn, saving && { opacity: 0.7 }]}
          onPress={handleSave}
          disabled={saving}
        >
          {saving ? (
            <ActivityIndicator color="#FFF" />
          ) : (
            <Text style={styles.saveBtnText}>Save Changes</Text>
          )}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}