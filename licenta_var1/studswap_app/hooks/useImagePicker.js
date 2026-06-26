import { useState } from 'react';
import * as ImagePicker from 'expo-image-picker';

export const useImagePicker = (maxImages = 5) => {
  const [selectedImages, setSelectedImages] = useState([]);

  const pickImages = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== 'granted') {
      return { type: 'error', title: 'Permission Denied', message: 'We need access to your camera roll to post items!' };
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true, 
      selectionLimit: maxImages - selectedImages.length, 
      quality: 0.7, 
    });

    if (!result.canceled) {
      const newUris = result.assets.map(asset => asset.uri);
      const combined = [...selectedImages, ...newUris].slice(0, maxImages);
      setSelectedImages(combined);
    }
  };

  const removeImage = (index) => {
    setSelectedImages(selectedImages.filter((_, i) => i !== index));
  };

  return {
    selectedImages,
    setSelectedImages,
    pickImages,
    removeImage,
  };
};