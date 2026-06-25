import React from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform, Image, FlatList, Keyboard } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../context/ThemeContext';
import { useCreateListing } from '../hooks/useCreateListing';
import { getCreateListingStyles } from '../styles/CreateListingStyle';
import PillSelector from '../components/PillSelector';

export default function CreateListingScreen({ navigation, route }) {
  const { colors } = useTheme();
  const styles = getCreateListingStyles(colors); 
  const insets = useSafeAreaInsets();
  
  const initialImages = route.params?.initialImages || [];
  
  const {
    images, handleAddMoreImages, removeImage,
    title, setTitle, description, setDescription,
    category, setCategory, categories,
    announcementType, setAnnouncementType, announcementTypes,
    price, setPrice, condition, setCondition, conditions,
    loading, handlePublish
  } = useCreateListing(navigation, initialImages);

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      
      <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
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

            <View style={{ marginTop: 16 }}>
              <PillSelector
                label="Category"
                options={categories}
                selectedValue={category}
                onSelect={setCategory}
              />

              <PillSelector
                label="Announcement Type"
                options={announcementTypes}
                selectedValue={announcementType}
                onSelect={(val) => {
                  setAnnouncementType(val);
                  if (val !== 'For Sale') setPrice('');
                }}
              />

              {announcementType === 'For Sale' && (
                <>
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
                  <View style={{ height: 20 }} />
                </>
              )}

              <PillSelector
                label="Condition"
                options={conditions}
                selectedValue={condition}
                onSelect={setCondition}
              />
            </View>
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
    </View>
  );
}