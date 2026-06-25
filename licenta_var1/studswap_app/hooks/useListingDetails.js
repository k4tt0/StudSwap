import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { API_BASE_URL, db } from '../firebaseConfig'; 

export const useListingDetails = (currentListing, navigation) => {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isViewerVisible, setIsViewerVisible] = useState(false);
  const [viewerIndex, setViewerIndex] = useState(0);

  const openImageViewer = (index) => { setViewerIndex(index); setIsViewerVisible(true); };
  const closeImageViewer = () => setIsViewerVisible(false);

  const [sellerListings, setSellerListings] = useState([]);
  const [similarListings, setSimilarListings] = useState([]);
  const [loadingExtra, setLoadingExtra] = useState(true);

  const [seller, setSeller] = useState({
    _id: currentListing?.userId || null,
    name: currentListing?.userName || 'Student',
    university: '',
    avatar: null,
  });

  useEffect(() => {
    const fetchSeller = async () => {
      if (!currentListing?.userId) return;
      try {
        const res = await fetch(`${API_BASE_URL}/api/users/${currentListing.userId}`);
        if (res.ok) {
          const userData = await res.json();
          setSeller({
            _id: currentListing.userId,
            name: userData.displayName || currentListing.userName || 'Student',
            university: userData.university || '',
            avatar: userData.profileImageUrl || null,
          });
        }
      } catch (error) {
        console.error('Error fetching seller:', error);
      }
    };
    fetchSeller();
  }, [currentListing]);

  useEffect(() => {
    const fetchExtraListings = async () => {
      if (!currentListing) return;
      try {
        setLoadingExtra(true);

        // current user's city
        const myUserId = await AsyncStorage.getItem('userId');
        let myCity = null;
        if (myUserId) {
          const userRes = await fetch(`${API_BASE_URL}/api/users/${myUserId}`);
          if (userRes.ok) {
            const userData = await userRes.json();
            myCity = userData.city || null;
          }
        }

        const res = await fetch(`${API_BASE_URL}/api/listings`);
        if (res.ok) {
          const allListings = await res.json();
          const thisId = currentListing.id || currentListing._id;

          const sameCity = (item) => !myCity || !item.location || item.location === myCity;
          const notSold = (item) => item.status !== 'sold';

          const sellerItems = allListings.filter(item =>
            item.userId === currentListing.userId &&
            (item.id || item._id) !== thisId &&
            notSold(item)
          );
          const similarItems = allListings.filter(item =>
            item.category === currentListing.category &&
            item.userId !== currentListing.userId &&
            item.userId !== myUserId &&
            (item.id || item._id) !== thisId &&
            sameCity(item) &&
            notSold(item)
          );
          setSellerListings(sellerItems);
          setSimilarListings(similarItems);
        }
      } catch (error) { console.error(error); }
      finally { setLoadingExtra(false); }
    };
    fetchExtraListings();
  }, [currentListing]);

  const handleScroll = (event) => {
    const slideSize = event.nativeEvent.layoutMeasurement.width;
    const index = Math.round(event.nativeEvent.contentOffset.x / slideSize);
    if (index !== activeImageIndex) setActiveImageIndex(index);
  };

  const handleContactSeller = async (sellerId, sellerName) => {
    try {
      const myUserId = await AsyncStorage.getItem('userId');
      if (!myUserId) return;
      if (myUserId === sellerId) return alert("This is your own listing!");

      const chatId = [myUserId, sellerId].sort().join('_') + `_${currentListing.id || currentListing._id}`;
      navigation.navigate('ChatRoom', {
        chatId, otherUserId: sellerId, otherUserName: sellerName, listingId: currentListing.id || currentListing._id
      });
    } catch (error) { console.error(error); }
  };

  const handleDeleteListing = () => {
    Alert.alert("Delete Listing", "Are you sure you want to delete this listing?", [
      { text: "Cancel", style: "cancel" },
      { text: "Delete", style: "destructive", onPress: async () => {
          try {
            const idToDelete = currentListing.id || currentListing._id;
            const res = await fetch(`${API_BASE_URL}/api/listings/${idToDelete}`, { method: 'DELETE' });
            if (res.ok) {
              Alert.alert("Deleted", "Your listing has been removed.");
              navigation.navigate('Profile'); 
            } else {
              Alert.alert("Error", "Failed to delete.");
            }
          } catch (error) { Alert.alert("Error", "Network error."); }
      }}
    ]);
  };

  const handleMarkAsSold = (currentStatusValue, onDone) => {
    const isSold = currentStatusValue === 'sold';
    const newStatus = isSold ? 'active' : 'sold';
    const actionLabel = isSold ? 'mark as available' : 'mark as sold';

    Alert.alert(
      isSold ? 'Mark as Available' : 'Mark as Sold',
      `Are you sure you want to ${actionLabel}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Confirm',
          onPress: async () => {
            try {
              const id = currentListing.id || currentListing._id;
              const res = await fetch(`${API_BASE_URL}/api/listings/${id}/status`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus }),
              });
              if (res.ok) {
                Alert.alert('Done', `Listing marked as ${newStatus === 'sold' ? 'sold' : 'available'}.`);
                if (onDone) onDone(newStatus);
              } else {
                Alert.alert('Error', 'Could not update the listing status.');
              }
            } catch (error) {
              Alert.alert('Error', 'Network error. Please try again.');
            }
          },
        },
      ]
    );
  };

  return { activeImageIndex, handleScroll, handleContactSeller, sellerListings, similarListings, loadingExtra, isViewerVisible, viewerIndex, openImageViewer, closeImageViewer, handleDeleteListing, handleMarkAsSold, seller };
};