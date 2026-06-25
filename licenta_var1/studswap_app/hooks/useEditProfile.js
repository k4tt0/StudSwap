import { useState, useEffect } from 'react';
import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import { API_BASE_URL } from '../firebaseConfig';

export const useEditProfile = (navigation) => {
  const [userId, setUserId] = useState(null);
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [avatar, setAvatar] = useState(null);
  const [newAvatarUri, setNewAvatarUri] = useState(null); 
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const id = await AsyncStorage.getItem('userId');
        if (!id) return setLoading(false);
        setUserId(id);
        const res = await fetch(`${API_BASE_URL}/api/users/${id}`);
        if (res.ok) {
          const data = await res.json();
          setDisplayName(data.displayName || '');
          setEmail(data.email || '');
          setAvatar(data.profileImageUrl || null);
        }
      } catch (e) {
        console.error('Error loading profile:', e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handlePickAvatar = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') return Alert.alert('Permission needed', 'Please allow access to your photos.');

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.5,
      });

      if (!result.canceled && result.assets) {
        setNewAvatarUri(result.assets[0].uri);
        setAvatar(result.assets[0].uri); 
      }
    } catch (e) {
      console.error('Error picking avatar:', e);
    }
  };

  const handleSave = async () => {
    if (!displayName || displayName.trim().length === 0) {
      return Alert.alert('Missing name', 'Please enter a display name.');
    }
    if (!userId) return;

    setSaving(true);
    try {
      let finalImageUrl = null;

      // Only upload if the user actually picked a new image
      if (newAvatarUri) {
        const formData = new FormData();
        formData.append('images', {
          uri: newAvatarUri,
          type: 'image/jpeg',
          name: `avatar_${Date.now()}.jpg`,
        });
        const uploadRes = await fetch(`${API_BASE_URL}/api/upload`, { method: 'POST', body: formData });
        const uploadData = await uploadRes.json();
        finalImageUrl = uploadData.imageUrls?.[0] || null;
      }

      const body = { displayName: displayName.trim() };
      if (finalImageUrl) body.profileImageUrl = finalImageUrl;

      const res = await fetch(`${API_BASE_URL}/api/users/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        Alert.alert('Saved', 'Your profile has been updated.');
        navigation.goBack();
      } else {
        Alert.alert('Error', 'Could not save changes. Please try again.');
      }
    } catch (e) {
      console.error('Error saving profile:', e);
      Alert.alert('Error', 'Network error. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return {
    displayName, setDisplayName,
    email, avatar, loading, saving,
    handlePickAvatar, handleSave,
  };
};