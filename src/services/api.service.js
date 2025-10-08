const API_BASE_URL = 'http://localhost:8080/api';

export class ApiService {
  /**
   * Create a new conversation
   * @param {string} title - Conversation title (optional, defaults to "New Chat")
   * @param {string} modelName - Model name (optional, defaults to "llama3.2")
   * @returns {Promise<Object>} Created conversation
   */
  async createConversation(title = 'New Chat', modelName = 'llama3.2') {
    try {
      console.log('Fetching:', `${API_BASE_URL}/conversations`);
      const response = await fetch(`${API_BASE_URL}/conversations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title, modelName }),
      });

      console.log('Response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to create conversation: ${response.statusText} - ${errorText}`);
      }

      return response.json();
    } catch (error) {
      console.error('Fetch error:', error);
      throw error;
    }
  }

  /**
   * Get all conversations
   * @returns {Promise<Array>} List of conversations
   */
  async listConversations() {
    const response = await fetch(`${API_BASE_URL}/conversations`);

    if (!response.ok) {
      throw new Error(`Failed to list conversations: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Get a single conversation with messages
   * @param {string} conversationId - Conversation ID
   * @returns {Promise<Object>} Conversation with messages
   */
  async getConversation(conversationId) {
    console.log('API: Fetching conversation:', conversationId);
    const response = await fetch(`${API_BASE_URL}/conversations/${conversationId}`);

    console.log('API: Response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('API: Error response:', errorText);
      throw new Error(`Failed to get conversation: ${response.statusText} - ${errorText}`);
    }

    const data = await response.json();
    console.log('API: Conversation data received:', data);
    return data;
  }

  /**
   * Delete a conversation
   * @param {string} conversationId - Conversation ID
   * @returns {Promise<void>}
   */
  async deleteConversation(conversationId) {
    const response = await fetch(`${API_BASE_URL}/conversations/${conversationId}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error(`Failed to delete conversation: ${response.statusText}`);
    }
  }
}

export const apiService = new ApiService();