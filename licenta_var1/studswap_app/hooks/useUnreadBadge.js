import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '../firebaseConfig';

export const useUnreadBadge = () => {
  const [hasUnread, setHasUnread] = useState(false);

  useEffect(() => {
    let unsubChats;
    let unsubNotifs;

    const checkUnread = async () => {
      const userId = await AsyncStorage.getItem('userId');
      if (!userId) return;

      const qChats = query(collection(db, 'Chats'), where('participantIds', 'array-contains', userId));
      unsubChats = onSnapshot(qChats, (snapshot) => {
        let unreadC = false;
        snapshot.forEach(doc => {
          const data = doc.data();
          if (data.isRead === false && data.lastMessageSenderId !== userId) unreadC = true;
        });

        const qNotifs = query(collection(db, 'Notifications'), where('receiverId', '==', userId), where('isRead', '==', false));
        unsubNotifs = onSnapshot(qNotifs, (notifSnap) => {
          const unreadN = !notifSnap.empty;
          
          setHasUnread(unreadC || unreadN);
        });
      });
    };

    checkUnread();

    return () => {
      if (unsubChats) unsubChats();
      if (unsubNotifs) unsubNotifs();
    };
  }, []);

  return hasUnread;
};