import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp, doc, setDoc } from 'firebase/firestore';
import * as ImagePicker from 'expo-image-picker';
import { Alert } from 'react-native';
import { db, API_BASE_URL } from '../firebaseConfig';

export const useChatRoom = (chatId, listingId, otherUserId) => {
  const [currentUserId, setCurrentUserId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [listingData, setListingData] = useState(null);

  const [offerModalVisible, setOfferModalVisible] = useState(false);
  const [offerAmount, setOfferAmount] = useState('');

  useEffect(() => {
    const initializeChat = async () => {
      const id = await AsyncStorage.getItem('userId');
      setCurrentUserId(id);
      if (listingId) {
        try {
          const res = await fetch(`${API_BASE_URL}/api/listings`);
          if (res.ok) {
            const allListings = await res.json();
            setListingData(allListings.find(item => item.id === listingId || item._id === listingId));
          }
        } catch (e) { console.error(e); }
      }
    };
    initializeChat();
  }, [listingId]);

  useEffect(() => {
    if (!chatId) return;
    const q = query(collection(db, 'Chats', chatId, 'Messages'), orderBy('timestamp', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setMessages(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsubscribe();
  }, [chatId]);

  useEffect(() => {
    if (!chatId || !currentUserId || messages.length === 0) return;
    const lastMsg = messages[0];
    if (lastMsg.senderId !== currentUserId) {
      setDoc(doc(db, 'Chats', chatId), { isRead: true }, { merge: true }).catch(e => console.log(e));
    }
  }, [messages, chatId, currentUserId]);

  const sendMessage = async (textToSend = null, type = 'text', extraData = {}) => {
    const text = textToSend || newMessage.trim();
    if (!text || !currentUserId) return;

    try {
      if (!textToSend) setNewMessage('');
      
      await addDoc(collection(db, 'Chats', chatId, 'Messages'), {
        senderId: currentUserId,
        text: text,
        type: type,
        ...extraData,
        timestamp: serverTimestamp()
      });

      await setDoc(doc(db, 'Chats', chatId), {
        chatId, listingId,
        participantIds: [currentUserId, otherUserId],
        lastMessage: type === 'offer' ? `New Offer: ${extraData.offerAmount} RON` : (text.startsWith('file:/') || text.startsWith('http') ? 'Sent an image' : text),
        lastMessageSenderId: currentUserId,
        isRead: false,
        lastMessageTime: serverTimestamp()
      }, { merge: true });
    } catch (error) { console.error(error); }
  };

  const submitOffer = () => {
    if (!offerAmount || isNaN(offerAmount)) {
      Alert.alert('Invalid', 'Please enter a valid number.');
      return;
    }
    sendMessage(`Offer of ${offerAmount} RON`, 'offer', { offerAmount: Number(offerAmount), offerStatus: 'pending' });
    setOfferModalVisible(false);
    setOfferAmount('');
  };

  const updateOfferStatus = async (messageId, newStatus) => {
    try {
      await setDoc(doc(db, 'Chats', chatId, 'Messages', messageId), { offerStatus: newStatus }, { merge: true });
      const replyText = newStatus === 'accepted' ? "I accepted your offer!" : "Sorry, I declined your offer.";
      sendMessage(replyText);
    } catch (error) { console.error(error); }
  };

  const handleSendPhoto = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) return Alert.alert('Permission Denied', 'We need access to your photos.');
    
    const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, allowsEditing: false, quality: 0.6 });
    if (!result.canceled && result.assets) {
      sendMessage(result.assets[0].uri); 
    }
  };

  return { 
    messages, newMessage, setNewMessage, listingData, currentUserId, sendMessage, handleSendPhoto,
    offerModalVisible, setOfferModalVisible, offerAmount, setOfferAmount, submitOffer, updateOfferStatus 
  };
};