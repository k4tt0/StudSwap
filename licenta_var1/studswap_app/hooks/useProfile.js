import { useState, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import { API_BASE_URL } from '../firebaseConfig';

export const useProfile = (navigation, providedUserId) => {
  const [userProfile, setUserProfile] = useState({ name: 'Loading...', email: '', city: '', university: '', avatar: null });
  const [myListings, setMyListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isOwnProfile, setIsOwnProfile] = useState(false);

  useFocusEffect(
    useCallback(() => {
      fetchProfileData();
    }, [providedUserId])
  );

  const fetchProfileData = async () => {
    setLoading(true);
    try {
      const myUserId = await AsyncStorage.getItem('userId');
      const targetUserId = providedUserId || myUserId;

      setIsOwnProfile(myUserId === targetUserId);

      const userRes = await fetch(`${API_BASE_URL}/api/users/${targetUserId}`);
      if (userRes.ok) {
        const userData = await userRes.json();
        setUserProfile({
          id: targetUserId,
          name: userData.displayName || 'Student',
          email: userData.email || '',
          city: userData.city || 'Unknown Location',
          university: userData.university || 'University',
          avatar: userData.profileImageUrl || null,
        });
      }

      const listingsRes = await fetch(`${API_BASE_URL}/api/listings`);
      if (listingsRes.ok) {
        const allListings = await listingsRes.json();
        const userListings = allListings.filter(item => item.userId === targetUserId);
        setMyListings(userListings.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePickAvatar = async () => {
    if (!isOwnProfile) return;

    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        return { type: 'error', title: 'Permission needed', message: 'Please allow access to your photos.' };
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.5,
      });

      if (!result.canceled && result.assets) {
        const imageUri = result.assets[0].uri;

        setUserProfile(prev => ({ ...prev, avatar: imageUri }));

        const formData = new FormData();
        formData.append('images', {
          uri: imageUri,
          type: 'image/jpeg',
          name: `avatar_${Date.now()}.jpg`,
        });

        const uploadRes = await fetch(`${API_BASE_URL}/api/upload`, { method: 'POST', body: formData });
        const uploadData = await uploadRes.json();
        const finalImageUrl = uploadData.imageUrls[0];

        await fetch(`${API_BASE_URL}/api/users/${userProfile.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ profileImageUrl: finalImageUrl }),
        });
      }
    } catch (error) {
      console.error('Eroare la alegerea/salvarea pozei', error);
    }
  };

  const handleDeleteListing = async (listingId) => {
    const res = await fetch(`${API_BASE_URL}/api/listings/${listingId}`, { method: 'DELETE' });

    if (res.ok) {
      setMyListings(prev => prev.filter(item => (item.id || item._id) !== listingId));
      return;
    }

    throw new Error('Failed to delete listing.');
  };

  return { userProfile, myListings, loading, isOwnProfile, handlePickAvatar, handleDeleteListing };
};