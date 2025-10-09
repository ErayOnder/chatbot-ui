<template>
  <div id="app">
    <ConversationSidebar
      :conversations="conversations"
      :currentConversationId="currentConversation?.id"
      :isLoading="conversationsLoading"
      @new-chat="handleNewChat"
      @select-conversation="handleSelectConversation"
      @delete-conversation="handleDeleteConversation"
    />

    <div class="main-content">
      <ChatHeader
        :isConnected="isConnected"
        :conversationTitle="currentConversation?.title"
      />

      <div class="chat-container">
        <ChatHistory :messages="messages" :isLoading="isLoading" />
        <ChatInput
          :isConnected="isConnected"
          :isLoading="isLoading"
          :hasActiveConversation="!!currentConversation"
          @send-message="sendMessage"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { onMounted } from 'vue';
import ConversationSidebar from './components/ConversationSidebar.vue';
import ChatHeader from './components/ChatHeader.vue';
import ChatHistory from './components/ChatHistory.vue';
import ChatInput from './components/ChatInput.vue';
import { useWebSocket } from './composables/useWebSocket.js';
import { useChat } from './composables/useChat.js';
import { useConversations } from './composables/useConversations.js';

export default {
  name: 'App',
  components: {
    ConversationSidebar,
    ChatHeader,
    ChatHistory,
    ChatInput,
  },
  setup() {
    const WS_URL = 'ws://localhost:8080/ws';

    const { isConnected, connect, send } = useWebSocket(WS_URL);
    const { messages, isLoading, addMessage, loadMessages, setLoading, clearMessages } = useChat();
    const {
      conversations,
      currentConversation,
      isLoading: conversationsLoading,
      loadConversations,
      createConversation,
      selectConversation,
      deleteConversation,
      updateConversationTitle,
    } = useConversations();

    const handleMessage = (event) => {
      try {
        const data = JSON.parse(event.data);

        // Handle error responses
        if (data.error) {
          console.error('Received error from server:', data.error);
          setLoading(false);
          alert('Error: ' + data.error);
          return;
        }

        // Backend returns: { botMessage: { id, conversationId, role, content, createdAt } }
        if (data.botMessage) {
          const conversationId = data.botMessage.conversationId;

          // Check if this is the first message (might need title update)
          // We'll reload the conversation list to get any updated title
          setTimeout(async () => {
            await loadConversations(); // Refresh sidebar to show updated title
          }, 100);

          // IMPORTANT: Only add message if it belongs to the currently selected conversation
          // This prevents race conditions when user switches conversations while bot is typing
          if (currentConversation.value && conversationId === currentConversation.value.id) {
            // Message belongs to current conversation - stop loading and add it
            setLoading(false);
            addMessage(data.botMessage.content, 'bot', data.botMessage.id);

            // Reload current conversation to update the header with new title
            setTimeout(async () => {
              await selectConversation(conversationId);
            }, 100);
          } else {
            // Message is for a different conversation - just ignore it
            console.log('Received message for different conversation, ignoring:', conversationId);
          }
        }
      } catch (error) {
        console.error('Failed to parse message:', error);
        setLoading(false);
        addMessage(event.data, 'bot');
      }
    };

    const sendMessage = (message) => {
      if (!currentConversation.value) {
        console.error('No active conversation');
        return;
      }
      // TODO: Add message to the conversation
      addMessage(message, 'user');
      const success = send(currentConversation.value.id, message);
      if (success) {
        setLoading(true);
      }
    };

    const handleNewChat = async () => {
      try {
        const newConversation = await createConversation();
        console.log('Conversation created:', newConversation);
        clearMessages();
      } catch (error) {
        console.error('Failed to create conversation:', error);
        alert('Failed to create conversation: ' + error.message);
      }
    };

    const handleSelectConversation = async (conversationId) => {
      // Stop loading indicator when switching conversations
      setLoading(false);

      try {
        const conversation = await selectConversation(conversationId);
        console.log('Conversation loaded:', conversation.id);

        if (conversation.messages && conversation.messages.length > 0) {
          console.log('Loading messages into chat...');
          loadMessages(conversation.messages);
        } else {
          console.log('No messages found, clearing chat');
          clearMessages();
        }
      } catch (error) {
        console.error('Failed to load conversation:', error);
        alert('Failed to load conversation: ' + error.message);
      }
    };

    const handleDeleteConversation = async (conversationId) => {
      try {
        await deleteConversation(conversationId);
        if (currentConversation.value?.id === conversationId) {
          clearMessages();
        }
      } catch (error) {
        console.error('Failed to delete conversation:', error);
      }
    };

    onMounted(async () => {
      // Connect WebSocket
      connect(handleMessage);

      // Load conversations
      await loadConversations();
    });

    return {
      isConnected,
      messages,
      isLoading,
      conversations,
      currentConversation,
      conversationsLoading,
      sendMessage,
      handleNewChat,
      handleSelectConversation,
      handleDeleteConversation,
    };
  },
};
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

#app {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: row;
  background-color: #f5f5f5;
  overflow: hidden;
}

.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  min-width: 0;
}

.chat-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  max-width: 800px;
  margin: 0 auto;
  width: 100%;
  padding: 0 20px;
  overflow: hidden;
  min-height: 0;
}
</style>
