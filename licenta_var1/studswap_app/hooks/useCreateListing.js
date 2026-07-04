import { useState } from 'react';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL } from '../firebaseConfig';

export const useCreateListing = (navigation, initialImages = []) => {
  const [images, setImages] = useState(initialImages);
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [announcementType, setAnnouncementType] = useState('');
  const [price, setPrice] = useState('');
  const [condition, setCondition] = useState('');
  const [loading, setLoading] = useState(false);

  const categories = ['Books', 'Electronics', 'Equipment', 'Notes', 'Other'];
  const announcementTypes = ['For Sale', 'Donation', 'Exchange'];
  const conditions = ['New', 'Like New', 'Good', 'Fair', 'Poor'];

  const handleAddMoreImages = async () => {
    const remainingSlots = 5 - images.length;
    if (remainingSlots <= 0) {
      return { type: 'error', title: 'Limit Reached', message: 'You can only upload up to 5 images.' };
    }

    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        return { type: 'error', title: 'Permission Denied', message: 'Need camera roll access.' };
      }

      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsMultipleSelection: true,
        selectionLimit: remainingSlots,
        quality: 0.7,
      });

      if (!result.canceled) {
        const newUris = result.assets.map(asset => asset.uri);
        setImages(prev => [...prev, ...newUris].slice(0, 5));
      }
    } catch (e) {
      console.error('Error picking images:', e);
      return { type: 'error', title: 'Error', message: 'Could not open the photo picker.' };
    }
  };

  const removeImage = (indexToRemove) => {
    setImages(prev => prev.filter((_, index) => index !== indexToRemove));
  };

  const validate = () => {
    const errors = {};
    if (images.length === 0) errors.images = 'Please add at least one image.';
    if (!title || title.trim() === '') errors.title = 'Please give your listing a title.';
    if (!description || description.trim() === '') errors.description = 'Please describe your item.';
    if (!category) errors.category = 'Please select a category.';
    if (!announcementType) errors.announcementType = 'Please select an announcement type.';
    if (announcementType === 'For Sale' && (!price || price.trim() === '')) errors.price = 'Please enter a price.';
    if (!condition) errors.condition = 'Please select the item condition.';
    return errors;
  };

  const handlePublish = async () => {
    if (Object.keys(validate()).length > 0) return null;

    setLoading(true);
    
    try {
      const userId = await AsyncStorage.getItem('userId');
      if (!userId) throw new Error("User session not found. Please log in again.");

      const userRes = await fetch(`${API_BASE_URL}/api/users/${userId}`);
      if (!userRes.ok) throw new Error("Failed to fetch user data.");
      const userData = await userRes.json();

      const formData = new FormData();
      images.forEach((uri) => {
        const filename = uri.split('/').pop();
        const match = /\.(\w+)$/.exec(filename);
        const type = match ? `image/${match[1]}` : `image`;

        formData.append('images', {
          uri,
          name: filename,
          type,
        });
      });

      const uploadResponse = await fetch(`${API_BASE_URL}/api/upload`, {
        method: 'POST',
        headers: { 'Content-Type': 'multipart/form-data' },
        body: formData,
      });

      if (!uploadResponse.ok) throw new Error("Failed to upload images.");
      const uploadData = await uploadResponse.json();
      const uploadedImageUrls = uploadData.imageUrls; 

      const listingData = {
        title: title.trim(),
        description: description ? description.trim() : '', 
        price: announcementType === 'For Sale' ? parseFloat(price) : 0,
        category,
        announcementType, 
        condition,
        userId: userId,
        userName: userData.displayName || 'Student',
        location: userData.city || 'Unknown', 
        faculty: userData.university || 'Unknown',
        images: uploadedImageUrls, 
      };

      const listingResponse = await fetch(`${API_BASE_URL}/api/listings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(listingData),
      });

      if (!listingResponse.ok) throw new Error("Failed to save listing details.");

      navigation.navigate('Home');
      return { type: 'success', title: 'Success', message: 'Your item is now live!' };

    } catch (error) {
      console.error("Publish Error:", error);
      return { type: 'error', title: 'Upload Failed', message: error.message || 'Something went wrong while publishing.' };
    } finally {
      setLoading(false);
    }
  };

  return {
    images, handleAddMoreImages, removeImage,
    title, setTitle,
    description, setDescription,
    category, setCategory, categories,
    announcementType, setAnnouncementType, announcementTypes,
    price, setPrice,
    condition, setCondition, conditions,
    loading, handlePublish, validate
  };
};