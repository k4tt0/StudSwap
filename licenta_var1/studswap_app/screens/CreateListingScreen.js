import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform, Image, FlatList, Modal, Keyboard } from 'react-native';
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

  const [dropdownConfig, setDropdownConfig] = useState({
    visible: false, label: '', options: [], value: '', setValue: null
  });

  const openDropdown = (label, value, setValue, options) => {
    Keyboard.dismiss();
    setDropdownConfig({ visible: true, label, options, value, setValue });
  };

  const closeDropdown = () => {
    setDropdownConfig(prev => ({ ...prev, visible: false }));
  };

  const renderDropdownButton = (label, value, setValue, options) => {
    return (
      <View style={styles.dropdownContainer}>
        <Text style={styles.label}>{label}</Text>
        <TouchableOpacity 
          style={styles.inputBox} 
          activeOpacity={0.7}
          onPress={() => openDropdown(label, value, setValue, options)}
        >
          <Text style={{ color: value ? colors.textDark : colors.muted }}>{value || `Select ${label}`}</Text>
          <Ionicons name="chevron-down" size={20} color={colors.textDark} />
        </TouchableOpacity>
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

      <KeyboardAvoidingView 
        style={{ flex: 1 }} 
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <ScrollView 
          style={{ flex: 1 }}
          contentContainerStyle={{ paddingBottom: 100 }} 
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          onScrollBeginDrag={() => Keyboard.dismiss()}
        >
          
          <View style={styles.carouselContainer}>
            <FlatList
              horizontal
              showsHorizontalScrollIndicator={false}
              data={[...images, 'ADD_BUTTON']}
              keyExtractor={(item, index) => index.toString()}
              keyboardShouldPersistTaps="handled"
              renderItem={({ item, index }) => {
                if (item === 'ADD_BUTTON') {
                  return images.length < 5 ? (
                    <TouchableOpacity 
                      style={styles.addImageBtn} 
                      onPress={() => {
                        Keyboard.dismiss();
                        handleAddMoreImages();
                      }}
                    >
                      <Ionicons name="camera-outline" size={32} color={colors.muted} />
                      <Text style={{ color: colors.muted, fontSize: 12, marginTop: 4 }}>Add Photo</Text>
                    </TouchableOpacity>
                  ) : null;
                }
                return (
                  <View style={styles.imageWrapper}>
                    <Image source={{ uri: item }} style={styles.carouselImage} />
                    <TouchableOpacity style={styles.removeIcon} onPress={() => removeImage(index)}>
                      <Ionicons name="close" size={20} color="#FFFFFF" />
                    </TouchableOpacity>
                  </View>
                );
              }}
            />
          </View>

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
              onBlur={() => Keyboard.dismiss()}
            />

            {renderDropdownButton('Category', category, setCategory, categories)}
            {renderDropdownButton('Announcement Type', announcementType, setAnnouncementType, announcementTypes)}

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
                  returnKeyType="done"
                  onSubmitEditing={() => Keyboard.dismiss()}
                />
              </View>
            )}

            {renderDropdownButton('Condition', condition, setCondition, conditions)}
          </View>

        </ScrollView>

        <View style={styles.bottomFooter}>
          <TouchableOpacity 
            style={[styles.publishBtn, loading && { opacity: 0.7 }]} 
            onPress={handlePublish}
            disabled={loading}
          >
            <Text style={styles.publishBtnText}>{loading ? "Publishing..." : "Publish item"}</Text>
          </TouchableOpacity>
        </View>

      </KeyboardAvoidingView>

      <Modal visible={dropdownConfig.visible} transparent animationType="slide">
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={closeDropdown}>
          
          <View style={[styles.modalContent, { backgroundColor: colors.background }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: colors.textDark }]}>Select {dropdownConfig.label}</Text>
              <TouchableOpacity onPress={closeDropdown}>
                <Ionicons name="close-circle" size={28} color={colors.muted} />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              {dropdownConfig.options.map(opt => {
                const isActive = dropdownConfig.value === opt;
                return (
                  <TouchableOpacity
                    key={opt}
                    style={[
                      styles.modalOption, 
                      isActive && { backgroundColor: colors.surface, borderColor: colors.accent, borderWidth: 1 }
                    ]}
                    onPress={() => {
                      dropdownConfig.setValue(opt);
                      closeDropdown();
                    }}
                  >
                    <Text style={{ 
                      color: colors.textDark, 
                      fontSize: 16, 
                      fontWeight: isActive ? 'bold' : 'normal' 
                    }}>
                      {opt}
                    </Text>
                    {isActive && <Ionicons name="checkmark-circle" size={24} color={colors.accent} />}
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
          
        </TouchableOpacity>
      </Modal>

    </View>
  );
}