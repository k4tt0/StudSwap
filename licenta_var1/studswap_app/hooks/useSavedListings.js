import { useState, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL } from '../firebaseConfig'; 

export const useSavedListings = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [savedItems, setSavedItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      fetchSavedItems();
    }, [])
  );

  const fetchSavedItems = async () => {
    setLoading(true);
    try {
      const savedIdsStr = await AsyncStorage.getItem('savedListings');
      const savedIds = savedIdsStr ? JSON.parse(savedIdsStr) : [];

      if (savedIds.length === 0) {
        setSavedItems([]);
        setLoading(false);
        return;
      }

      const res = await fetch(`${API_BASE_URL}/api/listings`);
      if (res.ok) {
        const allListings = await res.json();
        
        const filtered = allListings.filter(item => savedIds.includes(item.id || item._id));
        setSavedItems(filtered);
      }
    } catch (error) {
      console.error("Eroare la descărcarea favoritelor reale:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveSaved = async (id) => {
    setSavedItems(prev => prev.filter(item => (item.id || item._id) !== id));
    
    try {
      const savedIdsStr = await AsyncStorage.getItem('savedListings');
      let savedIds = savedIdsStr ? JSON.parse(savedIdsStr) : [];
      savedIds = savedIds.filter(savedId => savedId !== id);
      await AsyncStorage.setItem('savedListings', JSON.stringify(savedIds));
    } catch(e) {
      console.error(e);
    }
  };

  const filteredItems = savedItems.filter(item =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return {
    searchQuery, setSearchQuery,
    filteredItems, loading,
    handleRemoveSaved
  };
};