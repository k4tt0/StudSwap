import { useState, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL } from '../firebaseConfig'; 

export const useSavedListings = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [savedItems, setSavedItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortOrder, setSortOrder] = useState('newest'); 

  useFocusEffect(
    useCallback(() => {
      fetchSavedItems();
    }, [])
  );

  const fetchSavedItems = async () => {
    setLoading(true);
    try {
      const myUserId = await AsyncStorage.getItem('userId');
      if (!myUserId) return;
      
      const storageKey = `savedListings_${myUserId}`; 
      const savedIdsStr = await AsyncStorage.getItem(storageKey);
      const savedIds = savedIdsStr ? JSON.parse(savedIdsStr) : [];

      if (savedIds.length === 0) {
        setSavedItems([]);
        setLoading(false);
        return;
      }

      const res = await fetch(`${API_BASE_URL}/api/listings`);
      if (res.ok) {
        const allListings = await res.json();
        
        const mappedItems = savedIds
          .map(id => allListings.find(item => (item.id || item._id) === id))
          .filter(Boolean); 
          
        setSavedItems(mappedItems);
      }
    } catch (error) {
      console.error("Eroare la descărcarea favoritelor:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveSaved = async (id) => {
    setSavedItems(prev => prev.filter(item => (item.id || item._id) !== id));
    
    try {
      const myUserId = await AsyncStorage.getItem('userId');
      const storageKey = `savedListings_${myUserId}`;
      
      const savedIdsStr = await AsyncStorage.getItem(storageKey);
      let savedIds = savedIdsStr ? JSON.parse(savedIdsStr) : [];
      savedIds = savedIds.filter(savedId => savedId !== id);
      await AsyncStorage.setItem(storageKey, JSON.stringify(savedIds));
    } catch(e) {
      console.error(e);
    }
  };

  const toggleSortOrder = () => {
    setSortOrder(prev => prev === 'newest' ? 'oldest' : 'newest');
  };

  let filteredAndSorted = savedItems.filter(item =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (sortOrder === 'newest') {
    filteredAndSorted = [...filteredAndSorted].reverse();
  }

  return {
    searchQuery, setSearchQuery,
    filteredItems: filteredAndSorted, 
    loading,
    handleRemoveSaved,
    sortOrder, toggleSortOrder
  };
};