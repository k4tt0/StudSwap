import React from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import NavBar from '../components/NavBar';
import { useTheme } from '../context/ThemeContext'; 
import { getMessagesStyles } from '../styles/MessagesScreenStyle';
import { useMessages } from '../hooks/useMessages';

export default function MessagesScreen({ navigation }) {
  const { colors } = useTheme();
  const styles = getMessagesStyles(colors);
  
  // Totul vine "gata făcut" din hook-ul nostru!
  const { chats, loading } = useMessages();

  const renderItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.chatCard}
      activeOpacity={0.7}
      onPress={() => navigation.navigate('ChatRoom', {
        chatId: item.id,
        otherUserId: item.otherUserId,
        otherUserName: item.otherUserName,
        listingId: item.listingId
      })}
    >
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>{item.otherUserName?.charAt(0) || 'U'}</Text>
      </View>
      
      <View style={styles.chatInfo}>
        <Text style={styles.chatName}>{item.otherUserName}</Text>
        <Text style={styles.lastMessage} numberOfLines={1}>
          {item.lastMessage || 'Sent a photo...'}
        </Text>
      </View>

      <Text style={styles.timeText}>{item.timeString}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      
      <View style={styles.headerContainer}>
        <Text style={styles.headerTitle}>Messages</Text>
      </View>

      {loading ? (
        <View style={styles.emptyContainer}>
          <ActivityIndicator size="large" color={colors.accent} />
        </View>
      ) : chats.length === 0 ? (
        <View style={styles.emptyContainer}>
          <MaterialCommunityIcons name="chat-outline" size={80} color={colors.inputBorder} />
          <Text style={styles.emptyText}>No messages yet</Text>
        </View>
      ) : (
        <FlatList
          data={chats}
          keyExtractor={item => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.feedContainer}
          showsVerticalScrollIndicator={false}
        />
      )}

      <NavBar navigation={navigation} activeScreen="Messages" />
    </View>
  );
}