// studswap_app/components/NavBar.js
import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';

export default function NavBar({ navigation, activeScreen }) {
  
  // Helper function to figure out icon colors based on the active screen
  const { colors } = useTheme();
  const getIconColor = (screenName) => activeScreen === screenName ? colors.accent : colors.muted;
  const styles = getNavBarStyles(colors);

  return (
    <>
      <View style={styles.bottomNavContainer}>
        {/* 1. HOME BUTTON */}
        <TouchableOpacity onPress={() => navigation.navigate('Home')} style={styles.navIcon}>
          <MaterialCommunityIcons 
            name={activeScreen === 'Home' ? "home-variant" : "home-variant-outline"} 
            size={28} 
            color={getIconColor('Home')} 
          />
        </TouchableOpacity>
        
        {/* 2. SAVED ITEMS BUTTON */}
        <TouchableOpacity onPress={() => navigation.navigate('SavedListings')} style={[styles.navIcon, { marginRight: 40 }]}>
          <Ionicons 
            name={activeScreen === 'SavedListings' ? "bookmark" : "bookmark-outline"} 
            size={26} 
            color={getIconColor('SavedListings')} 
          />
        </TouchableOpacity>

        {/* 3. CHAT BUTTON */}
        <TouchableOpacity onPress={() => navigation.navigate('Messages')} style={[styles.navIcon, { marginLeft: 40 }]}>
          <Ionicons 
            name={activeScreen === 'Messages' ? "chatbubble" : "chatbubble-outline"} 
            size={26} 
            color={getIconColor('Messages')} 
          />
        </TouchableOpacity>

        {/* 4. PROFILE BUTTON */}
        <TouchableOpacity onPress={() => navigation.navigate('Profile')} style={styles.navIcon}>
          <Ionicons 
            name={activeScreen === 'Profile' ? "person" : "person-outline"} 
            size={26} 
            color={getIconColor('Profile')} 
          />
        </TouchableOpacity>
      </View>

      {/* FAB - CENTER DIAMOND BUTTON */}
      <View style={styles.fabWrapper}>
        <TouchableOpacity 
          style={styles.fabDiamond} 
          activeOpacity={0.8}
          onPress={() => console.log("Add button pressed")} 
        >
          <MaterialCommunityIcons name="plus" size={32} color="#FFF" style={styles.fabIcon} />
        </TouchableOpacity>
      </View>
    </>
  );
}

// 4. Wrap the styles in a function that accepts 'colors'
const getNavBarStyles = (colors) => StyleSheet.create({
  bottomNavContainer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: 70,
    backgroundColor: colors.navbar, // Dynamic!
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  navIcon: {
    padding: 10,
  },
  fabWrapper: {
    position: 'absolute',
    bottom: 30, 
    alignSelf: 'center',
    width: 80,
    height: 80,
    backgroundColor: colors.background, // Dynamic!
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  fabDiamond: {
    width: 56,
    height: 56,
    backgroundColor: colors.accent, // Dynamic!
    borderRadius: 16,
    transform: [{ rotate: '45deg' }], 
    justifyContent: 'center',
    alignItems: 'center',
  },
  fabIcon: {
    transform: [{ rotate: '-45deg' }], 
  }
});