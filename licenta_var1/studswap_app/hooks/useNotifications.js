import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { collection, query, where, onSnapshot, doc, setDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';

export const useNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let unsubscribe;
    const fetchNotifs = async () => {
      const userId = await AsyncStorage.getItem('userId');
      if (!userId) return setLoading(false);

      const q = query(collection(db, 'Notifications'), where('receiverId', '==', userId));
      unsubscribe = onSnapshot(q, (snapshot) => {
        const loaded = [];
        snapshot.forEach(doc => {
          const data = doc.data();
          let time = '';
          if (data.timestamp) {
            const date = data.timestamp.toDate();
            time = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
          }
          loaded.push({ id: doc.id, ...data, time, rawTime: data.timestamp?.toMillis() || 0 });
        });
        loaded.sort((a, b) => b.rawTime - a.rawTime);
        setNotifications(loaded);
        setLoading(false);
      });
    };
    fetchNotifs();
    return () => { if (unsubscribe) unsubscribe(); };
  }, []);

  const markAllAsRead = () => {
    const unread = notifications.filter(n => n.isRead === false);
    unread.forEach(async (n) => {
      try {
        await setDoc(doc(db, 'Notifications', n.id), { isRead: true }, { merge: true });
      } catch(e) {}
    });
  };

  return { notifications, loading, markAllAsRead };
};