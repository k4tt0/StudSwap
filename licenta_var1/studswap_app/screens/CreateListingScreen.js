import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform, Image, FlatList, Keyboard } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../context/ThemeContext';
import { useCreateListing } from '../hooks/useCreateListing';
import { getCreateListingStyles } from '../styles/CreateListingStyle';
import PillSelector from '../components/PillSelector';
import InfoModal from '../components/InfoModal';
import ConfirmModal from '../components/ConfirmModal';

export default function CreateListingScreen({ navigation, route }) {
  const { colors } = useTheme();
  const styles = getCreateListingStyles(colors);
  const insets = useSafeAreaInsets();

  const initialImages = route.params?.initialImages || [];

  const {
    images, handleAddMoreImages, removeImage, moveImage,
    title, setTitle, description, setDescription,
    category, setCategory, categories,
    announcementType, setAnnouncementType, announcementTypes,
    price, setPrice, condition, setCondition, conditions,
    loading, handlePublish, validate
  } = useCreateListing(navigation, initialImages);

  const [infoVisible, setInfoVisible] = useState(false);
  const [infoConfig, setInfoConfig] = useState({ title: '', message: '' });
  const [attemptedSubmit, setAttemptedSubmit] = useState(false);
  const [exitVisible, setExitVisible] = useState(false);
  const [pendingExitAction, setPendingExitAction] = useState(null);
  const [justPublished, setJustPublished] = useState(false);

  // true if the user has entered anything worth losing
  const hasUnsavedChanges =
    images.length > 0 ||
    title.trim() !== '' ||
    description.trim() !== '' ||
    category !== '' ||
    announcementType !== '' ||
    price.trim() !== '' ||
    condition !== '';

  // intercept back gesture / hardware back / swipe-to-dismiss
  useEffect(() => {
    const unsubscribe = navigation.addListener('beforeRemove', (e) => {
      // allow leaving when nothing was filled in, while publishing, or right after a successful publish
      if (!hasUnsavedChanges || loading || justPublished) return;

      e.preventDefault();
      setPendingExitAction(e.data.action);
      setExitVisible(true);
    });

    return unsubscribe;
  }, [navigation, hasUnsavedChanges, loading, justPublished]);

  const confirmExit = useCallback(() => {
    setExitVisible(false);
    if (pendingExitAction) {
      navigation.dispatch(pendingExitAction);
    } else {
      navigation.goBack();
    }
  }, [navigation, pendingExitAction]);

  const cancelExit = () => {
    setPendingExitAction(null);
    setExitVisible(false);
  };

  const errors = attemptedSubmit ? validate() : {};

  const showInfo = (result) => {
    if (!result) return;
    setInfoConfig({ title: result.title, message: result.message });
    setInfoVisible(true);
  };

  const onAddMoreImages = async () => {
    const result = await handleAddMoreImages();
    showInfo(result);
  };

  const onPublishPress = async () => {
    setAttemptedSubmit(true);
    if (Object.keys(validate()).length > 0) return;
    setJustPublished(true);
    const result = await handlePublish();
    if (result && result.type !== 'success') {
      // publish failed — re-arm the exit guard so changes stay protected
      setJustPublished(false);
    }
    showInfo(result);
  };

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
                        onAddMoreImages();
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

                    {index === 0 && (
                      <View style={styles.coverBadge}>
                        <Text style={styles.coverBadgeText}>Cover</Text>
                      </View>
                    )}

                    <View style={styles.reorderBar}>
                      <TouchableOpacity
                        style={[styles.reorderBtn, index === 0 && styles.reorderBtnDisabled]}
                        disabled={index === 0}
                        onPress={() => moveImage(index, index - 1)}
                      >
                        <Ionicons name="chevron-back" size={18} color="#FFFFFF" />
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={[styles.reorderBtn, index === images.length - 1 && styles.reorderBtnDisabled]}
                        disabled={index === images.length - 1}
                        onPress={() => moveImage(index, index + 1)}
                      >
                        <Ionicons name="chevron-forward" size={18} color="#FFFFFF" />
                      </TouchableOpacity>
                    </View>
                  </View>
                );
              }}
            />
          </View>
          {errors.images && <Text style={[styles.errorText, { marginLeft: 24, marginTop: -10 }]}>{errors.images}</Text>}

          <View style={styles.formContainer}>
            <Text style={styles.label}>Title</Text>
            <TextInput
              style={styles.inputBox}
              placeholder="e.g., Mobile Systems Book"
              placeholderTextColor={colors.muted}
              value={title}
              onChangeText={setTitle}
            />
            {errors.title && <Text style={styles.errorText}>{errors.title}</Text>}

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
            {errors.description && <Text style={styles.errorText}>{errors.description}</Text>}

            <View style={{ marginTop: 16 }}>
              <PillSelector
                label="Category"
                options={categories}
                selectedValue={category}
                onSelect={setCategory}
              />
              {errors.category && <Text style={[styles.errorText, { marginTop: -12 }]}>{errors.category}</Text>}

              <PillSelector
                label="Announcement Type"
                options={announcementTypes}
                selectedValue={announcementType}
                onSelect={(val) => {
                  setAnnouncementType(val);
                  if (val !== 'For Sale') setPrice('');
                }}
              />
              {errors.announcementType && <Text style={[styles.errorText, { marginTop: -12 }]}>{errors.announcementType}</Text>}

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
                  {errors.price && <Text style={styles.errorText}>{errors.price}</Text>}
                  <View style={{ height: 20 }} />
                </>
              )}

              <PillSelector
                label="Condition"
                options={conditions}
                selectedValue={condition}
                onSelect={setCondition}
              />
              {errors.condition && <Text style={[styles.errorText, { marginTop: -12 }]}>{errors.condition}</Text>}
            </View>
          </View>

        </ScrollView>

        <View style={styles.bottomFooter}>
          <TouchableOpacity
            style={[styles.publishBtn, loading && { opacity: 0.7 }]}
            onPress={onPublishPress}
            disabled={loading}
          >
            <Text style={styles.publishBtnText}>{loading ? "Publishing..." : "Publish item"}</Text>
          </TouchableOpacity>
        </View>

      </KeyboardAvoidingView>

      <InfoModal
        visible={infoVisible}
        title={infoConfig.title}
        message={infoConfig.message}
        colors={colors}
        onClose={() => setInfoVisible(false)}
      />

      <ConfirmModal
        visible={exitVisible}
        title="Discard listing?"
        message="You have unsaved changes. If you leave now, this listing and its photos will be lost."
        confirmText="Discard"
        cancelText="Keep editing"
        colors={colors}
        onConfirm={confirmExit}
        onCancel={cancelExit}
      />
    </View>
  );
}