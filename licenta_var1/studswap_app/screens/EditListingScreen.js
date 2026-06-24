import React from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, ActivityIndicator, KeyboardAvoidingView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { getEditListingStyles } from '../styles/EditListingStyle';
import { useEditListing } from '../hooks/useEditListing';

const CATEGORIES = ['Books', 'Electronics', 'Equipment', 'Notes', 'Other'];
const TYPES = ['For Sale', 'Donation', 'Exchange'];
const CONDITIONS = ['New', 'Like New', 'Good', 'Fair', 'Poor'];

export default function EditListingScreen({ route, navigation }) {
  const { colors } = useTheme();
  const styles = getEditListingStyles(colors);
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

  const renderPills = (options, selectedValue, onSelect) => (
    <View style={styles.pillsContainer}>
      {options.map(option => {
        const isActive = selectedValue === option;
        return (
          <TouchableOpacity
            key={option}
            style={[styles.pill, isActive && styles.pillActive]}
            onPress={() => onSelect(option)}
          >
            <Text style={[styles.pillText, isActive && styles.pillTextActive]}>
              {option}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.header}>
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

        <Text style={styles.inputLabel}>Type of Listing</Text>
        {renderPills(TYPES, announcementType, (val) => {
          setAnnouncementType(val);
          if (val !== 'For Sale') setPrice(''); 
        })}

        {/* Arătăm input-ul de preț DOAR dacă e For Sale */}
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

        <Text style={styles.inputLabel}>Category</Text>
        {renderPills(CATEGORIES, category, setCategory)}

        <Text style={styles.inputLabel}>Condition</Text>
        {renderPills(CONDITIONS, condition, setCondition)}

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