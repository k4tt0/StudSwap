import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, FlatList, TouchableOpacity, Alert } from 'react-native';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { styles } from '../styles/HomeScreenStyle';
import { colors } from '../styles/RegisterScreenStyle';
import NavBar from '../components/NavBar';

export default function SavedListingsScreen({ navigation }) {
  const [savedListings, setSavedListings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Fetch saved listings from Firebase
    // For now, show empty state
    setLoading(false);
  }, []);

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{item.userName?.charAt(0) || 'U'}</Text>
        </View>
        <View style={styles.headerTextContainer}>
          <Text style={{ fontWeight: 'bold', color: colors.textDark }}>{item.title}</Text>
          <Text style={{ fontSize: 12, color: '#888' }}>{item.category}</Text>
        </View>
        <TouchableOpacity>
          <MaterialCommunityIcons name="heart" size={24} color="#FF6B6B" />
        </TouchableOpacity>
      </View>

      <View style={styles.imagePlaceholder}>
        {item.image ? (
          <Text style={{ color: '#888' }}>Image</Text>
        ) : (
          <MaterialCommunityIcons name="image-outline" size={80} color="#BDBDBD" />
        )}
      </View>

      <View style={styles.cardFooter}>
        <View style={styles.footerLines}>
          <Text style={{ fontWeight: 'bold', fontSize: 16, color: colors.textDark }}>
            ${item.price}
          </Text>
          <Text style={{ fontSize: 12, color: '#888', marginTop: 4 }}>
            {item.location}
          </Text>
        </View>
        <TouchableOpacity style={{ padding: 8 }}>
          <MaterialCommunityIcons name="heart-outline" size={24} color="#FF6B6B" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={{ fontSize: 18, fontWeight: 'bold', color: colors.textDark }}>
          Saved Listings
        </Text>
      </View>

      {savedListings.length === 0 ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <MaterialCommunityIcons name="heart-outline" size={80} color="#CCC" />
          <Text style={{ marginTop: 16, color: '#888', fontSize: 16 }}>
            No saved listings yet
          </Text>
        </View>
      ) : (
        <FlatList
          data={savedListings}
          keyExtractor={item => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.feedContainer}
          showsVerticalScrollIndicator={false}
        />
      )}

      <NavBar navigation={navigation} activeScreen="Saved" />
    </View>
  );
}
