import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { styles } from '../styles/HomeScreenStyle';
import { colors } from '../styles/RegisterScreenStyle';
import NavBar from '../components/NavBar';

export default function MessagesScreen({ navigation }) {
  const [messages, setMessages] = useState([]);

  const renderItem = ({ item }) => (
    <TouchableOpacity style={[styles.card, { marginBottom: 12 }]}>
      <View style={styles.cardHeader}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{item.senderName?.charAt(0) || 'U'}</Text>
        </View>
        <View style={styles.headerTextContainer}>
          <Text style={{ fontWeight: 'bold', color: colors.textDark }}>
            {item.senderName}
          </Text>
          <Text style={{ fontSize: 12, color: '#888' }} numberOfLines={1}>
            {item.lastMessage}
          </Text>
        </View>
        <Text style={{ fontSize: 11, color: '#888' }}>
          {item.timestamp}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={{ fontSize: 18, fontWeight: 'bold', color: colors.textDark }}>
          Messages
        </Text>
      </View>

      {messages.length === 0 ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <MaterialCommunityIcons name="chat-outline" size={80} color="#CCC" />
          <Text style={{ marginTop: 16, color: '#888', fontSize: 16 }}>
            No messages yet
          </Text>
        </View>
      ) : (
        <FlatList
          data={messages}
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
