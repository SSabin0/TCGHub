import { useRef, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import { Text } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CHATS, ChatMessage } from '@/data/chats';

const QUICK_REPLIES = ['Propose a trade', 'Suggest a meetup', 'Still available?'];

export default function ChatScreen() {
  // The [id] in the file name becomes this value, e.g. /chat/1 → id = '1'.
  const { id } = useLocalSearchParams<{ id: string }>();
  const chat = CHATS.find((c) => c.id === id);

  const insets = useSafeAreaInsets();
  const scrollRef = useRef<ScrollView>(null);

  const [messages, setMessages] = useState<ChatMessage[]>(chat ? chat.messages : []);
  const [draft, setDraft] = useState('');

  if (!chat) {
    return (
      <View style={styles.screen}>
        <Text style={styles.notFound}>Chat not found.</Text>
      </View>
    );
  }

  // Add the typed message to the bottom of the chat (only on this device for now).
  const send = () => {
    const text = draft.trim();
    if (!text) return;
    setMessages((current) => [
      ...current,
      { id: `local-${current.length + 1}`, fromMe: true, text, time: 'Now' },
    ]);
    setDraft('');
  };

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      {/* Header */}
      <View style={styles.header}>
        <Pressable
          onPress={() => router.back()}
          accessibilityRole="button"
          accessibilityLabel="Back to messages"
          style={styles.iconButton}
        >
          <Ionicons name="chevron-back" size={26} color="#171717" />
        </Pressable>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{chat.initials}</Text>
        </View>
        <View style={styles.headerText}>
          <Text style={styles.name}>{chat.name}</Text>
          <Text style={styles.distance}>{chat.distance}</Text>
        </View>
        <Pressable
          onPress={() => console.log('More options pressed')}
          accessibilityRole="button"
          accessibilityLabel="More options"
          style={styles.iconButton}
        >
          <Ionicons name="ellipsis-vertical" size={22} color="#171717" />
        </Pressable>
      </View>

      {/* The listing this chat is about */}
      <Pressable
        onPress={() => console.log('View listing', chat.cardName)}
        accessibilityRole="button"
        accessibilityLabel={`View listing: ${chat.cardName}`}
        style={styles.listing}
      >
        <View style={styles.listingThumbFrame}>
          <View style={[styles.listingThumb, { backgroundColor: chat.cardColor }]} />
        </View>
        <View style={styles.listingText}>
          <Text style={styles.listingName}>{chat.cardName}</Text>
          <Text style={styles.listingDetail}>{chat.cardDetail}</Text>
        </View>
        <Text style={styles.listingLink}>View listing</Text>
      </Pressable>

      {/* Messages */}
      <ScrollView
        ref={scrollRef}
        style={styles.messageScroll}
        contentContainerStyle={styles.messageList}
        onContentSizeChange={() => scrollRef.current?.scrollToEnd({ animated: true })}
      >
        <Text style={styles.dayLabel}>TODAY</Text>
        {messages.map((message) => (
          <MessageBubble key={message.id} message={message} />
        ))}
      </ScrollView>

      {/* Quick replies + typing box */}
      <View style={[styles.composer, { paddingBottom: insets.bottom + 10 }]}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.quickReplies}>
          {QUICK_REPLIES.map((reply) => (
            <Pressable
              key={reply}
              onPress={() => setDraft(reply)}
              accessibilityRole="button"
              style={styles.quickReply}
            >
              <Text style={styles.quickReplyText}>{reply}</Text>
            </Pressable>
          ))}
        </ScrollView>

        <View style={styles.inputRow}>
          <TextInput
            value={draft}
            onChangeText={setDraft}
            onSubmitEditing={send}
            placeholder="Message…"
            placeholderTextColor="#7A705F"
            returnKeyType="send"
            accessibilityLabel={`Message ${chat.name}`}
            style={styles.input}
          />
          <Pressable
            onPress={send}
            disabled={!draft.trim()}
            accessibilityRole="button"
            accessibilityLabel="Send message"
            style={[styles.sendButton, !draft.trim() && styles.sendButtonDisabled]}
          >
            <Ionicons name="arrow-up" size={22} color="#FFFFFF" />
          </Pressable>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

function MessageBubble({ message }: { message: ChatMessage }) {
  return (
    <View style={[styles.bubbleWrap, message.fromMe ? styles.bubbleWrapMine : styles.bubbleWrapTheirs]}>
      <View style={[styles.bubble, message.fromMe ? styles.bubbleMine : styles.bubbleTheirs]}>
        <Text style={[styles.bubbleText, message.fromMe && styles.bubbleTextMine]}>{message.text}</Text>
      </View>
      <Text style={styles.bubbleTime}>{message.time}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#E2D7BD',
  },
  notFound: {
    marginTop: 40,
    textAlign: 'center',
    color: '#5A5246',
  },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 6,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#C9BB98',
  },
  iconButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#171717',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontFamily: 'BarlowCondensed_700Bold',
    fontSize: 15,
    color: '#E2D7BD',
  },
  headerText: {
    flex: 1,
    minWidth: 0,
  },
  name: {
    fontSize: 17,
    fontWeight: '600',
    color: '#171717',
  },
  distance: {
    fontSize: 13,
    color: '#5A5246',
  },

  // Pinned listing
  listing: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginHorizontal: 16,
    marginTop: 10,
    paddingVertical: 8,
    paddingLeft: 8,
    paddingRight: 12,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#C9BB98',
    backgroundColor: '#EFE7D4',
  },
  listingThumbFrame: {
    width: 34,
    height: 46,
    padding: 2,
    borderRadius: 5,
    backgroundColor: '#171717',
  },
  listingThumb: {
    flex: 1,
    borderRadius: 3,
  },
  listingText: {
    flex: 1,
    minWidth: 0,
  },
  listingName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#171717',
  },
  listingDetail: {
    fontSize: 12,
    color: '#5A5246',
  },
  listingLink: {
    fontSize: 14,
    fontWeight: '600',
    color: '#245f28',
  },

  // Messages
  messageScroll: {
    flex: 1,
  },
  messageList: {
    padding: 16,
    gap: 8,
  },
  dayLabel: {
    alignSelf: 'center',
    marginBottom: 4,
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.7,
    color: '#5A5246',
  },
  bubbleWrap: {
    maxWidth: '78%',
    gap: 2,
  },
  bubbleWrapMine: {
    alignSelf: 'flex-end',
    alignItems: 'flex-end',
  },
  bubbleWrapTheirs: {
    alignSelf: 'flex-start',
    alignItems: 'flex-start',
  },
  bubble: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 18,
  },
  bubbleMine: {
    backgroundColor: '#171717',
    borderBottomRightRadius: 4,
  },
  bubbleTheirs: {
    backgroundColor: '#EFE7D4',
    borderWidth: 1,
    borderColor: '#C9BB98',
    borderBottomLeftRadius: 4,
  },
  bubbleText: {
    fontSize: 15,
    lineHeight: 20,
    color: '#171717',
  },
  bubbleTextMine: {
    color: '#E2D7BD',
  },
  bubbleTime: {
    fontSize: 11,
    color: '#5A5246',
  },

  // Quick replies + typing box
  composer: {
    gap: 8,
    paddingTop: 8,
    paddingHorizontal: 16,
    borderTopWidth: 1,
    borderTopColor: '#C9BB98',
  },
  quickReplies: {
    gap: 8,
  },
  quickReply: {
    height: 36,
    paddingHorizontal: 14,
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: '#171717',
    justifyContent: 'center',
  },
  quickReplyText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#171717',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  input: {
    flex: 1,
    height: 46,
    paddingHorizontal: 16,
    borderRadius: 23,
    borderWidth: 1.5,
    borderColor: '#B9A985',
    backgroundColor: '#EFE7D4',
    fontSize: 16,
    color: '#171717',
  },
  sendButton: {
    width: 46,
    height: 46,
    borderRadius: 23,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2e7d32',
  },
  sendButtonDisabled: {
    opacity: 0.4,
  },
});