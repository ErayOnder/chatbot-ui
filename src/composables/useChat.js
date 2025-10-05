import { ref, nextTick } from 'vue';

export function useChat() {
  const messages = ref([]);
  const isLoading = ref(false);
  let messageId = 0;

  const addMessage = (content, type) => {
    const message = {
      id: ++messageId,
      content,
      type,
      timestamp: new Date().toLocaleTimeString(),
    };
    messages.value.push(message);
    return message;
  };

  const clearMessages = () => {
    messages.value = [];
    messageId = 0;
  };

  const setLoading = (loading) => {
    isLoading.value = loading;
  };

  return {
    messages,
    isLoading,
    addMessage,
    clearMessages,
    setLoading,
  };
}
