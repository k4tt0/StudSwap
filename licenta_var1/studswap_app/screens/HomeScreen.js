import React, { useState } from 'react';
import { View, Text, ScrollView, FlatList, TouchableOpacity, TextInput, Image, Modal, RefreshControl } from 'react-native';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { getHomeStyles } from '../styles/HomeScreenStyle';
import { useTheme } from '../context/ThemeContext'; 
import NavBar from '../components/NavBar';
import { useHomeListings } from '../hooks/useHomeListings';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import InfoModal from '../components/InfoModal';

const CATEGORIES = ['Books', 'Electronics', 'Equipment', 'Notes', 'Other'];
const TYPES = ['For Sale', 'Donation', 'Exchange'];
const CONDITIONS = ['New', 'Like New', 'Good', 'Fair', 'Poor'];
const UNIVERSITIES = [
  { label: 'UPT', value: 'Universitatea Politehnica Timișoara' },
  { label: 'UMFT', value: 'Universitatea de Medicină și Farmacie Timișoara' },
  { label: 'UVT', value: 'Universitatea de Vest Timișoara' },
  { label: 'USVT', value: 'Universitatea de Științele Vieții "Regele Mihai I" din Timișoara' },
];

export default function HomeScreen({ navigation }) {
  const { colors } = useTheme(); 
  const styles = getHomeStyles(colors); 
  
  const insets = useSafeAreaInsets();

  const {
    userLocation,
    filteredListings,
    searchQuery, setSearchQuery,
    loading,
    refreshing, handleRefresh,
    filters, updateFilter, clearFilters, setFilters,
    savedIds, toggleLike,
    infoModal, closeInfoModal
  } = useHomeListings();

  const [isFilterVisible, setIsFilterVisible] = useState(false);

  const getTypeTag = (type) => {
    switch (type) {
      case 'Donation':
        return { label: 'Donation', bg: '#3B82F6' };   
      case 'Exchange':
        return { label: 'Exchange', bg: '#A855F7' };    
      default:
        return { label: 'For Sale', bg: colors.accent }; 
    }
  };

  const renderItem = ({ item }) => {
    const itemId = item.id || item._id; 
    const isLiked = savedIds.includes(itemId);

    return (
      <TouchableOpacity 
        style={styles.card} 
        delayPressIn={150} 
        activeOpacity={0.7}
        onPress={() => navigation.navigate('ListingDetails', { listing: item })}
      >
        <View style={styles.cardHeader}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{item.userName?.charAt(0) || 'U'}</Text>
          </View>
          <View style={styles.headerTextContainer}>
            <Text style={{ fontWeight: 'bold', color: colors.textDark }}>{item.title}</Text>
            <Text style={{ fontSize: 12, color: colors.muted }}>{item.category}</Text>
          </View>
          
          <TouchableOpacity onPress={() => toggleLike(itemId)}>
            <MaterialCommunityIcons 
              name={isLiked ? "heart" : "heart-outline"} 
              size={24} 
              color={colors.accent} 
            />
          </TouchableOpacity>
        </View>

        <View style={[styles.imagePlaceholder, { overflow: 'hidden' }]}>
          {item.images && item.images.length > 0 ? (
            <Image 
              source={{ uri: item.images[0] }} 
              style={{ width: '100%', height: '100%', resizeMode: 'cover' }} 
            />
          ) : (
            <MaterialCommunityIcons name="image-outline" size={80} color={colors.muted} />
          )}

          {(() => {
            const tag = getTypeTag(item.announcementType);
            return (
              <View style={{ 
                position: 'absolute', top: 10, left: 10, 
                backgroundColor: tag.bg, 
                paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10 
              }}>
                <Text style={{ color: '#FFF', fontWeight: 'bold', fontSize: 12 }}>{tag.label}</Text>
              </View>
            );
          })()}
        </View>

        <View style={styles.cardFooter}>
          <View style={styles.footerLines}>
            <Text style={{ 
              fontWeight: 'bold', 
              fontSize: 18, 
              color: item.announcementType === 'Donation' ? colors.accent : colors.textDark 
            }}>
              {item.announcementType === 'Donation' ? 'Free / Donation' : 
               item.announcementType === 'Exchange' ? 'For Exchange' : 
               `${item.price} RON`}
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
  };

  const renderFilterPills = (title, dataKey, options) => (
    <View style={{ marginBottom: 20 }}>
      <Text style={{ fontWeight: 'bold', fontSize: 16, color: colors.textDark, marginBottom: 10 }}>{title}</Text>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
        {options.map(option => {
          const optionLabel = typeof option === 'string' ? option : option.label;
          const optionValue = typeof option === 'string' ? option : option.value;
          const isActive = filters[dataKey] === optionValue;
          return (
            <TouchableOpacity
              key={optionValue}
              onPress={() => updateFilter(dataKey, optionValue)}
              style={{
                paddingVertical: 8, paddingHorizontal: 16, borderRadius: 20,
                backgroundColor: isActive ? colors.accent : colors.surface,
                borderWidth: 1, borderColor: isActive ? colors.accent : colors.inputBorder
              }}
            >
              <Text style={{ color: isActive ? '#FFF' : colors.textDark, fontWeight: isActive ? 'bold' : 'normal' }}>
                {optionLabel}
              </Text>
            </TouchableOpacity>
          )
        })}
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      
      <View style={[styles.headerContainer, { paddingTop: insets.top + 10 }]}>
        <View style={styles.locationPill}>
          <Ionicons name="location-outline" size={14} color={colors.textDark} />
          <Text style={styles.locationText}>{userLocation}</Text>
        </View>

        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 10 }}>
          <View style={[styles.searchBar, { flex: 1, marginTop: 0 }]}>
            <Ionicons name="search" size={20} color={colors.muted} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search items..."
              placeholderTextColor={colors.muted}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
          
          <TouchableOpacity 
            onPress={() => setIsFilterVisible(true)}
            style={{
              backgroundColor: colors.surface, padding: 12, borderRadius: 12, 
              borderWidth: 1, borderColor: colors.inputBorder,
              position: 'relative', justifyContent: 'center', alignItems: 'center'
            }}
          >
            <Ionicons name="options-outline" size={24} color={colors.textDark} />
            {(filters.minPrice || filters.maxPrice || filters.category || filters.announcementType || filters.condition || filters.faculty) ? (
              <View style={{ position: 'absolute', top: 8, right: 8, width: 8, height: 8, borderRadius: 4, backgroundColor: 'red' }} />
            ) : null}
          </TouchableOpacity>
        </View>
      </View>

      {loading ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ color: colors.textDark }}>Loading listings...</Text>
        </View>
      ) : (
        <FlatList
          data={filteredListings}
          keyExtractor={item => item.id || item._id}
          renderItem={renderItem}
          contentContainerStyle={[styles.feedContainer, { paddingBottom: 100 }]}
          showsVerticalScrollIndicator={false}
          
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              colors={[colors.accent]} 
              tintColor={colors.accent} 
            />
          }

          ListEmptyComponent={
            <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: 60, paddingHorizontal: 40 }}>
              <MaterialCommunityIcons 
                name={searchQuery || filters.category || filters.announcementType || filters.condition || filters.faculty || filters.minPrice || filters.maxPrice ? "magnify-close" : "storefront-outline"} 
                size={80} 
                color={colors.inputBorder} 
              />
              <Text style={{ marginTop: 16, color: colors.textDark, fontSize: 18, fontWeight: 'bold', textAlign: 'center' }}>
                {searchQuery || filters.category || filters.announcementType || filters.condition || filters.faculty || filters.minPrice || filters.maxPrice
                  ? 'No matching items'
                  : `No listings in ${userLocation} yet`}
              </Text>
              <Text style={{ marginTop: 8, color: colors.muted, fontSize: 14, textAlign: 'center', lineHeight: 20 }}>
                {searchQuery || filters.category || filters.announcementType || filters.condition || filters.faculty || filters.minPrice || filters.maxPrice
                  ? 'Try adjusting your search or filters.'
                  : 'Be the first to post something for your university community!'}
              </Text>
            </View>
          }
        />
      )}

      {/* --- FILTER MODAL --- */}
      <Modal visible={isFilterVisible} animationType="slide" transparent={true}>
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' }}>
          <View style={{ backgroundColor: colors.background, borderTopLeftRadius: 30, borderTopRightRadius: 30, padding: 25, height: '85%' }}>
            
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <Text style={{ fontSize: 24, fontWeight: 'bold', color: colors.textDark }}>Filters</Text>
              <TouchableOpacity onPress={() => setIsFilterVisible(false)}>
                <Ionicons name="close-circle" size={32} color={colors.muted} />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
              
              <View style={{ marginBottom: 20 }}>
                <Text style={{ fontWeight: 'bold', fontSize: 16, color: colors.textDark, marginBottom: 10 }}>Price Range (RON)</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 15 }}>
                  <TextInput 
                    style={{ flex: 1, backgroundColor: colors.surface, padding: 15, borderRadius: 12, borderWidth: 1, borderColor: colors.inputBorder, color: colors.textDark }}
                    placeholder="Min" placeholderTextColor={colors.muted} keyboardType="numeric"
                    value={filters.minPrice} onChangeText={val => setFilters(prev => ({...prev, minPrice: val}))}
                  />
                  <Text style={{ color: colors.muted }}>to</Text>
                  <TextInput 
                    style={{ flex: 1, backgroundColor: colors.surface, padding: 15, borderRadius: 12, borderWidth: 1, borderColor: colors.inputBorder, color: colors.textDark }}
                    placeholder="Max" placeholderTextColor={colors.muted} keyboardType="numeric"
                    value={filters.maxPrice} onChangeText={val => setFilters(prev => ({...prev, maxPrice: val}))}
                  />
                </View>
              </View>

              {renderFilterPills('Category', 'category', CATEGORIES)}
              {renderFilterPills('Type', 'announcementType', TYPES)}
              {renderFilterPills('Condition', 'condition', CONDITIONS)}
              {renderFilterPills('University', 'faculty', UNIVERSITIES)}

            </ScrollView>

            <View style={{ flexDirection: 'row', gap: 15, paddingTop: 10, borderTopWidth: 1, borderColor: colors.inputBorder }}>
              <TouchableOpacity onPress={clearFilters} style={{ flex: 1, padding: 15, borderRadius: 30, borderWidth: 1, borderColor: colors.accent, alignItems: 'center' }}>
                <Text style={{ color: colors.accent, fontWeight: 'bold', fontSize: 16 }}>Clear All</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setIsFilterVisible(false)} style={{ flex: 1, padding: 15, borderRadius: 30, backgroundColor: colors.accent, alignItems: 'center' }}>
                <Text style={{ color: '#FFF', fontWeight: 'bold', fontSize: 16 }}>Show Results</Text>
              </TouchableOpacity>
            </View>

          </View>
        </View>
      </Modal>

      <NavBar navigation={navigation} activeScreen="Home" />

      <InfoModal
        visible={infoModal.visible}
        title={infoModal.title}
        message={infoModal.message}
        colors={colors}
        onClose={closeInfoModal}
      />
    </View>
  );
}