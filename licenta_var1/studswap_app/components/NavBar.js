// studswap_app/components/NavBar.js
import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import * as ImagePicker from 'expo-image-picker';

export default function NavBar({ navigation, activeScreen }) {
  
  const { colors } = useTheme();
  const getIconColor = (screenName) => activeScreen === screenName ? colors.accent : colors.muted;
  const styles = getNavBarStyles(colors);

  return (
    <>
      <View style={styles.bottomNavContainer}>
        {/* home */}
        <TouchableOpacity onPress={() => navigation.navigate('Home')} style={styles.navIcon}>
          <MaterialCommunityIcons 
            name={activeScreen === 'Home' ? "home-variant" : "home-variant-outline"} 
            size={28} 
            color={getIconColor('Home')} 
          />
        </TouchableOpacity>
        
        {/* saved items */}
        <TouchableOpacity onPress={() => navigation.navigate('SavedListings')} style={[styles.navIcon, { marginRight: 40 }]}>
          <Ionicons 
            name={activeScreen === 'SavedListings' ? "bookmark" : "bookmark-outline"} 
            size={26} 
            color={getIconColor('SavedListings')} 
          />
        </TouchableOpacity>

        {/* chat button */}
        <TouchableOpacity onPress={() => navigation.navigate('Messages')} style={[styles.navIcon, { marginLeft: 40 }]}>
          <Ionicons 
            name={activeScreen === 'Messages' ? "chatbubble" : "chatbubble-outline"} 
            size={26} 
            color={getIconColor('Messages')} 
          />
        </TouchableOpacity>

        {/* profile button */}
        <TouchableOpacity onPress={() => navigation.navigate('Profile')} style={styles.navIcon}>
          <Ionicons 
            name={activeScreen === 'Profile' ? "person" : "person-outline"} 
            size={26} 
            color={getIconColor('Profile')} 
          />
        </TouchableOpacity>
      </View>

      {/* add button */}
      <View style={styles.fabWrapper}>
        <TouchableOpacity 
          style={styles.fabDiamond} 
          activeOpacity={0.8}
          onPress={async () => {
            console.log("GREEN DIAMOND PRESSED!");
            try {
              
              const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
              if (status !== 'granted') {
                alert('Need camera roll permissions!');
                return;
              }

              let result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsMultipleSelection: true,
                selectionLimit: 5,
                quality: 0.7,
              });

              if (!result.canceled) {
                console.log("Images picked!", result.assets.length);
                const selectedUris = result.assets.map(asset => asset.uri);
                navigation.navigate('CreateListing', { initialImages: selectedUris }); 
              }
            } catch (error) {
              console.log("Image picker error:", error);
            }
          }} 
        >
          <MaterialCommunityIcons name="plus" size={32} color="#FFF" style={styles.fabIcon} />
        </TouchableOpacity>
      </View>
    </>
  );
}

const getNavBarStyles = (colors) => StyleSheet.create({
  bottomNavContainer: {
    position: 'absolute',
    bottom: 25,
    left: 20,
    right: 20,
    height: 60,
    backgroundColor: colors.navbar,
    borderRadius: 40,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10},
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 10,
  },
  navIcon: {
    padding: 8,
  },
  fabWrapper: {
    position: 'absolute',
    bottom: 45, 
    alignSelf: 'center',
    zIndex: 10,
  },
  fabDiamond: {
    width: 50,
    height: 50,
    backgroundColor: colors.accent, 
    borderRadius: 16,
    transform: [{ rotate: '45deg' }], 
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.accent,
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 8,
  },
  fabIcon: {
    transform: [{ rotate: '-45deg' }], 
  }
});