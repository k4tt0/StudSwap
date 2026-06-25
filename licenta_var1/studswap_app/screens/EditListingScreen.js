import React from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, ActivityIndicator, KeyboardAvoidingView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../context/ThemeContext';
import { getEditListingStyles } from '../styles/EditListingStyle';
import { useEditListing } from '../hooks/useEditListing';
import PillSelector from '../components/PillSelector';

const CATEGORIES = ['Books', 'Electronics', 'Equipment', 'Notes', 'Other'];
const TYPES = ['For Sale', 'Donation', 'Exchange'];
const CONDITIONS = ['New', 'Like New', 'Good', 'Fair', 'Poor'];

export default function EditListingScreen({ route, navigation }) {
  const { colors } = useTheme();
  const styles = getEditListingStyles(colors);
  const insets = useSafeAreaInsets();
  const { listing } = route.params;

  const {
    title, setTitle,
    price, setPrice,
    description, setDescription,
    category, setCategory,
    announcementType, setAnnouncementType,
    condition, setCondition,
    isUpdating,
    handleUpdate
  } = useEditListing(listing, navigation);

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="close" size={28} color={colors.textDark} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edit Listing</Text>
        <View style={{ width: 28 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        <Text style={styles.inputLabel}>Title</Text>
        <TextInput
          style={styles.input}
          value={title}
          onChangeText={setTitle}
          placeholder="What are you listing?"
          placeholderTextColor={colors.muted}
        />

        <PillSelector
          label="Type of Listing"
          options={TYPES}
          selectedValue={announcementType}
          onSelect={(val) => {
            setAnnouncementType(val);
            if (val !== 'For Sale') setPrice('');
          }}
        />

        {announcementType === 'For Sale' && (
          <>
            <Text style={styles.inputLabel}>Price (RON)</Text>
            <TextInput
              style={styles.input}
              value={price}
              onChangeText={setPrice}
              keyboardType="numeric"
              placeholder="e.g. 50"
              placeholderTextColor={colors.muted}
            />
          </>
        )}

        <PillSelector
          label="Category"
          options={CATEGORIES}
          selectedValue={category}
          onSelect={setCategory}
        />

        <PillSelector
          label="Condition"
          options={CONDITIONS}
          selectedValue={condition}
          onSelect={setCondition}
        />

        <Text style={styles.inputLabel}>Description</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={description}
          onChangeText={setDescription}
          multiline
          placeholder="Describe your item..."
          placeholderTextColor={colors.muted}
        />

      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity 
          style={styles.updateBtn}
          onPress={handleUpdate}
          disabled={isUpdating}
        >
          {isUpdating ? (
            <ActivityIndicator color="#FFF" />
          ) : (
            <Text style={styles.updateBtnText}>Save Changes</Text>
          )}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}