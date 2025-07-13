// Simple test to verify chat store types
import { useChatStore } from './chat-store';

// Test that the store can be created
const store = useChatStore.getState();

// Test that we can access the state
console.log('Chat store state:', {
  chats: store.chats,
  messages: store.messages,
  currentChat: store.currentChat,
  isLoading: store.isLoading,
  error: store.error
});

// Test that we can call methods
console.log('Chat store methods:', {
  fetchChats: typeof store.fetchChats,
  sendMessage: typeof store.sendMessage,
  createChat: typeof store.createChat
});

export {}; 