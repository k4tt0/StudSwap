import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform, Image, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { useCreateListing } from '../hooks/useCreateListing';
import { getCreateListingStyles } from '../styles/CreateListingStyle'; 

export default function CreateListingScreen({ navigation, route }) {
  const { colors } = useTheme();
  const styles = getCreateListingStyles(colors); 
  
  const initialImages = route.params?.initialImages || [];
  
  const {
    images, handleAddMoreImages, removeImage,
    title, setTitle, description, setDescription,
    category, setCategory, categories,
    announcementType, setAnnouncementType, announcementTypes,
    price, setPrice, condition, setCondition, conditions,
    loading, handlePublish
  } = useCreateListing(navigation, initialImages);

  const [activeDropdown, setActiveDropdown] = useState(null);
  
  const renderDropdown = (label, value, setValue, options, dropdownId) => {
    const isOpen = activeDropdown === dropdownId;
    return (
      <View style={styles.dropdownContainer}>
        <Text style={styles.label}>{label}</Text>
        <TouchableOpacity 
          style={styles.inputBox} 
          onPress={() => setActiveDropdown(isOpen ? null : dropdownId)}
        >
          <Text style={{ color: value ? colors.textDark : colors.muted }}>{value || `Select ${label}`}</Text>
          <Ionicons name={isOpen ? "chevron-up" : "chevron-down"} size={20} color={colors.textDark} />
        </TouchableOpacity>
        
        {isOpen && (
          <View style={styles.optionsBox}>
            {options.map((opt) => (
              <TouchableOpacity key={opt} style={styles.optionItem} onPress={() => { setValue(opt); setActiveDropdown(null); }}>
                <Text style={styles.optionText}>{opt}</Text>
                {value === opt && <Ionicons name="checkmark" size={18} color={colors.accent} />}
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ padding: 5 }}>
          <Ionicons name="close" size={28} color={colors.textDark} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Add Listing</Text>
        <View style={{ width: 28 }} />
      </View>

      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={{ paddingBottom: 100 }} showsVerticalScrollIndicator={false}>
          
          {/* image carusl */}
          <View style={styles.carouselContainer}>
            <FlatList
              horizontal
              showsHorizontalScrollIndicator={false}
              data={[...images, 'ADD_BUTTON']}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item, index }) => {
                if (item === 'ADD_BUTTON') {
                  return images.length < 5 ? (
                    <TouchableOpacity style={styles.addImageBtn} onPress={handleAddMoreImages}>
                      <Ionicons name="camera-outline" size={32} color={colors.muted} />
                      <Text style={{ color: colors.muted, fontSize: 12, marginTop: 4 }}>Add Photo</Text>
                    </TouchableOpacity>
                  ) : null;
                }
                return (
                  <View style={styles.imageWrapper}>
                    <Image source={{ uri: item }} style={styles.carouselImage} />
                    <TouchableOpacity style={styles.removeIcon} onPress={() => removeImage(index)}>
                      <Ionicons name="close-circle" size={24} color="#FF3B30" />
                    </TouchableOpacity>
                  </View>
                );
              }}
            />
          </View>

          {/* form fields */}
          <View style={styles.formContainer}>
            <Text style={styles.label}>Title</Text>
            <TextInput
              style={styles.inputBox}
              placeholder="e.g., Mobile Systems Book"
              placeholderTextColor={colors.muted}
              value={title}
              onChangeText={setTitle}
            />

            <Text style={[styles.label, { marginTop: 16 }]}>Description</Text>
            <TextInput
              style={[styles.inputBox, styles.textArea]}
              placeholder="Describe the condition, author, specs..."
              placeholderTextColor={colors.muted}
              value={description}
              onChangeText={setDescription}
              multiline
              textAlignVertical="top"
            />

            {renderDropdown('Category', category, setCategory, categories, 'cat')}
            {renderDropdown('Announcement Type', announcementType, setAnnouncementType, announcementTypes, 'type')}

            {/* pricce */}
            {announcementType === 'For Sale' && (
              <View style={{ marginTop: 16 }}>
                <Text style={styles.label}>Price (RON)</Text>
                <TextInput
                  style={styles.inputBox}
                  placeholder="e.g., 50"
                  placeholderTextColor={colors.muted}
                  keyboardType="numeric"
                  value={price}
                  onChangeText={setPrice}
                />
              </View>
            )}

            {renderDropdown('Condition', condition, setCondition, conditions, 'cond')}

          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* publish buton */}
      <View style={styles.floatingFooter}>
        <TouchableOpacity 
          style={[styles.publishBtn, loading && { opacity: 0.7 }]} 
          onPress={handlePublish}
          disabled={loading}
        >
          <Text style={styles.publishBtnText}>{loading ? "Publishing..." : "Publish item"}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}