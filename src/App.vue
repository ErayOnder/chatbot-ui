<template>
  <div id="app">
    <div class="chat-header">
      <h1>Chatbot UI</h1>
      <div class="status">
        Status: {{ isConnected ? 'Connected' : 'Disconnected' }}
      </div>
    </div>

    <div class="chat-container">
      <div class="chat-history" ref="chatHistory">
        <div
          v-for="message in messages"
          :key="message.id"
          :class="['message', message.type]"
        >
          <div class="message-content">{{ message.content }}</div>
          <div class="message-time">{{ message.timestamp }}</div>
        </div>
        <div v-if="isLoading" class="message bot">
          <div class="message-content typing">Bot is typing...</div>
        </div>
      </div>

      <div class="chat-input-container">
        <div class="input-wrapper">
          <input
            v-model="inputMessage"
            @keyup.enter="sendMessage"
            :disabled="!isConnected || isLoading"
            placeholder="Type your message here..."
            class="chat-input"
            ref="messageInput"
          />
          <button
            @click="sendMessage"
            :disabled="!isConnected || !inputMessage.trim() || isLoading"
            class="send-button"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted, nextTick } from 'vue'

export default {
  name: 'App',
  setup() {
    const isConnected = ref(false)
    const inputMessage = ref('')
    const messages = ref([])
    const isLoading = ref(false)
    const chatHistory = ref(null)
    const messageInput = ref(null)
    let websocket = null
    let messageId = 0

    const addMessage = (content, type) => {
      const message = {
        id: ++messageId,
        content,
        type,
        timestamp: new Date().toLocaleTimeString()
      }
      messages.value.push(message)
      scrollToBottom()
    }

    const scrollToBottom = () => {
      nextTick(() => {
        if (chatHistory.value) {
          chatHistory.value.scrollTop = chatHistory.value.scrollHeight
        }
      })
    }

    const connectWebSocket = () => {
      websocket = new WebSocket('ws://localhost:8080/ws')

      websocket.onopen = () => {
        console.log('Connected to WebSocket')
        isConnected.value = true
        addMessage('Connected to chatbot', 'system')
      }

      websocket.onmessage = (event) => {
        console.log('Received message:', event.data)
        isLoading.value = false
        try {
          const data = JSON.parse(event.data)
          addMessage(data.response || event.data, 'bot')
        } catch (error) {
          addMessage(event.data, 'bot')
        }
      }

      websocket.onclose = () => {
        console.log('WebSocket connection closed')
        isConnected.value = false
        isLoading.value = false
        addMessage('Disconnected from chatbot', 'system')
      }

      websocket.onerror = (error) => {
        console.error('WebSocket error:', error)
        isConnected.value = false
        isLoading.value = false
        addMessage('Connection error occurred', 'system')
      }
    }

    const sendMessage = () => {
      if (websocket && isConnected.value && inputMessage.value.trim() && !isLoading.value) {
        const message = inputMessage.value.trim()
        addMessage(message, 'user')
        console.log('Sending message:', message)
        websocket.send(message)
        inputMessage.value = ''
        isLoading.value = true
      }
    }

    onMounted(() => {
      connectWebSocket()
    })

    onUnmounted(() => {
      if (websocket) {
        websocket.close()
      }
    })

    return {
      isConnected,
      inputMessage,
      messages,
      isLoading,
      chatHistory,
      messageInput,
      sendMessage
    }
  }
}
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

.chat-header {
  background-color: #2c3e50;
  color: white;
  padding: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.chat-header h1 {
  font-size: 1.5rem;
  font-weight: 500;
}

.status {
  font-size: 0.9rem;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  background-color: rgba(255,255,255,0.1);
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

.chat-history {
  flex: 1;
  padding: 1rem;
  overflow-y: auto;
  background-color: white;
  margin: 1rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.message {
  margin-bottom: 1rem;
  display: flex;
  flex-direction: column;
}

.message.user {
  align-items: flex-end;
}

.message.bot {
  align-items: flex-start;
}

.message.system {
  align-items: center;
}

.message-content {
  max-width: 70%;
  padding: 0.75rem 1rem;
  border-radius: 18px;
  word-wrap: break-word;
}

.message.user .message-content {
  background-color: #007bff;
  color: white;
  border-bottom-right-radius: 4px;
}

.message.bot .message-content {
  background-color: #e9ecef;
  color: #333;
  border-bottom-left-radius: 4px;
}

.message.system .message-content {
  background-color: #fff3cd;
  color: #856404;
  font-size: 0.85rem;
  font-style: italic;
}

.typing {
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% { opacity: 1; }
  50% { opacity: 0.5; }
  100% { opacity: 1; }
}

.message-time {
  font-size: 0.75rem;
  color: #6c757d;
  margin-top: 0.25rem;
  padding: 0 1rem;
}

.chat-input-container {
  padding: 1rem;
  background-color: white;
  border-top: 1px solid #dee2e6;
}

.input-wrapper {
  display: flex;
  max-width: 800px;
  margin: 0 auto;
  gap: 0.75rem;
}

.chat-input {
  flex: 1;
  padding: 0.75rem 1rem;
  border: 2px solid #dee2e6;
  border-radius: 25px;
  font-size: 1rem;
  outline: none;
  transition: border-color 0.2s;
}

.chat-input:focus {
  border-color: #007bff;
}

.chat-input:disabled {
  background-color: #f8f9fa;
  cursor: not-allowed;
}

.send-button {
  background-color: #007bff;
  border: none;
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 25px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.2s;
}

.send-button:hover:not(:disabled) {
  background-color: #0056b3;
}

.send-button:disabled {
  background-color: #6c757d;
  cursor: not-allowed;
}
</style>