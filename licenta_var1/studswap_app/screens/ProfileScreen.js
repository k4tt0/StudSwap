import React from 'react';
import { View, Text, TouchableOpacity, Image, FlatList, ActivityIndicator } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons'; 
import NavBar from '../components/NavBar';
import { useTheme } from '../context/ThemeContext'; 
import { getProfileStyles } from '../styles/ProfileScreenStyle';
import { useProfile } from '../hooks/useProfile';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function ProfileScreen({ route, navigation }) {
  const { colors } = useTheme();
  const styles = getProfileStyles(colors);
  const insets = useSafeAreaInsets();
  
  const providedUserId = route?.params?.userId;
  const { userProfile, myListings, loading, isOwnProfile, handlePickAvatar, handleDeleteListing } = useProfile(navigation, providedUserId);

  const renderProfileHeader = () => (
    <View>
      <View style={styles.profileSection}>
        <TouchableOpacity 
          style={styles.avatarContainer} 
          onPress={handlePickAvatar} 
          activeOpacity={isOwnProfile ? 0.8 : 1} 
        >
          {userProfile.avatar ? (
            <Image source={{ uri: userProfile.avatar }} style={styles.avatarImage} />
          ) : (
            <Text style={styles.avatarInitials}>{userProfile.name.charAt(0)}</Text>
          )}
          
          {isOwnProfile && (
            <View style={styles.avatarCameraIcon}>
              <Ionicons name="camera" size={15} color={colors.textDark} />
            </View>
          )}
        </TouchableOpacity>

        <Text style={styles.nameText}>{userProfile.name}</Text>
        <Text style={styles.locationText}>{userProfile.city}  •  {userProfile.university}</Text>
      </View>

      {myListings.length > 0 && (
        <Text style={styles.listingsHeading}>
          {isOwnProfile ? 'Your listings' : `Listings by ${userProfile.name}`} ({myListings.length})
        </Text>
      )}
    </View>
  );

  const renderListingItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.listingCard}
      activeOpacity={0.9}
      onPress={() => navigation.navigate('ListingDetails', { listing: item })}
    >
      <View style={{ position: 'relative' }}>
        {item.images && item.images.length > 0 ? (
          <Image source={{ uri: item.images[0] }} style={styles.listingImage} />
        ) : (
          <View style={styles.listingImage}>
            <MaterialCommunityIcons name="image-outline" size={40} color={colors.muted} />
          </View>
        )}
        {item.status === 'sold' && (
          <View style={{ position: 'absolute', top: 10, left: 10, backgroundColor: colors.muted, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10 }}>
            <Text style={{ color: '#FFF', fontWeight: 'bold', fontSize: 12 }}>SOLD</Text>
          </View>
        )}
      </View>

      <Text style={styles.listingTitle}>{item.title}</Text>
      <Text style={styles.listingDesc} numberOfLines={2}>
        {item.description || 'No description provided.'}
      </Text>

      {isOwnProfile && (
        <View style={styles.cardActions}>
          <TouchableOpacity 
            style={[styles.actionBtn, styles.editBtn]}
            onPress={(e) => {
              e.stopPropagation(); 
              navigation.navigate('EditListing', { listing: item });
            }}
          >
            <Text style={styles.editText}>Edit</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.actionBtn, styles.deleteBtn]}
            onPress={(e) => {
              e.stopPropagation(); 
              handleDeleteListing(item.id || item._id);
            }}
          >
            <Text style={styles.deleteText}>Delete</Text>
          </TouchableOpacity>
        </View>
      )}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      
      <View style={styles.profileCardBackground} />

      <View style={[styles.headerRow, !isOwnProfile && { justifyContent: 'space-between' }, { paddingTop: insets.top + 10 }]}>
        {!isOwnProfile && (
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.settingsBtn}>
            <Ionicons name="arrow-back" size={28} color={colors.textDark} />
          </TouchableOpacity>
        )}
        {isOwnProfile && (
          <TouchableOpacity onPress={() => navigation.navigate('Settings')} style={styles.settingsBtn}>
            <Ionicons name="settings-outline" size={26} color={colors.textDark} />
          </TouchableOpacity>
        )}
      </View>

      {loading ? (
        <ActivityIndicator size="large" color={colors.accent} style={{ marginTop: 80 }} />
      ) : (
        <FlatList
          data={myListings}
          keyExtractor={item => item.id || item._id}
          ListHeaderComponent={renderProfileHeader}
          renderItem={renderListingItem}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <MaterialCommunityIcons name="tag-outline" size={60} color={colors.inputBorder} />
              <Text style={styles.emptyText}>
                {isOwnProfile ? "You haven't posted any listings yet." : "This user has no active listings."}
              </Text>
            </View>
          }
        />
      )}

      {isOwnProfile && <NavBar navigation={navigation} activeScreen="Profile" />}
    </View>
  );
}