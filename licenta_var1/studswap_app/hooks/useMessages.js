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
      if (!userId) {
        setLoading(false);
        return;
      }
      setCurrentUserId(userId);

      try {
        const chatsRef = collection(db, 'Chats');
        const q = query(chatsRef, where('participantIds', 'array-contains', userId));

        unsubscribe = onSnapshot(q, async (snapshot) => {
          const loadedChats = [];
          
          for (const docSnapshot of snapshot.docs) {
            const data = docSnapshot.data();
            const otherUserId = data.participantIds.find(id => id !== userId);
            
            let otherUserName = "Student";
            try {
              const res = await fetch(`${API_BASE_URL}/api/users/${otherUserId}`);
              if (res.ok) {
                const userData = await res.json();
                otherUserName = userData.displayName || "Student";
              }
            } catch (e) {
              console.error("Nu am putut aduce datele studentului:", e);
            }

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
              timeString,
              rawTime: data.lastMessageTime?.toMillis() || 0
            });
          }

          loadedChats.sort((a, b) => b.rawTime - a.rawTime);
          
          setChats(loadedChats);
          setLoading(false);
        }, 
        (error) => {
          console.error("Firebase onSnapshot error:", error);
          setLoading(false);
        });
      } catch (error) {
        console.error("Firebase setup error:", error);
        setLoading(false);
      }
    };

    fetchChats();

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  return { chats, loading, currentUserId };
};