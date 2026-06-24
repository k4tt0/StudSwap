import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db, API_BASE_URL } from '../firebaseConfig';

export const useMessages = () => {
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState(null);

  useEffect(() => {
    let unsubscribe;

    const fetchChats = async () => {
      const userId = await AsyncStorage.getItem('userId');
      if (!userId) return setLoading(false);
      setCurrentUserId(userId);

      try {
        const chatsRef = collection(db, 'Chats');
        const q = query(chatsRef, where('participantIds', 'array-contains', userId));

        unsubscribe = onSnapshot(q, async (snapshot) => {
          let allListings = [];
          try {
            const listingsRes = await fetch(`${API_BASE_URL}/api/listings`);
            if (listingsRes.ok) allListings = await listingsRes.json();
          } catch (e) { console.error(e); }

          const loadedChats = [];
          
          for (const docSnapshot of snapshot.docs) {
            const data = docSnapshot.data();
            const otherUserId = data.participantIds.find(id => id !== userId);
            
            const matchedListing = allListings.find(l => l.id === data.listingId || l._id === data.listingId);
            const listingImage = matchedListing?.images && matchedListing.images.length > 0 ? matchedListing.images[0] : null;

            let otherUserName = "Student";
            try {
              const res = await fetch(`${API_BASE_URL}/api/users/${otherUserId}`);
              if (res.ok) {
                const userData = await res.json();
                otherUserName = userData.displayName || "Student";
              }
            } catch (e) { }

            let timeString = '';
            if (data.lastMessageTime) {
              const date = data.lastMessageTime.toDate();
              timeString = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            }

            loadedChats.push({
              id: docSnapshot.id,
              ...data,
              otherUserId,
              otherUserName,
              listingImage,
              timeString,
              isRead: data.isRead !== undefined ? data.isRead : true, 
              lastMessageSenderId: data.lastMessageSenderId, 
              rawTime: data.lastMessageTime?.toMillis() || 0
            });
          }

          loadedChats.sort((a, b) => b.rawTime - a.rawTime);
          setChats(loadedChats);
          setLoading(false);
        }, 
        (error) => { setLoading(false); });
      } catch (error) { setLoading(false); }
    };

    fetchChats();
    return () => { if (unsubscribe) unsubscribe(); };
  }, []);

  return { chats, loading, currentUserId };
};