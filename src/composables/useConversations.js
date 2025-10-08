import { ref } from 'vue';
import { apiService } from '../services/api.service';

export function useConversations() {
  const conversations = ref([]);
  const currentConversation = ref(null);
  const isLoading = ref(false);
  const error = ref(null);

  /**
   * Load all conversations
   */
  const loadConversations = async () => {
    isLoading.value = true;
    error.value = null;
    try {
      conversations.value = await apiService.listConversations();
    } catch (err) {
      error.value = err.message;
      console.error('Failed to load conversations:', err);
    } finally {
      isLoading.value = false;
    }
  };

  /**
   * Create a new conversation
   */
  const createConversation = async (title = 'New Chat', modelName = 'llama3.2') => {
    isLoading.value = true;
    error.value = null;
    try {
      const newConversation = await apiService.createConversation(title, modelName);
      conversations.value.unshift(newConversation); // Add to beginning of list
      currentConversation.value = newConversation;
      return newConversation;
    } catch (err) {
      error.value = err.message;
      console.error('Failed to create conversation:', err);
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  /**
   * Load a specific conversation with messages
   */
  const loadConversation = async (conversationId) => {
    console.log('useConversations: loadConversation called with ID:', conversationId);
    isLoading.value = true;
    error.value = null;
    try {
      const conversation = await apiService.getConversation(conversationId);
      console.log('useConversations: Setting currentConversation to:', conversation);
      currentConversation.value = conversation;
      return conversation;
    } catch (err) {
      error.value = err.message;
      console.error('Failed to load conversation:', err);
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  /**
   * Select a conversation (sets as current)
   */
  const selectConversation = async (conversationId) => {
    return await loadConversation(conversationId);
  };

  /**
   * Delete a conversation
   */
  const deleteConversation = async (conversationId) => {
    isLoading.value = true;
    error.value = null;
    try {
      await apiService.deleteConversation(conversationId);
      conversations.value = conversations.value.filter(c => c.id !== conversationId);

      // If deleted conversation was current, clear it
      if (currentConversation.value?.id === conversationId) {
        currentConversation.value = null;
      }
    } catch (err) {
      error.value = err.message;
      console.error('Failed to delete conversation:', err);
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  /**
   * Update conversation title in local state
   */
  const updateConversationTitle = (conversationId, newTitle) => {
    const conversation = conversations.value.find(c => c.id === conversationId);
    if (conversation) {
      conversation.title = newTitle;
    }
    if (currentConversation.value?.id === conversationId) {
      currentConversation.value.title = newTitle;
    }
  };

  return {
    conversations,
    currentConversation,
    isLoading,
    error,
    loadConversations,
    createConversation,
    loadConversation,
    selectConversation,
    deleteConversation,
    updateConversationTitle,
  };
}