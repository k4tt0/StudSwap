import React, { useState, useRef, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, ScrollView, Dimensions } from 'react-native';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { Image } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import NavBar from '../components/NavBar';
import { useTheme } from '../context/ThemeContext'; 
import { getMessagesStyles } from '../styles/MessagesScreenStyle';
import { useMessages } from '../hooks/useMessages';
import { useNotifications } from '../hooks/useNotifications';

import ConfirmModal from '../components/ConfirmModal'; 
import { deleteDoc, doc } from 'firebase/firestore'; 
import { db } from '../firebaseConfig';

const { width } = Dimensions.get('window');

export default function MessagesScreen({ navigation }) {
  const { colors, isDarkMode } = useTheme(); 
  const styles = getMessagesStyles(colors);
  const insets = useSafeAreaInsets();
  
  const { chats, loading: chatsLoading, currentUserId } = useMessages();
  const { notifications, markAllAsRead } = useNotifications();
  
  const [activeTab, setActiveTab] = useState('chats'); 
  const scrollViewRef = useRef(null);

  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [chatToDelete, setChatToDelete] = useState(null);

  useEffect(() => {
    if (activeTab === 'notifications') markAllAsRead();
  }, [activeTab, notifications]);

  const handleTabPress = (tabName) => {
    setActiveTab(tabName);
    if (scrollViewRef.current) scrollViewRef.current.scrollTo({ x: tabName === 'chats' ? 0 : width, animated: true });
  };

  const handleScroll = (event) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const currentIndex = Math.round(contentOffsetX / width);
    setActiveTab(currentIndex === 0 ? 'chats' : 'notifications');
  };

  const handleLongPressChat = (chatId) => {
    setChatToDelete(chatId);
    setDeleteModalVisible(true);
  };

  const confirmDeleteChat = async () => {
    if (!chatToDelete) return;
    try {
      await deleteDoc(doc(db, 'Chats', chatToDelete));
    } catch (error) {
      console.error("Error deleting chat: ", error);
    } finally {
      setDeleteModalVisible(false);
      setChatToDelete(null);
    }
  };

  const renderChatItem = ({ item }) => {
    const isUnread = !item.isRead && item.lastMessageSenderId !== currentUserId;
    return (
      <TouchableOpacity 
        style={[
          styles.chatCard,
          isUnread && { borderColor: colors.accent, backgroundColor: isDarkMode ? '#1E2A22' : '#F4F9F5' }
        ]} 
        activeOpacity={0.7} 
        onPress={() => navigation.navigate('ChatRoom', { chatId: item.id, otherUserId: item.otherUserId, otherUserName: item.otherUserName, listingId: item.listingId })}
        onLongPress={() => handleLongPressChat(item.id)} // DECLANȘEAZĂ ȘTERGEREA
      >
        {item.listingImage ? <Image source={{ uri: item.listingImage }} style={styles.listingAvatar} /> : <View style={[styles.listingAvatar, { justifyContent: 'center', alignItems: 'center' }]}><MaterialCommunityIcons name="image-outline" size={24} color={colors.muted} /></View>}
        <View style={styles.chatInfo}>
          <Text style={[styles.chatName, isUnread && { fontWeight: '900', color: colors.textDark }]}>{item.otherUserName}</Text>
          <Text style={[styles.lastMessage, isUnread && { fontWeight: 'bold', color: colors.textDark }]} numberOfLines={1}>{item.lastMessage}</Text>
        </View>
        <View style={{ alignItems: 'flex-end' }}>
          <Text style={styles.timeText}>{item.timeString}</Text>
          {isUnread && <View style={{ width: 12, height: 12, borderRadius: 6, backgroundColor: colors.accent, marginTop: 5, marginRight: 10 }} />}
        </View>
      </TouchableOpacity>
    );
  };

  const renderNotificationItem = ({ item }) => {
    const isUnread = item.isRead === false;

    const handleNotificationPress = () => {
      if (!item.senderId || !item.listingId || !currentUserId) return;
      
      const chatId = [currentUserId, item.senderId].sort().join('_') + `_${item.listingId}`;
      
      navigation.navigate('ChatRoom', {
        chatId: chatId,
        otherUserId: item.senderId,
        otherUserName: item.senderName || 'Student',
        listingId: item.listingId
      });
    };

    return (
      <TouchableOpacity 
        style={[
          styles.chatCard, 
          isUnread && { backgroundColor: isDarkMode ? '#1E2A22' : '#F4F9F5', borderColor: colors.accent }
        ]} 
        activeOpacity={item.senderId ? 0.7 : 1} 
        onPress={handleNotificationPress}
        disabled={!item.senderId} 
      >
        <View style={[styles.listingAvatar, { backgroundColor: item.type === 'like' ? colors.accent : colors.muted, justifyContent: 'center', alignItems: 'center' }]}>
          <Ionicons name={item.type === 'like' ? "heart" : "notifications"} size={22} color="#FFF" />
        </View>
        <View style={styles.chatInfo}>
          <Text style={[styles.lastMessage, { color: colors.textDark, fontWeight: isUnread ? 'bold' : '500' }]}>{item.text}</Text>
        </View>
        <View style={{ alignItems: 'flex-end' }}>
          <Text style={[styles.timeText, isUnread && { fontWeight: 'bold', color: colors.accent }]}>{item.time}</Text>
          {isUnread && <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: colors.accent, marginTop: 5, marginRight: 8 }} />}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={[styles.headerContainer, { paddingTop: insets.top + 10 }]}>
        <Text style={styles.headerTitle}>Inbox</Text>
        <View style={styles.twitterTabBar}>
          <TouchableOpacity style={styles.twitterTab} onPress={() => handleTabPress('chats')}><Text style={[styles.twitterTabText, { color: activeTab === 'chats' ? colors.textDark : colors.muted }]}>Chats</Text>{activeTab === 'chats' && <View style={styles.activeIndicator} />}</TouchableOpacity>
          <TouchableOpacity style={styles.twitterTab} onPress={() => handleTabPress('notifications')}><Text style={[styles.twitterTabText, { color: activeTab === 'notifications' ? colors.textDark : colors.muted }]}>Notifications</Text>{activeTab === 'notifications' && <View style={styles.activeIndicator} />}</TouchableOpacity>
        </View>
      </View>
      <ScrollView ref={scrollViewRef} horizontal pagingEnabled showsHorizontalScrollIndicator={false} onMomentumScrollEnd={handleScroll} style={{ flex: 1 }}>
        <View style={{ width: width }}>
          {chatsLoading ? <View style={styles.emptyContainer}><ActivityIndicator size="large" color={colors.accent} /></View> : <FlatList data={chats} keyExtractor={item => item.id} renderItem={renderChatItem} contentContainerStyle={styles.feedContainer} showsVerticalScrollIndicator={false} ListEmptyComponent={<View style={styles.emptyContainer}><MaterialCommunityIcons name="chat-outline" size={70} color={colors.inputBorder} /><Text style={styles.emptyText}>No conversations yet</Text></View>} />}
        </View>
        <View style={{ width: width }}>
          <FlatList data={notifications} keyExtractor={item => item.id} renderItem={renderNotificationItem} contentContainerStyle={styles.feedContainer} showsVerticalScrollIndicator={false} ListEmptyComponent={<View style={styles.emptyContainer}><Ionicons name="notifications-off-outline" size={70} color={colors.inputBorder} /><Text style={styles.emptyText}>No recent notifications.</Text></View>} />
        </View>
      </ScrollView>
      <NavBar navigation={navigation} activeScreen="Messages" />

      {/* sterhege chat modal */}
      <ConfirmModal
        visible={deleteModalVisible}
        title="Delete Chat"
        message="Are you sure you want to permanently delete this conversation?"
        confirmText="Delete"
        cancelText="Cancel"
        colors={colors}
        onConfirm={confirmDeleteChat}
        onCancel={() => {
          setDeleteModalVisible(false);
          setChatToDelete(null);
        }}
      />
    </View>
  );
}