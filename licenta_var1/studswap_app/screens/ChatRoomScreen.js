import React from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, Image, KeyboardAvoidingView, Platform, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { getChatRoomStyles } from '../styles/ChatRoomStyle';
import { useChatRoom } from '../hooks/useChatRoom';

export default function ChatRoomScreen({ route, navigation }) {
  const { colors } = useTheme();
  const styles = getChatRoomStyles(colors);
  const { chatId, otherUserName, listingId, otherUserId } = route.params;

  const {
    messages, newMessage, setNewMessage, listingData, isListingUnavailable, currentUserId, sendMessage, handleSendPhoto,
    offerModalVisible, setOfferModalVisible, offerAmount, setOfferAmount, submitOffer, updateOfferStatus
  } = useChatRoom(chatId, listingId, otherUserId);

  const renderMessage = ({ item }) => {
    const isMyMessage = item.senderId === currentUserId;
    const isImage = item.text && (item.text.startsWith('http') || item.text.startsWith('file:/'));
    const isOffer = item.type === 'offer';

    return (
      <View style={[styles.messageWrapper, isMyMessage ? styles.myMessageWrapper : styles.otherMessageWrapper]}>
        <View style={[
          styles.messageBubble, 
          isMyMessage ? { backgroundColor: colors.accent } : { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.inputBorder },
          isImage && { backgroundColor: 'transparent', borderWidth: 0, padding: 0 },
          isOffer && { backgroundColor: isMyMessage ? colors.accent : colors.surface, borderColor: colors.accent, borderWidth: 2 } 
        ]}>
          
          {isImage ? (
            <Image source={{ uri: item.text }} style={styles.chatImage} />
          ) : isOffer ? (
            <View>
              <Text style={[styles.offerTitle, { color: isMyMessage ? '#FFF' : colors.textDark }]}>
                {isMyMessage ? 'You offered:' : 'Offer received:'} {item.offerAmount} RON
              </Text>
              
              {item.offerStatus === 'pending' && !isMyMessage && (
                <View style={styles.offerActionsContainer}>
                  <TouchableOpacity onPress={() => updateOfferStatus(item.id, 'accepted')} style={styles.offerAcceptBtn}>
                     <Text style={styles.offerBtnText}>Accept</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => updateOfferStatus(item.id, 'declined')} style={styles.offerDeclineBtn}>
                     <Text style={styles.offerBtnText}>Decline</Text>
                  </TouchableOpacity>
                </View>
              )}

              {item.offerStatus === 'accepted' && <Text style={[styles.offerStatusAccepted, { color: isMyMessage ? '#E8F5E9' : colors.accent }]}>Offer Accepted ✓</Text>}
              {item.offerStatus === 'declined' && <Text style={[styles.offerStatusDeclined, { color: isMyMessage ? '#FFEBEE' : '#E63946' }]}>Offer Declined ✗</Text>}
            </View>
          ) : (
            <Text style={[styles.messageText, { color: isMyMessage ? '#FFF' : colors.textDark }]}>
              {item.text}
            </Text>
          )}
        </View>
      </View>
    );
  };


  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 25}
    >
      <View style={styles.container}>
        
        {/* HEADER */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={26} color={colors.textDark} />
          </TouchableOpacity>
          <TouchableOpacity 
            activeOpacity={0.6}
            onPress={() => otherUserId && navigation.navigate('Profile', { userId: otherUserId, fromListing: true })}
          >
            <Text style={styles.headerTitle}>{otherUserName}</Text>
          </TouchableOpacity>
          <View style={{ width: 26 }} />
        </View>

        {/* LISTING CARD */}
        {listingData && !listingData._unavailable && (
          <TouchableOpacity style={styles.listingHeaderCard} activeOpacity={0.9} onPress={() => navigation.navigate('ListingDetails', { listing: listingData })}>
            {listingData.images && listingData.images.length > 0 && (
              <Image source={{ uri: listingData.images[0] }} style={styles.listingImageLeft} />
            )}
            <View style={styles.listingDetailsRight}>
              <Text style={styles.listingTitle} numberOfLines={1}>{listingData.title}</Text>
              <Text style={styles.listingPrice}>{listingData.announcementType === 'Donation' ? 'Free' : `${listingData.price} RON`}</Text>
            </View>
          </TouchableOpacity>
        )}

        {/* UNAVAILABLE LISTING CARD */}
        {(isListingUnavailable || listingData?._unavailable) && (
          <View style={[styles.listingHeaderCard, { opacity: 0.7 }]}>
            <View style={[styles.listingImageLeft, { justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background }]}>
              <Ionicons name="alert-circle-outline" size={28} color={colors.muted} />
            </View>
            <View style={styles.listingDetailsRight}>
              <Text style={styles.listingTitle} numberOfLines={1}>
                {listingData?.title || 'Listing'}
              </Text>
              <Text style={[styles.listingPrice, { color: colors.muted }]}>
                No longer available
              </Text>
            </View>
          </View>
        )}

        {/* MESSAGES LIST */}
        {messages.length === 0 ? (
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 30 }}>
            <Ionicons name="chatbubbles-outline" size={56} color={colors.inputBorder} />
            <Text style={{ color: colors.muted, fontSize: 15, marginTop: 12, textAlign: 'center' }}>
              Say hi to start the conversation
            </Text>
          </View>
        ) : (
          <FlatList 
            data={messages} 
            keyExtractor={item => item.id} 
            renderItem={renderMessage} 
            inverted 
            contentContainerStyle={{ paddingHorizontal: 15, paddingVertical: 15 }} 
            showsVerticalScrollIndicator={false} 
          />
        )}

        {/* INPUT AREA */}
        <View style={styles.inputContainer}>
          <View style={styles.iconButtonsGroup}>
            <TouchableOpacity style={styles.actionIconBtn} onPress={handleSendPhoto}>
              <Ionicons name="camera-outline" size={26} color={colors.muted} />
            </TouchableOpacity>
            {listingData?.announcementType === 'For Sale' && !listingData?._unavailable && (
              <TouchableOpacity style={styles.actionIconBtn} onPress={() => setOfferModalVisible(true)}>
                <Ionicons name="cash-outline" size={26} color={colors.accent} />
              </TouchableOpacity>
            )}
          </View>
          <View style={styles.inputFieldWrapper}>
            <TextInput style={styles.input} placeholder="Type a message..." placeholderTextColor={colors.muted} value={newMessage} onChangeText={setNewMessage} multiline />
            <TouchableOpacity style={styles.sendButton} onPress={() => sendMessage()} disabled={!newMessage.trim()}>
              <Ionicons name="send" size={20} color={newMessage.trim() ? colors.accent : colors.muted} />
            </TouchableOpacity>
          </View>
        </View>

        {/* OFFER MODAL */}
        <Modal visible={offerModalVisible} transparent animationType="fade">
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Make an Offer</Text>
              <Text style={styles.modalSubtitle}>Current price: {listingData?.price} RON</Text>
              
              <TextInput 
                style={styles.modalInput} 
                placeholder="Enter amount (e.g. 40)" 
                placeholderTextColor={colors.muted} 
                keyboardType="numeric" 
                value={offerAmount} 
                onChangeText={setOfferAmount} 
                autoFocus 
              />
              
              <View style={styles.modalButtonsRow}>
                <TouchableOpacity onPress={() => setOfferModalVisible(false)} style={styles.modalCancelBtn}>
                  <Text style={styles.modalCancelText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={submitOffer} style={styles.modalSubmitBtn}>
                  <Text style={styles.modalSubmitText}>Send Offer</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

      </View>
    </KeyboardAvoidingView>
  );
}