import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, FlatList, ActivityIndicator } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import NavBar from '../components/NavBar';
import { useTheme } from '../context/ThemeContext';
import { getProfileStyles } from '../styles/ProfileScreenStyle';
import { useProfile } from '../hooks/useProfile';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ConfirmModal from '../components/ConfirmModal';
import InfoModal from '../components/InfoModal';

export default function ProfileScreen({ route, navigation }) {
  const { colors } = useTheme();
  const styles = getProfileStyles(colors);
  const insets = useSafeAreaInsets();

  const [deleteVisible, setDeleteVisible] = useState(false);
  const [pendingDeleteId, setPendingDeleteId] = useState(null);
  const [infoVisible, setInfoVisible] = useState(false);
  const [infoConfig, setInfoConfig] = useState({ title: '', message: '' });

  const providedUserId = route?.params?.userId;
  const { userProfile, myListings, loading, isOwnProfile, handlePickAvatar, handleDeleteListing } =
    useProfile(navigation, providedUserId);

  const onPickAvatarPress = async () => {
    const result = await handlePickAvatar();
    if (result) {
      setInfoConfig({ title: result.title, message: result.message });
      setInfoVisible(true);
    }
  };

  const confirmDelete = async () => {
    try {
      if (pendingDeleteId) {
        await handleDeleteListing(pendingDeleteId);
      }
    } finally {
      setDeleteVisible(false);
      setPendingDeleteId(null);
    }
  };

  const renderProfileHeader = () => (
    <View>
      <View style={styles.profileSection}>
        <TouchableOpacity
          style={styles.avatarContainer}
          onPress={onPickAvatarPress}
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
        <Text style={styles.locationText}>
          {userProfile.city}  •  {userProfile.university}
        </Text>
      </View>

      {myListings.length > 0 && (
        <Text style={styles.listingsHeading}>
          {isOwnProfile ? 'Your listings' : `Listings by ${userProfile.name}`} ({myListings.length})
        </Text>
      )}
    </View>
  );

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

  const renderListingItem = ({ item }) => {
    const tag = getTypeTag(item.announcementType);

    return (
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
              <MaterialCommunityIcons name="image-outline" size={32} color={colors.muted} />
            </View>
          )}

          {item.status === 'sold' ? (
            <View style={[styles.typeTag, { backgroundColor: colors.muted }]}>
              <Text style={styles.typeTagText}>SOLD</Text>
            </View>
          ) : (
            <View style={[styles.typeTag, { backgroundColor: tag.bg }]}>
              <Text style={styles.typeTagText}>{tag.label}</Text>
            </View>
          )}
        </View>

        <Text style={styles.listingTitle} numberOfLines={1}>{item.title}</Text>
        <Text style={styles.listingPrice}>
          {item.announcementType === 'Donation' ? 'Free' :
           item.announcementType === 'Exchange' ? 'For Exchange' :
           `${item.price} RON`}
        </Text>
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
              setPendingDeleteId(item.id || item._id);
              setDeleteVisible(true);
            }}
          >
            <Text style={styles.deleteText}>Delete</Text>
          </TouchableOpacity>
        </View>
      )}
      </TouchableOpacity>
    );
  };

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
                {isOwnProfile ? "You haven't posted any listings yet." : 'This user has no active listings.'}
              </Text>
            </View>
          }
        />
      )}

      {isOwnProfile && <NavBar navigation={navigation} activeScreen="Profile" />}

      <ConfirmModal
        visible={deleteVisible}
        title="Delete Listing"
        message="Are you sure you want to permanently delete this listing?"
        confirmText="Delete"
        cancelText="Cancel"
        colors={colors}
        onCancel={() => {
          setDeleteVisible(false);
          setPendingDeleteId(null);
        }}
        onConfirm={confirmDelete}
      />

      <InfoModal
        visible={infoVisible}
        title={infoConfig.title}
        message={infoConfig.message}
        colors={colors}
        onClose={() => setInfoVisible(false)}
      />
    </View>
  );
}