import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import NavBar from '../components/NavBar';
import { useTheme } from '../context/ThemeContext'; 
import { getHomeStyles } from '../styles/HomeScreenStyle';

export default function SavedListingsScreen({ navigation }) {
  const { colors } = useTheme();
  const styles = getHomeStyles(colors);

  const [savedListings, setSavedListings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Fetch saved listings from Firebase
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
          <Text style={{ fontSize: 12, color: colors.muted }}>{item.category}</Text>
        </View>
        <TouchableOpacity>
          <MaterialCommunityIcons name="heart" size={24} color={colors.accent} />
        </TouchableOpacity>
      </View>

      <View style={styles.imagePlaceholder}>
        {item.image ? (
          <Text style={{ color: colors.muted }}>Image</Text>
        ) : (
          <MaterialCommunityIcons name="image-outline" size={80} color={colors.muted} />
        )}
      </View>

      <View style={styles.cardFooter}>
        <View style={styles.footerLines}>
          <Text style={{ fontWeight: 'bold', fontSize: 16, color: colors.textDark }}>
            ${item.price}
          </Text>
          <Text style={{ fontSize: 12, color: colors.muted, marginTop: 4 }}>
            {item.location}
          </Text>
        </View>
        <TouchableOpacity style={{ padding: 8 }}>
          <MaterialCommunityIcons name="heart" size={24} color={colors.accent} />
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
          <MaterialCommunityIcons name="heart-outline" size={80} color={colors.inputBorder} />
          <Text style={{ marginTop: 16, color: colors.muted, fontSize: 16 }}>
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

      {/* Corrected to match exact spelling in NavBar.js */}
      <NavBar navigation={navigation} activeScreen="SavedListings" /> 
    </View>
  );
}