import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, FlatList, TouchableOpacity, Alert, TextInput } from 'react-native';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getHomeStyles } from '../styles/HomeScreenStyle';
import { useTheme } from '../context/ThemeContext'; 
import { API_BASE_URL } from '../firebaseConfig';
import NavBar from '../components/NavBar';

const FILTER_OPTIONS = [
  { id: 'price', label: 'Price', icon: 'cash' },
  { id: 'category', label: 'Category', icon: 'tag' },
  { id: 'faculty', label: 'Faculty', icon: 'school' },
];

export default function HomeScreen({ navigation }) {
  const { colors } = useTheme(); // Grab dynamic colors
  const styles = getHomeStyles(colors); // Generate styles

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
      const userId = await AsyncStorage.getItem('userId');
      if (!userId) {
        setUserLocation('Location Unknown');
        return;
      }
      
      const response = await fetch(`${API_BASE_URL}/api/users/${userId}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      
      if (response.ok) {
        const userData = await response.json();
        setUserLocation(userData.city || 'Location Unknown');
      } else {
        setUserLocation('Location Unknown');
      }
    } catch (error) {
      setUserLocation('Location Unknown');
    }
  };

  const loadListings = async () => {
    try {
      setLoading(true);
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
    } finally {
      setLoading(false);
    }
  };

  const applyFiltersAndSearch = () => {
    let filtered = listings;

    if (searchQuery) {
      filtered = filtered.filter(item =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (activeFilters.priceRange) {
      const [min, max] = activeFilters.priceRange;
      filtered = filtered.filter(item => item.price >= min && item.price <= max);
    }

    if (activeFilters.category) {
      filtered = filtered.filter(item => item.category === activeFilters.category);
    }

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
    <TouchableOpacity style={styles.card} onPress={() => {/* Navigate to detail */}}>
      <View style={styles.cardHeader}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{item.userName?.charAt(0) || 'U'}</Text>
        </View>
        <View style={styles.headerTextContainer}>
          <Text style={{ fontWeight: 'bold', color: colors.textDark }}>{item.title}</Text>
          <Text style={{ fontSize: 12, color: colors.muted }}>{item.category}</Text>
        </View>
        <TouchableOpacity>
          <MaterialCommunityIcons name="heart-outline" size={24} color={colors.accent} />
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
          <Text style={{ fontWeight: 'bold', fontSize: 18, color: colors.textDark }}>
            ${item.price}
          </Text>
          <Text style={{ fontSize: 12, color: colors.muted, marginTop: 4 }}>
            {item.location} • {item.condition}
          </Text>
          <Text style={{ fontSize: 12, color: colors.muted, marginTop: 2 }}>
            {item.faculty || 'Various'}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      
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
          <Ionicons name="search" size={20} color={colors.muted} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search items..."
            placeholderTextColor={colors.muted}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </TouchableOpacity>
      </View>

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

      {loading ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ color: colors.textDark }}>Loading listings...</Text>
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
              <MaterialCommunityIcons name="inbox-outline" size={80} color={colors.inputBorder} />
              <Text style={{ marginTop: 16, color: colors.muted, fontSize: 16 }}>
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