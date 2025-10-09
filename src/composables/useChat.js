import { ref } from 'vue';

export function useChat() {
  const messages = ref([]);
  const isLoading = ref(false);

  /**
   * Load messages from backend format to UI format
   * Backend format: { id, conversationId, role, content, createdAt, ... }
   * UI format: { id, content, type, timestamp }
   */
  const loadMessages = (backendMessages) => {
    console.log('loadMessages called with:', backendMessages);

    if (!backendMessages || !Array.isArray(backendMessages)) {
      console.log('No messages or not array, clearing messages');
      messages.value = [];
      return;
    }

    console.log('Converting', backendMessages.length, 'messages to UI format');
    messages.value = backendMessages.map(msg => ({
      id: msg.id,
      content: msg.content,
      type: msg.role === 'user' ? 'user' : 'bot',
      timestamp: new Date(msg.createdAt).toLocaleTimeString(),
    }));

    console.log('Messages loaded:', messages.value);
  };

  /**
   * Add a single message to the chat
   */
  const addMessage = (content, type, messageId = null) => {
    const message = {
      id: messageId || Date.now().toString(),
      content,
      type,
      timestamp: new Date().toLocaleTimeString(),
    };
    messages.value.push(message);
    return message;
  };

  const clearMessages = () => {
    messages.value = [];
  };

  const setLoading = (loading) => {
    isLoading.value = loading;
  };

  return {
    messages,
    isLoading,
    addMessage,
    loadMessages,
    clearMessages,
    setLoading,
  };
}
