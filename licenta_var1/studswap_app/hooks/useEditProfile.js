import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import { API_BASE_URL } from '../firebaseConfig';

export const useEditProfile = (navigation) => {
  const [userId, setUserId] = useState(null);
  const [displayName, setDisplayName] = useState('');
  const [originalName, setOriginalName] = useState(''); 
  const [email, setEmail] = useState('');
  const [avatar, setAvatar] = useState(null);
  const [newAvatarUri, setNewAvatarUri] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const [usernameStatus, setUsernameStatus] = useState(''); 

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
          setOriginalName(data.displayName || '');
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

  useEffect(() => {
    const checkUsername = async () => {
      const currentInput = displayName.trim();
      
      if (currentInput === originalName) {
        setUsernameStatus('');
        return;
      }
      
      if (currentInput.length < 3) {
        setUsernameStatus('');
        return;
      }
      
      setUsernameStatus('checking');
      try {
        const response = await fetch(`${API_BASE_URL}/api/auth/check-username?username=${encodeURIComponent(currentInput)}`);
        if (response.ok) {
          const data = await response.json();
          setUsernameStatus(data.available ? 'available' : 'taken');
        }
      } catch (error) {
        setUsernameStatus(''); 
      }
    };

    const delayDebounceFn = setTimeout(() => {
      checkUsername();
    }, 250);

    return () => clearTimeout(delayDebounceFn);
  }, [displayName, originalName]);

  const handlePickAvatar = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        return {
          type: 'error',
          title: 'Permission needed',
          message: 'Please allow access to your photos.',
        };
      }

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

      return null;
    } catch (e) {
      console.error('Error picking avatar:', e);
      return {
        type: 'error',
        title: 'Error',
        message: 'Could not open the photo picker.',
      };
    }
  };

  const handleSave = async () => {
    if (!displayName || displayName.trim().length === 0) {
      return {
        type: 'error',
        title: 'Missing name',
        message: 'Please enter a display name.',
      };
    }

    if (usernameStatus === 'taken') {
      return { 
        type: 'error', 
        title: 'Invalid Username', 
        message: 'This username is already taken. Please choose another one.' 
      };
    }

    if (!userId) return null;

    setSaving(true);
    try {
      let finalImageUrl = null;

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
        return {
          type: 'success',
          title: 'Saved',
          message: 'Your profile has been updated.',
          redirect: true,
        };
      }

      return {
        type: 'error',
        title: 'Error',
        message: 'Could not save changes. Please try again.',
      };
    } catch (e) {
      console.error('Error saving profile:', e);
      return {
        type: 'error',
        title: 'Error',
        message: 'Network error. Please try again.',
      };
    } finally {
      setSaving(false);
    }
  };

  return {
    displayName,
    setDisplayName,
    email,
    avatar,
    loading,
    saving,
    usernameStatus, 
    handlePickAvatar,
    handleSave,
  };
};