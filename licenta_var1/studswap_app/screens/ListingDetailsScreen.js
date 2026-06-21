import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { View, Text, ScrollView, Image, TouchableOpacity, Dimensions, ActivityIndicator } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { getListingDetailsStyles } from '../styles/ListingDetailsStyle';
import { useListingDetails } from '../hooks/useListingDetails';
import ImageView from "react-native-image-viewing";

const { width } = Dimensions.get('window');

export default function ListingDetailsScreen({ route, navigation }) {
  const { colors } = useTheme();
  const styles = getListingDetailsStyles(colors);
  
  const { listing } = route.params; 
  
  const { 
    activeImageIndex, handleScroll, handleContactSeller,
    sellerListings, similarListings, loadingExtra,
    isViewerVisible, viewerIndex, openImageViewer, closeImageViewer
  } = useListingDetails(listing, navigation);

  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    const checkLikeStatus = async () => {
      try {
        const savedIdsStr = await AsyncStorage.getItem('savedListings');
        const savedIds = savedIdsStr ? JSON.parse(savedIdsStr) : [];
        const itemId = listing.id || listing._id;
        
        if (savedIds.includes(itemId)) {
          setIsLiked(true);
        }
      } catch (error) {
        console.error("Eroare la citirea favoritelor:", error);
      }
    };
    checkLikeStatus();
  }, [listing]);

  const toggleLike = async () => {
    try {
      const itemId = listing.id || listing._id;
      const savedIdsStr = await AsyncStorage.getItem('savedListings');
      let savedIds = savedIdsStr ? JSON.parse(savedIdsStr) : [];

      if (isLiked) {
        savedIds = savedIds.filter(id => id !== itemId);
        setIsLiked(false);
      } else {
        savedIds.push(itemId);
        setIsLiked(true);
      }
      await AsyncStorage.setItem('savedListings', JSON.stringify(savedIds));
    } catch (error) {
      console.error("Eroare la salvarea favoritului:", error);
    }
  }

  
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
          {item.announcementType === 'Donation' ? 'Free' : 
           item.announcementType === 'Exchange' ? 'Exchange' : 
           `${item.price} RON`}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      
      <View style={{ position: 'absolute', top: 50, left: 20, zIndex: 10 }}>
        <TouchableOpacity 
          style={{ backgroundColor: 'rgba(0,0,0,0.5)', padding: 10, borderRadius: 20 }}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#FFF" />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        
        {/* CARUSEL IMAGINI MARI */}
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

        {/* INFORMAȚII ANUNȚ */}
        <View style={styles.contentContainer}>
          
          <View style={styles.headerRow}>
            <Text style={styles.title}>{listing.title}</Text>
            <TouchableOpacity onPress={toggleLike}>
              <MaterialCommunityIcons 
                name={isLiked ? "heart" : "heart-outline"} 
                size={30} 
                color={colors.accent} 
              />
            </TouchableOpacity>
          </View>

          <Text style={styles.price}>
            {listing.announcementType === 'Donation' ? 'Free / Donation' : 
             listing.announcementType === 'Exchange' ? 'For Exchange' : 
             `${listing.price} RON`}
          </Text>

          <View style={styles.divider} />

          {/* Categ și Stare */}
          <View style={styles.metaRow}>
            <MaterialCommunityIcons name="tag-outline" size={24} color={colors.textDark} />
            <Text style={styles.metaText}>{listing.category}</Text>
          </View>
          <View style={styles.metaRow}>
            <MaterialCommunityIcons name="star-circle-outline" size={24} color={colors.textDark} />
            <Text style={styles.metaText}>{listing.condition}</Text>
          </View>

          <View style={styles.divider} />

          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.description}>{listing.description || 'No description provided.'}</Text>

          <View style={styles.divider} />

          <Text style={styles.sectionTitle}>Seller</Text>
          <View style={styles.sellerContainer}>
            <View style={styles.sellerAvatar}>
              <Text style={styles.sellerInitials}>{listing.userName?.charAt(0) || 'U'}</Text>
            </View>
            <View>
              <Text style={styles.sellerName}>{listing.userName}</Text>
              <Text style={{ color: colors.muted, fontSize: 12 }}>
                {listing.location} • {listing.faculty || 'University'}
              </Text>
            </View>
          </View>

          {/* --- CARUSELE --- */}
          {loadingExtra ? (
            <ActivityIndicator size="small" color={colors.accent} style={{ marginTop: 30 }} />
          ) : (
            <>
              {/* Carusel 1 */}
              {sellerListings.length > 0 && (
                <View style={styles.carouselSection}>
                  <Text style={styles.carouselTitle}>More from this seller</Text>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    {sellerListings.map(renderMiniCard)}
                  </ScrollView>
                </View>
              )}

              {/* Carusel 2 */}
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

      {/* BUTON CONTACT */}
      <View style={styles.footer}>
        <TouchableOpacity 
          style={styles.contactBtn}
          onPress={() => handleContactSeller(listing.userId, listing.userName)}
        >
          <Ionicons name="chatbubbles-outline" size={24} color="#FFF" />
          <Text style={styles.contactBtnText}>Message {listing.userName?.split(' ')[0]}</Text>
        </TouchableOpacity>
      </View>

      <ImageView
        images={listing.images ? listing.images.map(uri => ({ uri })) : []}
        imageIndex={viewerIndex}
        visible={isViewerVisible}
        onRequestClose={closeImageViewer}
        swipeToCloseEnabled={true}
        doubleTapToZoomEnabled={true}
      />
      
    </View>
  );
}