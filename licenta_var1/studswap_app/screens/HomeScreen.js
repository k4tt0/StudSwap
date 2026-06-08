import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, FlatList, TouchableOpacity, Alert, TextInput } from 'react-native';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { styles } from '../styles/HomeScreenStyle';
import { colors } from '../styles/RegisterScreenStyle';
import { API_BASE_URL } from '../firebaseConfig';
import NavBar from '../components/NavBar';

const FILTER_OPTIONS = [
  { id: 'price', label: 'Price', icon: 'cash' },
  { id: 'category', label: 'Category', icon: 'tag' },
  { id: 'faculty', label: 'Faculty', icon: 'school' },
];

export default function HomeScreen({ navigation }) {
  const [userLocation, setUserLocation] = useState('Loading...');
  const [listings, setListings] = useState([]);
  const [filteredListings, setFilteredListings] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [activeFilters, setActiveFilters] = useState({});
  const [showFilters, setShowFilters] = useState(false);
  useEffect(() => {
    loadUserData();
    loadListings();
  }, []);

  useEffect(() => {
    applyFiltersAndSearch();
  }, [searchQuery, activeFilters, listings]);

  const loadUserData = async () => {
    try {
      // Get user ID from AsyncStorage
      const userId = await AsyncStorage.getItem('userId');
      
      console.log('DEBUG: userId from storage:', userId);
      
      if (!userId) {
        setUserLocation('Location Unknown');
        return;
      }
      
      // Fetch user data from backend API
      const response = await fetch(`${API_BASE_URL}/api/users/${userId}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      
      console.log('DEBUG: response status:', response.status);
      
      if (response.ok) {
        const userData = await response.json();
        console.log('DEBUG: userData:', userData);
        setUserLocation(userData.city || 'Location Unknown');
      } else {
        console.log('DEBUG: response not ok');
        setUserLocation('Location Unknown');
      }
    } catch (error) {
      console.error('Error loading user data:', error);
      setUserLocation('Location Unknown');
    }
  };

  const loadListings = async () => {
    try {
      setLoading(true);
      // TODO: You'll need to create this endpoint on your backend:
      // GET /api/listings - returns all listings
      // Response format should be:
      // [
      //   {
      //     id: 'listing1',
      //     title: 'Textbook: Mathematics',
      //     description: '...',
      //     price: 25,
      //     category: 'Textbooks',
      //     userId: 'user-id',
      //     userName: 'John Doe',
      //     location: 'Bucharest',
      //     faculty: 'Engineering',
      //     image: 'url or null',
      //     createdAt: timestamp,
      //     condition: 'Like New'
      //   }
      // ]
      
      const response = await fetch(`${API_BASE_URL}/api/listings`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });

      if (response.ok) {
        const listingsData = await response.json();
        setListings(listingsData);
        setFilteredListings(listingsData);
      } else {
        Alert.alert('Error', 'Failed to load listings');
      }
    } catch (error) {
      console.error('Error loading listings:', error);
      // Show empty state instead of error for now
    } finally {
      setLoading(false);
    }
  };

  const applyFiltersAndSearch = () => {
    let filtered = listings;

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(item =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Price filter
    if (activeFilters.priceRange) {
      const [min, max] = activeFilters.priceRange;
      filtered = filtered.filter(item => item.price >= min && item.price <= max);
    }

    // Category filter
    if (activeFilters.category) {
      filtered = filtered.filter(item => item.category === activeFilters.category);
    }

    // Faculty filter
    if (activeFilters.faculty) {
      filtered = filtered.filter(item => item.faculty === activeFilters.faculty);
    }

    setFilteredListings(filtered);
  };

  const handleFilterToggle = (filterId, value) => {
    setActiveFilters(prev => ({
      ...prev,
      [filterId]: prev[filterId] === value ? null : value
    }));
  };
  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.card} onPress={() => {/* Navigate to listing detail */}}>
      {/* Header Card */}
      <View style={styles.cardHeader}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{item.userName?.charAt(0) || 'U'}</Text>
        </View>
        <View style={styles.headerTextContainer}>
          <Text style={{ fontWeight: 'bold', color: colors.textDark }}>{item.title}</Text>
          <Text style={{ fontSize: 12, color: '#888' }}>{item.category}</Text>
        </View>
        <TouchableOpacity onPress={() => {/* Save to favorites */}}>
          <MaterialCommunityIcons name="heart-outline" size={24} color="#FF6B6B" />
        </TouchableOpacity>
      </View>

      {/* Image Card */}
      <View style={styles.imagePlaceholder}>
        {item.image ? (
          <Text style={{ color: '#888' }}>Image</Text>
        ) : (
          <MaterialCommunityIcons name="image-outline" size={80} color="#BDBDBD" />
        )}
      </View>

      {/* Footer Card */}
      <View style={styles.cardFooter}>
        <View style={styles.footerLines}>
          <Text style={{ fontWeight: 'bold', fontSize: 18, color: colors.textDark }}>
            ${item.price}
          </Text>
          <Text style={{ fontSize: 12, color: '#888', marginTop: 4 }}>
            {item.location} • {item.condition}
          </Text>
          <Text style={{ fontSize: 12, color: '#888', marginTop: 2 }}>
            {item.faculty || 'Various'}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      
      {/* HEADER: Locație & Căutare */}
      <View style={styles.headerContainer}>
        <View style={styles.locationPill}>
          <Ionicons name="location-outline" size={14} color={colors.textDark} />
          <Text style={styles.locationText}>{userLocation}</Text>
        </View>

        <TouchableOpacity 
          activeOpacity={0.7}
          style={styles.searchBar}
          onPress={() => setShowFilters(!showFilters)}
        >
          <Ionicons name="search" size={20} color="#888" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search items..."
            placeholderTextColor="#888"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </TouchableOpacity>
      </View>

      {/* FILTERS SCROLL */}
      <View>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false} 
          contentContainerStyle={styles.filtersContainer}
        >
          {FILTER_OPTIONS.map((filter) => (
            <TouchableOpacity 
              key={filter.id}
              style={[
                styles.filterPill,
                activeFilters[filter.id] && styles.filterPillActive
              ]}
              onPress={() => {
                if (filter.id === 'price') {
                  handleFilterToggle('priceRange', [0, 100]);
                } else {
                  handleFilterToggle(filter.id, filter.label);
                }
              }}
            >
              <MaterialCommunityIcons 
                name={filter.icon} 
                size={16} 
                color={activeFilters[filter.id] ? '#FFF' : colors.textDark}
                style={{ marginRight: 6 }}
              />
              <Text 
                style={[
                  styles.filterText,
                  activeFilters[filter.id] && styles.filterTextActive
                ]}
              >
                {filter.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* MAIN FEED (Lista cu postări) */}
      {loading ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text>Loading listings...</Text>
        </View>
      ) : (
        <FlatList
          data={filteredListings}
          keyExtractor={item => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.feedContainer}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: 40 }}>
              <MaterialCommunityIcons name="inbox-outline" size={80} color="#CCC" />
              <Text style={{ marginTop: 16, color: '#888', fontSize: 16 }}>
                No listings found
              </Text>
            </View>
          }
        />
      )}

      <NavBar navigation={navigation} activeScreen="Home" />

    </View>
  );
}