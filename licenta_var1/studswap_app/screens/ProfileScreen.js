import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NavBar from '../components/NavBar';
import { useTheme } from '../context/ThemeContext'; 
import { getHomeStyles } from '../styles/HomeScreenStyle';

export default function ProfileScreen({ navigation }) {
  const { colors } = useTheme();
  const styles = getHomeStyles(colors);

  const [userProfile, setUserProfile] = useState({
    name: 'Loading...',
    email: 'Loading...',
    city: 'Loading...',
    university: 'Loading...'
  });

  useEffect(() => {
    loadUserProfile();
  }, []);

  const loadUserProfile = async () => {
    try {
      // TODO: Fetch user profile from API
      setUserProfile({
        name: 'Student Name',
        email: 'student@university.ro',
        city: 'Timisoara',
        university: 'West University'
      });
    } catch (error) {
      console.error('Error loading profile:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('userId');
      await AsyncStorage.removeItem('userToken');
      navigation.navigate('Start');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        <View style={styles.headerContainer}>
          <Text style={{ fontSize: 18, fontWeight: 'bold', color: colors.textDark }}>
            Profile
          </Text>
        </View>

        <View style={[styles.card, { marginHorizontal: 20, marginTop: 20 }]}>
          <View style={{ alignItems: 'center', padding: 20 }}>
            <View style={[styles.avatar, { width: 80, height: 80, borderRadius: 40 }]}>
              <Text style={[styles.avatarText, { fontSize: 32 }]}>
                {userProfile.name.charAt(0)}
              </Text>
            </View>
            <Text style={{ fontSize: 18, fontWeight: 'bold', color: colors.textDark, marginTop: 12 }}>
              {userProfile.name}
            </Text>
            <Text style={{ fontSize: 12, color: colors.muted, marginTop: 4 }}>
              {userProfile.email}
            </Text>
          </View>
        </View>

        <View style={[styles.card, { marginHorizontal: 20, marginTop: 20, padding: 20 }]}>
          <View style={{ marginBottom: 16 }}>
            <Text style={{ fontSize: 12, color: colors.muted, marginBottom: 4 }}>City</Text>
            <Text style={{ fontSize: 16, fontWeight: 'bold', color: colors.textDark }}>
              {userProfile.city}
            </Text>
          </View>
          <View>
            <Text style={{ fontSize: 12, color: colors.muted, marginBottom: 4 }}>University</Text>
            <Text style={{ fontSize: 16, fontWeight: 'bold', color: colors.textDark }}>
              {userProfile.university}
            </Text>
          </View>
        </View>

        <TouchableOpacity
          onPress={handleLogout}
          style={[styles.card, { marginHorizontal: 20, marginTop: 20, backgroundColor: '#E63946' }]} // Soft Red for Logout
        >
          <Text style={{ textAlign: 'center', padding: 16, color: '#FFF', fontWeight: 'bold', fontSize: 16 }}>
            Log Out
          </Text>
        </TouchableOpacity>
      </ScrollView>

      <NavBar navigation={navigation} activeScreen="Profile" />
    </View>
  );
}