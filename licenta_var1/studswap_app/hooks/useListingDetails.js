import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL } from '../firebaseConfig'; 

export const useListingDetails = (currentListing, navigation) => {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  
  const [isViewerVisible, setIsViewerVisible] = useState(false);
  const [viewerIndex, setViewerIndex] = useState(0);

  const openImageViewer = (index) => {
    setViewerIndex(index);
    setIsViewerVisible(true);
  };

  const closeImageViewer = () => {
    setIsViewerVisible(false);
  };

  const [sellerListings, setSellerListings] = useState([]);
  const [similarListings, setSimilarListings] = useState([]);
  const [loadingExtra, setLoadingExtra] = useState(true);

  useEffect(() => {
    const fetchExtraListings = async () => {
      if (!currentListing) return;
      
      try {
        setLoadingExtra(true);
        const res = await fetch(`${API_BASE_URL}/api/listings`);
        if (res.ok) {
          const allListings = await res.json();
          
          const sellerItems = allListings.filter(
            item => item.userId === currentListing.userId && item.id !== currentListing.id
          );
          
          const similarItems = allListings.filter(
            item => item.category === currentListing.category && 
                    item.userId !== currentListing.userId &&
                    item.id !== currentListing.id
          );

          setSellerListings(sellerItems);
          setSimilarListings(similarItems);
        }
      } catch (error) {
        console.error("Eroare la descărcarea anunțurilor extra:", error);
      } finally {
        setLoadingExtra(false);
      }
    };

    fetchExtraListings();
  }, [currentListing]);

  const handleScroll = (event) => {
    const slideSize = event.nativeEvent.layoutMeasurement.width;
    const index = event.nativeEvent.contentOffset.x / slideSize;
    const roundIndex = Math.round(index);
    
    if (roundIndex !== activeImageIndex) {
      setActiveImageIndex(roundIndex);
    }
  };

  const handleContactSeller = async (sellerId, sellerName) => {
    try {
      const myUserId = await AsyncStorage.getItem('userId');
      if (!myUserId) return;

      if (myUserId === sellerId) {
        alert("Acesta este anunțul tău!");
        return;
      }

      const chatId = [myUserId, sellerId].sort().join('_') + `_${currentListing.id || currentListing._id}`;

      navigation.navigate('ChatRoom', {
        chatId: chatId,
        otherUserId: sellerId,
        otherUserName: sellerName,
        listingId: currentListing.id || currentListing._id
      });
    } catch (error) {
      console.error(error);
    }
  };

  return {
    activeImageIndex, handleScroll, handleContactSeller,
    sellerListings, similarListings, loadingExtra,
    isViewerVisible, viewerIndex, openImageViewer, closeImageViewer
  };
};