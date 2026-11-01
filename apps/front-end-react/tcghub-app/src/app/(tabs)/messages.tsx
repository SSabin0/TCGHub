import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { Searchbar, Text } from 'react-native-paper';
import { router } from 'expo-router';
import { CHATS, Chat } from '@/data/chats';

export default function MessagesScreen() {
  const [searchQuery, setSearchQuery] = useState('');

  // Keep chats whose person or card name matches the search.
  const query = searchQuery.trim().toLowerCase();
  const chats = CHATS.filter(
    (chat) =>
      chat.name.toLowerCase().includes(query) || chat.cardName.toLowerCase().includes(query),
  );

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.title}>MESSAGES</Text>
      <Text style={styles.subtitle}>Chats with buyers, sellers and traders.</Text>

      <Searchbar
        placeholder="Search messages…"
        value={searchQuery}
        onChangeText={setSearchQuery}
        style={styles.searchbar}
        inputStyle={styles.searchInput}
        iconColor="#245f28"
        placeholderTextColor="#7A705F"
        elevation={0}
      />

      <View style={styles.list}>
        {chats.map((chat) => (
          <ChatRow key={chat.id} chat={chat} />
        ))}
      </View>

      {chats.length === 0 && <Text style={styles.emptyMessage}>No chats found.</Text>}
    </ScrollView>
  );
}

function ChatRow({ chat }: { chat: Chat }) {
  // The preview is the last message in the chat.
  const last = chat.messages[chat.messages.length - 1];
  const preview = last ? (last.fromMe ? `You: ${last.text}` : last.text) : 'No messages yet';

  return (
    <Pressable
      onPress={() => router.push({ pathname: '/chat/[id]', params: { id: chat.id } })}
      accessibilityRole="button"
      accessibilityLabel={`${chat.name}, about ${chat.cardName}${chat.unread ? ', unread' : ''}: ${preview}`}
      style={styles.row}
    >
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>{chat.initials}</Text>
      </View>

      <View style={styles.rowText}>
        <View style={styles.rowTop}>
          <Text style={styles.name}>{chat.name}</Text>
          <Text style={styles.time}>{chat.lastTime}</Text>
        </View>
        <Text style={styles.about}>About: {chat.cardName}</Text>
        <View style={styles.previewRow}>
          <Text style={[styles.preview, chat.unread && styles.previewUnread]} numberOfLines={1}>
            {preview}
          </Text>
          {chat.unread && <View style={styles.unreadDot} />}
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#E2D7BD',
  },
  content: {
    padding: 20,
    paddingBottom: 32,
  },
  title: {
    fontFamily: 'BarlowCondensed_700Bold',
    fontSize: 48,
    lineHeight: 50,
    color: '#171717',
  },
  subtitle: {
    fontSize: 14,
    color: '#5A5246',
  },
  searchbar: {
    marginTop: 16,
    height: 46,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#B9A985',
    backgroundColor: '#EFE7D4',
  },
  searchInput: {
    minHeight: 0,
    fontSize: 15,
    color: '#171717',
  },

  // List
  list: {
    marginTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#C9BB98',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#C9BB98',
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#171717',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontFamily: 'BarlowCondensed_700Bold',
    fontSize: 17,
    color: '#E2D7BD',
  },
  rowText: {
    flex: 1,
    minWidth: 0,
  },
  rowTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: '#171717',
  },
  time: {
    fontSize: 12,
    color: '#5A5246',
  },
  about: {
    fontSize: 12,
    fontWeight: '600',
    color: '#245f28',
  },
  previewRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  preview: {
    flex: 1,
    fontSize: 14,
    color: '#5A5246',
  },
  previewUnread: {
    fontWeight: '600',
    color: '#171717',
  },
  unreadDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#2e7d32',
  },
  emptyMessage: {
    marginTop: 24,
    textAlign: 'center',
    color: '#5A5246',
  },
});