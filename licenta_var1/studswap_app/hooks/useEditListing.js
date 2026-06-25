import { useState } from 'react';
import { API_BASE_URL } from '../firebaseConfig';

export const useEditListing = (listing, navigation) => {
  const [title, setTitle] = useState(listing.title || '');
  const [price, setPrice] = useState(listing.price ? listing.price.toString() : '');
  const [description, setDescription] = useState(listing.description || '');
  const [category, setCategory] = useState(listing.category || '');
  
  const [announcementType, setAnnouncementType] = useState(listing.announcementType || 'For Sale');
  const [condition, setCondition] = useState(listing.condition || 'Good');
  
  const [isUpdating, setIsUpdating] = useState(false);

   const handleUpdate = async () => {
    if (!title.trim() || !category || !announcementType || !condition) {
      return {
        type: 'error',
        title: 'Missing fields',
        message: 'Please fill in all mandatory fields.',
      };
    }

    setIsUpdating(true);
    try {
      const listingId = listing.id || listing._id;
      const finalPrice = announcementType === 'For Sale' ? Number(price) : 0;

      const response = await fetch(`${API_BASE_URL}/api/listings/${listingId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          price: finalPrice,
          description,
          category,
          announcementType,
          condition,
        }),
      });

      if (response.ok) {
        return {
          type: 'success',
          title: 'Success',
          message: 'Listing updated successfully!',
          redirect: true,
        };
      }

      const errorData = await response.json();
      console.error('Server update error:', errorData);
      return {
        type: 'error',
        title: 'Error',
        message: errorData.message || 'Failed to update listing.',
      };
    } catch (error) {
      console.error('Network error on update:', error);
      return {
        type: 'error',
        title: 'Error',
        message: 'Network error while updating.',
      };
    } finally {
      setIsUpdating(false);
    }
  };

  return {
    title,
    setTitle,
    price,
    setPrice,
    description,
    setDescription,
    category,
    setCategory,
    announcementType,
    setAnnouncementType,
    condition,
    setCondition,
    isUpdating,
    handleUpdate,
  };
};