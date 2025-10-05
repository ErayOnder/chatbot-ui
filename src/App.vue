<template>
  <div id="app">
    <ChatHeader :isConnected="isConnected" />

    <div class="chat-container">
      <ChatHistory :messages="messages" :isLoading="isLoading" />
      <ChatInput
        :isConnected="isConnected"
        :isLoading="isLoading"
        @send-message="sendMessage"
      />
    </div>
  </div>
</template>

<script>
import { onMounted } from 'vue';
import ChatHeader from './components/ChatHeader.vue';
import ChatHistory from './components/ChatHistory.vue';
import ChatInput from './components/ChatInput.vue';
import { useWebSocket } from './composables/useWebSocket.js';
import { useChat } from './composables/useChat.js';

export default {
  name: 'App',
  components: {
    ChatHeader,
    ChatHistory,
    ChatInput,
  },
  setup() {
    const WS_URL = 'ws://localhost:8080/ws';

    const { isConnected, connect, send } = useWebSocket(WS_URL);
    const { messages, isLoading, addMessage, setLoading } = useChat();

    const handleMessage = (event) => {
      setLoading(false);
      try {
        const data = JSON.parse(event.data);
        addMessage(data.response || event.data, 'bot');
      } catch (error) {
        addMessage(event.data, 'bot');
      }
    };

    const sendMessage = (message) => {
      addMessage(message, 'user');
      const success = send(message);
      if (success) {
        setLoading(true);
      }
    };

    onMounted(() => {
      connect((event) => {
        addMessage('Connected to chatbot', 'system');
        handleMessage(event);
      });
    });

    return {
      isConnected,
      messages,
      isLoading,
      sendMessage,
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
  display: flex;
  flex-direction: column;
  background-color: #f5f5f5;
}

.chat-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  max-width: 800px;
  margin: 0 auto;
  width: 100%;
  height: calc(100vh - 80px);
}
</style>
