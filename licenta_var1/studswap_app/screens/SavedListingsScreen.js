import React from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { getSavedStyles } from '../styles/SavedListingsStyle';
import { useSavedListings } from '../hooks/useSavedListings';
import NavBar from '../components/NavBar';

export default function SavedListingsScreen({ navigation }) {
  const { colors } = useTheme();
  const styles = getSavedStyles(colors);
  
  const { 
    searchQuery, setSearchQuery, 
    filteredItems, loading, handleRemoveSaved,
    sortOrder, toggleSortOrder 
  } = useSavedListings();

  const renderItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.listItem}
      activeOpacity={0.7}
      onPress={() => navigation.navigate('ListingDetails', { listing: item })}
    >
      <View style={styles.itemImageWrapper}>
        {item.images && item.images.length > 0 ? (
          <Image source={{ uri: item.images[0] }} style={styles.itemImage} />
        ) : (
          <View style={[styles.itemImage, { justifyContent: 'center', alignItems: 'center' }]}>
            <MaterialCommunityIcons name="image-outline" size={30} color={colors.muted} />
          </View>
        )}
      </View>

      <View style={styles.itemInfo}>
        <Text style={styles.itemTitle} numberOfLines={1}>{item.title}</Text>
        <Text style={styles.itemCategory}>{item.category} • {item.condition}</Text>
        <Text style={styles.itemPrice}>
          {item.announcementType === 'Donation' ? 'Free / Donation' : 
           item.announcementType === 'Exchange' ? 'For Exchange' : 
           `${item.price} RON`}
        </Text>
      </View>

      <TouchableOpacity 
        style={styles.removeBtn} 
        onPress={() => handleRemoveSaved(item.id || item._id)}
      >
        <MaterialCommunityIcons name="heart" size={28} color={colors.accent} />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      
      <View style={styles.header}>
        <Text style={styles.title}>Saved Items</Text>
        
        {/* SEARCH + SORT BUTTON */}
        <View style={styles.searchRow}>
          <View style={styles.searchContainer}>
            <Ionicons name="search" size={20} color={colors.muted} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search saved items..."
              placeholderTextColor={colors.muted}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <Ionicons name="close-circle" size={20} color={colors.muted} />
              </TouchableOpacity>
            )}
          </View>

          {/* BUTONUL DE SORTARE */}
          <TouchableOpacity style={styles.sortBtn} onPress={toggleSortOrder}>
            <MaterialCommunityIcons 
              name={sortOrder === 'newest' ? "sort-clock-descending-outline" : "sort-clock-ascending-outline"} 
              size={26} 
              color={colors.textDark} 
            />
          </TouchableOpacity>
        </View>
      </View>

      {loading ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color={colors.accent} />
        </View>
      ) : (
        <FlatList
          data={filteredItems}
          keyExtractor={item => item.id || item._id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <MaterialCommunityIcons name="heart-broken-outline" size={80} color={colors.inputBorder} />
              <Text style={styles.emptyText}>
                {searchQuery ? "No saved items match your search." : "You haven't saved any items yet."}
              </Text>
            </View>
          }
        />
      )}

      <NavBar navigation={navigation} activeScreen="SavedListings" />
    </View>
  );
}