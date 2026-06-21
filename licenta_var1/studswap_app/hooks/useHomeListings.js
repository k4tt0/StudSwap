import { useState, useEffect, useCallback } from 'react';
import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { API_BASE_URL } from '../firebaseConfig';

export const useHomeListings = () => {
  const [userLocation, setUserLocation] = useState('Location Unknown');
  const [listings, setListings] = useState([]);
  const [filteredListings, setFilteredListings] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [savedIds, setSavedIds] = useState([]); 

  const [filters, setFilters] = useState({
    minPrice: '', maxPrice: '', category: '', announcementType: '', condition: '', faculty: ''
  });

  useEffect(() => {
    loadUserData();
    loadListings();
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadSavedIds();
    }, [])
  );

  useEffect(() => {
    applyFiltersAndSearch();
  }, [searchQuery, filters, listings]);

  const loadUserData = async () => {
    try {
      const userId = await AsyncStorage.getItem('userId');
      if (!userId) {
        setUserLocation('Location Unknown');
        return;
      }
      
      const response = await fetch(`${API_BASE_URL}/api/users/${userId}`);
      if (response.ok) {
        const userData = await response.json();
        setUserLocation(userData.city || 'Location Unknown');
      } else {
        setUserLocation('Location Unknown');
      }
    } catch (error) {
      setUserLocation('Location Unknown');
    }
  };

  const loadSavedIds = async () => {
    try {
      const savedIdsStr = await AsyncStorage.getItem('savedListings');
      if (savedIdsStr) {
        setSavedIds(JSON.parse(savedIdsStr));
      } else {
        setSavedIds([]);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const loadListings = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/api/listings`);
      if (response.ok) {
        const listingsData = await response.json();
        const sortedData = listingsData.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setListings(sortedData);
        setFilteredListings(sortedData);
      } else {
        Alert.alert('Error', 'Failed to load listings');
      }
    } catch (error) {
      console.error('Error loading listings:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleLike = async (itemId) => {
    try {
      let newSavedIds = [...savedIds];
      if (newSavedIds.includes(itemId)) {
        newSavedIds = newSavedIds.filter(id => id !== itemId);
      } else {
        newSavedIds.push(itemId);
      }
      setSavedIds(newSavedIds);
      await AsyncStorage.setItem('savedListings', JSON.stringify(newSavedIds));
    } catch (error) {
      console.error(error);
    }
  };

  const applyFiltersAndSearch = () => {
    let filtered = listings;

    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(item =>
        item.title?.toLowerCase().includes(q) ||
        item.description?.toLowerCase().includes(q)
      );
    }

    if (filters.minPrice !== '') filtered = filtered.filter(item => item.price >= parseFloat(filters.minPrice));
    if (filters.maxPrice !== '') filtered = filtered.filter(item => item.price <= parseFloat(filters.maxPrice));
    if (filters.category !== '') filtered = filtered.filter(item => item.category === filters.category);
    if (filters.announcementType !== '') filtered = filtered.filter(item => item.announcementType === filters.announcementType);
    if (filters.condition !== '') filtered = filtered.filter(item => item.condition === filters.condition);
    if (filters.faculty !== '') filtered = filtered.filter(item => item.faculty === filters.faculty);

    setFilteredListings(filtered);
  };

  const updateFilter = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: prev[key] === value ? '' : value 
    }));
  };

  const clearFilters = () => {
    setFilters({ minPrice: '', maxPrice: '', category: '', announcementType: '', condition: '', faculty: '' });
  };

  return {
    userLocation, filteredListings, searchQuery, setSearchQuery, loading, filters, 
    updateFilter, clearFilters, setFilters,
    savedIds, toggleLike 
  };
};