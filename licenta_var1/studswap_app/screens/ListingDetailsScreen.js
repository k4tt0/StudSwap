import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { View, Text, ScrollView, Image, TouchableOpacity, Dimensions, ActivityIndicator } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { getListingDetailsStyles } from '../styles/ListingDetailsStyle';
import { useListingDetails } from '../hooks/useListingDetails';
import ImageView from "react-native-image-viewing";
import { setDoc, doc, serverTimestamp } from 'firebase/firestore';
import { API_BASE_URL, db } from '../firebaseConfig';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ConfirmModal from '../components/ConfirmModal';
import InfoModal from '../components/InfoModal';

const { width } = Dimensions.get('window');

export default function ListingDetailsScreen({ route, navigation }) {
  const { colors } = useTheme();
  const styles = getListingDetailsStyles(colors);
  const insets = useSafeAreaInsets();

  const [confirmVisible, setConfirmVisible] = useState(false);
  const [confirmConfig, setConfirmConfig] = useState({
    title: '',
    message: '',
    confirmText: 'Confirm',
    onConfirm: null,
  });

  const [infoVisible, setInfoVisible] = useState(false);
  const [infoConfig, setInfoConfig] = useState({ title: '', message: '' });

  const { listing } = route.params;

  const formatPostingDate = (isoString) => {
    if (!isoString) return null;
    const date = new Date(isoString);
    if (isNaN(date)) return null;
    return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  const postingDate = formatPostingDate(listing.createdAt);

  const {
    activeImageIndex,
    handleScroll,
    handleContactSeller,
    sellerListings,
    similarListings,
    loadingExtra,
    isViewerVisible,
    viewerIndex,
    openImageViewer,
    closeImageViewer,
    handleDeleteListing,
    handleMarkAsSold,
    seller,
  } = useListingDetails(listing, navigation);

  const [isLiked, setIsLiked] = useState(false);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [currentStatus, setCurrentStatus] = useState(listing.status || 'active');

  useEffect(() => {
    const fetchCurrentUserId = async () => {
      try {
        const id = await AsyncStorage.getItem('userId');
        setCurrentUserId(id);
      } catch (error) {
        console.error('Error reading current userId:', error);
      }
    };
    fetchCurrentUserId();
  }, []);

  useEffect(() => {
    const checkLikeStatus = async () => {
      try {
        const myUserId = await AsyncStorage.getItem('userId');
        if (!myUserId) return;

        const storageKey = `savedListings_${myUserId}`;
        const savedIdsStr = await AsyncStorage.getItem(storageKey);
        const savedIds = savedIdsStr ? JSON.parse(savedIdsStr) : [];
        const itemId = listing.id || listing._id;

        if (savedIds.includes(itemId)) {
          setIsLiked(true);
        }
      } catch (error) {
        console.error('Error reading the favourites:', error);
      }
    };
    checkLikeStatus();
  }, [listing]);

  const toggleLike = async () => {
    try {
      const myUserId = await AsyncStorage.getItem('userId');
      const storageKey = `savedListings_${myUserId}`;
      const itemId = listing.id || listing._id;

      const savedIdsStr = await AsyncStorage.getItem(storageKey);
      let savedIds = savedIdsStr ? JSON.parse(savedIdsStr) : [];

      if (isLiked) {
        savedIds = savedIds.filter(id => id !== itemId);
        setIsLiked(false);
      } else {
        savedIds.push(itemId);
        setIsLiked(true);

        if (listing.userId !== myUserId) {
          try {
            const userRes = await fetch(`${API_BASE_URL}/api/users/${myUserId}`);
            let senderName = 'Someone';

            if (userRes.ok) {
              const userData = await userRes.json();
              senderName = userData.displayName || 'Someone';
            }

            const notifId = `like_${myUserId}_${itemId}`;
            await setDoc(doc(db, 'Notifications', notifId), {
              receiverId: listing.userId,
              senderId: myUserId,
              senderName: senderName,
              listingId: itemId,
              type: 'like',
              text: `${senderName} saved your listing "${listing.title}".`,
              isRead: false,
              timestamp: serverTimestamp(),
            });
          } catch (e) {
            console.error('Error sending notification:', e);
          }
        }
      }
      await AsyncStorage.setItem(storageKey, JSON.stringify(savedIds));
    } catch (error) {
      console.error('Error saving favourite item:', error);
    }
  };

  const openConfirm = ({ title, message, confirmText = 'Confirm', onConfirm }) => {
    setConfirmConfig({
      title,
      message,
      confirmText,
      onConfirm,
    });
    setConfirmVisible(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await handleDeleteListing();
    } finally {
      setConfirmVisible(false);
    }
  };

  const handleConfirmMarkAsSold = async () => {
    try {
      await handleMarkAsSold(currentStatus, (newStatus) => setCurrentStatus(newStatus));
    } finally {
      setConfirmVisible(false);
    }
  };

  const renderMiniCard = (item) => (
    <TouchableOpacity
      key={item.id}
      style={styles.miniCard}
      onPress={() => navigation.push('ListingDetails', { listing: item })}
    >
      <View style={{ backgroundColor: colors.background }}>
        {item.images && item.images.length > 0 ? (
          <Image source={{ uri: item.images[0] }} style={styles.miniCardImage} />
        ) : (
          <View style={[styles.miniCardImage, { justifyContent: 'center', alignItems: 'center' }]}>
            <MaterialCommunityIcons name="image-outline" size={40} color={colors.muted} />
          </View>
        )}
      </View>
      <View style={styles.miniCardInfo}>
        <Text style={styles.miniCardTitle} numberOfLines={1}>{item.title}</Text>
        <Text style={styles.miniCardPrice}>
          {item.announcementType === 'Donation'
            ? 'Free'
            : item.announcementType === 'Exchange'
              ? 'Exchange'
              : `${item.price} RON`}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={{ position: 'absolute', top: insets.top + 10, left: 20, zIndex: 10 }}>
        <TouchableOpacity
          style={{ backgroundColor: 'rgba(0,0,0,0.5)', padding: 10, borderRadius: 20 }}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#FFF" />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.imageCarouselContainer}>
          {listing.images && listing.images.length > 0 ? (
            <ScrollView
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              onScroll={handleScroll}
              scrollEventThrottle={16}
            >
              {listing.images.map((imgUri, index) => (
                <TouchableOpacity
                  key={index}
                  activeOpacity={0.9}
                  onPress={() => openImageViewer(index)}
                >
                  <Image source={{ uri: imgUri }} style={styles.image} />
                </TouchableOpacity>
              ))}
            </ScrollView>
          ) : (
            <View style={[styles.image, { justifyContent: 'center', alignItems: 'center' }]}>
              <MaterialCommunityIcons name="image-outline" size={80} color={colors.muted} />
            </View>
          )}
          {listing.images && listing.images.length > 1 && (
            <View style={styles.paginationContainer}>
              {listing.images.map((_, i) => (
                <View key={i} style={i === activeImageIndex ? styles.activeDot : styles.dot} />
              ))}
            </View>
          )}
        </View>

        <View style={styles.contentContainer}>
          <View style={styles.headerRow}>
            <Text style={[styles.title, { flex: 1, fontSize: 24, fontWeight: 'bold', color: colors.textDark }]}>
              {listing.title}
            </Text>

            {currentUserId !== listing.userId && (
              <TouchableOpacity onPress={toggleLike}>
                <MaterialCommunityIcons
                  name={isLiked ? 'heart' : 'heart-outline'}
                  size={30}
                  color={colors.accent}
                />
              </TouchableOpacity>
            )}
          </View>

          {currentStatus === 'sold' && (
            <View style={{ alignSelf: 'flex-start', backgroundColor: colors.muted, paddingHorizontal: 12, paddingVertical: 4, borderRadius: 12, marginTop: 8 }}>
              <Text style={{ color: '#FFF', fontWeight: 'bold', fontSize: 13 }}>SOLD</Text>
            </View>
          )}

          <Text style={styles.price}>
            {listing.announcementType === 'Donation'
              ? 'Free / Donation'
              : listing.announcementType === 'Exchange'
                ? 'For Exchange'
                : `${listing.price} RON`}
          </Text>

          <View style={styles.divider} />

          <View style={styles.metaRow}>
            <MaterialCommunityIcons name="tag-outline" size={24} color={colors.textDark} />
            <Text style={styles.metaText}>{listing.category}</Text>
          </View>
          <View style={styles.metaRow}>
            <MaterialCommunityIcons name="star-circle-outline" size={24} color={colors.textDark} />
            <Text style={styles.metaText}>{listing.condition}</Text>
          </View>
          {postingDate && (
            <View style={styles.metaRow}>
              <MaterialCommunityIcons name="calendar-outline" size={24} color={colors.textDark} />
              <Text style={styles.metaText}>Posted {postingDate}</Text>
            </View>
          )}

          <View style={styles.divider} />

          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.description}>{listing.description || 'No description provided.'}</Text>

          <View style={styles.divider} />

          <Text style={styles.sectionTitle}>Seller</Text>
          <TouchableOpacity
            style={styles.sellerCard}
            onPress={() => navigation.navigate('Profile', { userId: seller._id, fromListing: true })}
          >
            <View style={styles.sellerTextContainer}>
              <Text style={styles.sellerLabel}>Listed by</Text>
              <Text style={styles.sellerName}>{seller.name}</Text>
              <Text style={styles.sellerUniversity}>{seller.university}</Text>
            </View>

            <View style={styles.sellerAvatarContainer}>
              {seller.avatar ? (
                <Image source={{ uri: seller.avatar }} style={styles.sellerAvatar} />
              ) : (
                <View style={styles.sellerAvatarPlaceholder}>
                  <Text style={styles.sellerAvatarInitials}>
                    {seller.name ? seller.name.charAt(0) : '?'}
                  </Text>
                </View>
              )}
            </View>
          </TouchableOpacity>

          {loadingExtra ? (
            <ActivityIndicator size="small" color={colors.accent} style={{ marginTop: 30 }} />
          ) : (
            <>
              {sellerListings.length > 0 && (
                <View style={styles.carouselSection}>
                  <Text style={styles.carouselTitle}>More from this seller</Text>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    {sellerListings.map(renderMiniCard)}
                  </ScrollView>
                </View>
              )}
              {similarListings.length > 0 && (
                <View style={styles.carouselSection}>
                  <Text style={styles.carouselTitle}>Similar listings</Text>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    {similarListings.map(renderMiniCard)}
                  </ScrollView>
                </View>
              )}
            </>
          )}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        {currentUserId === listing.userId ? (
          <View style={{ width: '100%', gap: 10 }}>
            <TouchableOpacity
              style={[styles.contactBtn, { backgroundColor: currentStatus === 'sold' ? colors.muted : colors.accent }]}
              onPress={() =>
                openConfirm({
                  title: currentStatus === 'sold' ? 'Mark as Available' : 'Mark as Sold',
                  message:
                    currentStatus === 'sold'
                      ? 'Are you sure you want to mark this listing as available?'
                      : 'Are you sure you want to mark this listing as sold?',
                  confirmText: 'Confirm',
                  onConfirm: handleConfirmMarkAsSold,
                })
              }
            >
              <Ionicons
                name={currentStatus === 'sold' ? 'refresh-outline' : 'checkmark-circle-outline'}
                size={22}
                color="#FFF"
              />
              <Text style={styles.contactBtnText}>
                {currentStatus === 'sold' ? 'Mark as Available' : 'Mark as Sold'}
              </Text>
            </TouchableOpacity>

            <View style={{ flexDirection: 'row', width: '100%', gap: 15 }}>
              <TouchableOpacity
                style={[styles.contactBtn, { flex: 1, backgroundColor: colors.muted }]}
                onPress={() => navigation.navigate('EditListing', { listing: listing })}
              >
                <Ionicons name="create-outline" size={22} color="#FFF" />
                <Text style={styles.contactBtnText}>Edit</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.contactBtn, { flex: 1, backgroundColor: '#E63946' }]}
                onPress={() =>
                  openConfirm({
                    title: 'Delete Listing',
                    message: 'Are you sure you want to delete this listing?',
                    confirmText: 'Delete',
                    onConfirm: handleConfirmDelete,
                  })
                }
              >
                <Ionicons name="trash-outline" size={22} color="#FFF" />
                <Text style={styles.contactBtnText}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <TouchableOpacity
            style={[styles.contactBtn, currentStatus === 'sold' && { backgroundColor: colors.muted }]}
            disabled={currentStatus === 'sold'}
            onPress={async () => {
              const result = await handleContactSeller(listing.userId, listing.userName, currentStatus);
              if (result) {
                setInfoConfig({ title: result.title, message: result.message });
                setInfoVisible(true);
              }
            }}
          >
            <Ionicons name="chatbubbles-outline" size={24} color="#FFF" />
            <Text style={styles.contactBtnText}>
              {currentStatus === 'sold' ? 'Listing Sold' : `Message ${listing.userName?.split(' ')[0]}`}
            </Text>
          </TouchableOpacity>
        )}
      </View>

      <InfoModal
        visible={infoVisible}
        title={infoConfig.title}
        message={infoConfig.message}
        colors={colors}
        onClose={() => setInfoVisible(false)}
      />

      <ImageView
        images={listing.images ? listing.images.map(uri => ({ uri })) : []}
        imageIndex={viewerIndex}
        visible={isViewerVisible}
        onRequestClose={closeImageViewer}
        swipeToCloseEnabled={true}
        doubleTapToZoomEnabled={true}
      />

      <ConfirmModal
        visible={confirmVisible}
        title={confirmConfig.title}
        message={confirmConfig.message}
        confirmText={confirmConfig.confirmText}
        cancelText="Cancel"
        colors={colors}
        onCancel={() => setConfirmVisible(false)}
        onConfirm={confirmConfig.onConfirm}
      />
    </View>
  );
}