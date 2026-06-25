import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { getSettingsStyles } from '../styles/SettingsScreenStyle';
import { useSettings } from '../hooks/useSettings';

const APP_VERSION = '1.0.0';

const THEME_OPTIONS = [
  { key: 'system', label: 'System', icon: 'phone-portrait-outline' },
  { key: 'light', label: 'Light', icon: 'sunny-outline' },
  { key: 'dark', label: 'Dark', icon: 'moon-outline' },
];

export default function SettingsScreen({ navigation }) {
  const { colors, themeMode, updateTheme } = useTheme();
  const styles = getSettingsStyles(colors);
  const { account, loading, handleLogout } = useSettings(navigation);

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={26} color={colors.textDark} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Settings</Text>
        <View style={{ width: 26 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

        {/* APPEARANCE */}
        <Text style={styles.sectionLabel}>Appearance</Text>
        <View style={styles.card}>
          {THEME_OPTIONS.map((opt, index) => {
            const isActive = themeMode === opt.key;
            return (
              <TouchableOpacity
                key={opt.key}
                style={[styles.row, index < THEME_OPTIONS.length - 1 && styles.rowBorder]}
                onPress={() => updateTheme(opt.key)}
                activeOpacity={0.7}
              >
                <View style={styles.rowLeft}>
                  <Ionicons name={opt.icon} size={22} color={colors.textDark} />
                  <Text style={styles.rowText}>{opt.label}</Text>
                </View>
                {isActive && <Ionicons name="checkmark-circle" size={22} color={colors.accent} />}
              </TouchableOpacity>
            );
          })}
        </View>

        {/* ACCOUNT */}
        <Text style={styles.sectionLabel}>Account</Text>
        <View style={styles.card}>
          {loading ? (
            <ActivityIndicator color={colors.accent} style={{ paddingVertical: 20 }} />
          ) : (
            <>
              <View style={[styles.infoRow, styles.rowBorder]}>
                <Text style={styles.infoLabel}>Email</Text>
                <Text style={styles.infoValue} numberOfLines={1}>{account.email || '—'}</Text>
              </View>
              <View style={[styles.infoRow, styles.rowBorder]}>
                <Text style={styles.infoLabel}>University</Text>
                <Text style={styles.infoValue} numberOfLines={1}>{account.university || '—'}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>City</Text>
                <Text style={styles.infoValue} numberOfLines={1}>{account.city || '—'}</Text>
              </View>
            </>
          )}
        </View>

        {/* ABOUT */}
        <Text style={styles.sectionLabel}>About</Text>
        <View style={styles.card}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>App Version</Text>
            <Text style={styles.infoValue}>{APP_VERSION}</Text>
          </View>
        </View>

        {/* LOGOUT */}
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout} activeOpacity={0.8}>
          <Ionicons name="log-out-outline" size={22} color="#E63946" />
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>

        <Text style={styles.footerNote}>StudSwap • {APP_VERSION}</Text>

      </ScrollView>
    </View>
  );
}