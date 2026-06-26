import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { collection, addDoc, setDoc, doc, serverTimestamp } from 'firebase/firestore';
import { db, API_BASE_URL } from '../firebaseConfig';

export const useHomeListings = () => {
  const [userLocation, setUserLocation] = useState('Location Unknown');
  const [currentUserId, setCurrentUserId] = useState(null);
  const [listings, setListings] = useState([]);
  const [filteredListings, setFilteredListings] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [savedIds, setSavedIds] = useState([]);
  const [infoModal, setInfoModal] = useState({ visible: false, title: '', message: '' });
  const closeInfoModal = () => setInfoModal(prev => ({ ...prev, visible: false }));

  const [filters, setFilters] = useState({
    minPrice: '', maxPrice: '', category: '', announcementType: '', condition: '', faculty: ''
  });

  useEffect(() => { loadUserData(); loadListings(); }, []);
  useFocusEffect(useCallback(() => { loadSavedIds(); }, []));
  useEffect(() => { applyFiltersAndSearch(); }, [searchQuery, filters, listings]);

  const loadUserData = async () => {
    try {
      const userId = await AsyncStorage.getItem('userId');
      if (!userId) return setUserLocation('Location Unknown');
      setCurrentUserId(userId);
      const response = await fetch(`${API_BASE_URL}/api/users/${userId}`);
      if (response.ok) {
        const userData = await response.json();
        setUserLocation(userData.city || 'Location Unknown');
      } else setUserLocation('Location Unknown');
    } catch (error) { setUserLocation('Location Unknown'); }
  };

  const loadSavedIds = async () => {
    try {
      const userId = await AsyncStorage.getItem('userId');
      if (!userId) return;
      const storageKey = `savedListings_${userId}`; 
      const savedIdsStr = await AsyncStorage.getItem(storageKey);
      setSavedIds(savedIdsStr ? JSON.parse(savedIdsStr) : []);
    } catch (e) { console.error(e); }
  };

  const loadListings = async () => {
    try {
      setLoading(true);
      const myUserId = await AsyncStorage.getItem('userId');

      // get my city so I only see listings from my own city (spec requirement)
      let myCity = null;
      if (myUserId) {
        const userRes = await fetch(`${API_BASE_URL}/api/users/${myUserId}`);
        if (userRes.ok) {
          const userData = await userRes.json();
          myCity = userData.city || null;
        }
      }

      const response = await fetch(`${API_BASE_URL}/api/listings`);
      if (response.ok) {
        const listingsData = await response.json();
        const visible = listingsData.filter(item => {
          if (item.userId === myUserId) return false;        // not my own
          if (item.status === 'sold') return false;          // hide sold
          if (myCity && item.location && item.location !== myCity) return false; // same city only
          return true;
        });
        const sortedData = visible.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setListings(sortedData);
        setFilteredListings(sortedData);
      } else {
        setInfoModal({ visible: true, title: 'Error', message: 'Failed to load listings. Please try again.' });
      }
    } catch (error) {
      console.error('Error loading listings:', error);
      setInfoModal({ visible: true, title: 'Connection Error', message: 'Could not reach the server. Check your connection and try again.' });
    } finally {
      setLoading(false);
    }
  };

  const toggleLike = async (itemId) => {
    try {
      const userId = await AsyncStorage.getItem('userId');
      if (!userId) return;
      const storageKey = `savedListings_${userId}`; 

      let newSavedIds = [...savedIds];
      const isLiking = !newSavedIds.includes(itemId);

      if (isLiking) {
        newSavedIds.push(itemId);
        const listing = listings.find(l => (l.id || l._id) === itemId);
        
        if (listing && listing.userId !== userId) {
          const userRes = await fetch(`${API_BASE_URL}/api/users/${userId}`);
          let senderName = 'Someone';
          if (userRes.ok) {
            const userData = await userRes.json();
            senderName = userData.displayName || 'Someone';
          }

          const notifId = `like_${userId}_${itemId}`;
          await setDoc(doc(db, 'Notifications', notifId), {
            receiverId: listing.userId,
            senderId: userId,
            senderName: senderName,
            listingId: itemId,
            type: 'like',
            text: `${senderName} saved your listing "${listing.title}".`,
            isRead: false,
            timestamp: serverTimestamp()
          });
        }
      } else {
        newSavedIds = newSavedIds.filter(id => id !== itemId);
      }
      
      setSavedIds(newSavedIds);
      await AsyncStorage.setItem(storageKey, JSON.stringify(newSavedIds));
    } catch (error) { console.error(error); }
  };

  const applyFiltersAndSearch = () => {
    let filtered = listings;
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(item => item.title?.toLowerCase().includes(q) || item.description?.toLowerCase().includes(q));
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
    setFilters(prev => ({ ...prev, [key]: prev[key] === value ? '' : value }));
  };
  const clearFilters = () => setFilters({ minPrice: '', maxPrice: '', category: '', announcementType: '', condition: '', faculty: '' });

  return { userLocation, filteredListings, searchQuery, setSearchQuery, loading, filters, updateFilter, clearFilters, setFilters, savedIds, toggleLike, infoModal, closeInfoModal };
};