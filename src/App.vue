<template>
  <div id="app">
    <h1>Chatbot UI</h1>
    <button @click="sendMessage" :disabled="!isConnected">
      {{ isConnected ? 'Send Message' : 'Connecting...' }}
    </button>
    <div class="response-container">
      <h3>Response:</h3>
      <div class="response-box">{{ response }}</div>
    </div>
    <div class="status">
      Status: {{ isConnected ? 'Connected' : 'Disconnected' }}
    </div>
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted } from 'vue'

export default {
  name: 'App',
  setup() {
    const isConnected = ref(false)
    const response = ref('No response yet...')
    let websocket = null

    const connectWebSocket = () => {
      websocket = new WebSocket('ws://localhost:8080/ws')

      websocket.onopen = () => {
        console.log('Connected to WebSocket')
        isConnected.value = true
      }

      websocket.onmessage = (event) => {
        console.log('Received message:', event.data)
        const data = JSON.parse(event.data)
        response.value = data.response || event.data
      }

      websocket.onclose = () => {
        console.log('WebSocket connection closed')
        isConnected.value = false
      }

      websocket.onerror = (error) => {
        console.error('WebSocket error:', error)
        isConnected.value = false
      }
    }

    const sendMessage = () => {
      if (websocket && isConnected.value) {
        const message = 'Hello from Vue.js client!'
        console.log('Sending message:', message)
        websocket.send(message)
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
      response,
      sendMessage
    }
  }
}
</script>

<style>
#app {
  font-family: Arial, sans-serif;
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
}

button {
  background-color: #4CAF50;
  border: none;
  color: white;
  padding: 15px 32px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  margin: 4px 2px;
  cursor: pointer;
  border-radius: 4px;
}

button:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

.response-container {
  margin-top: 20px;
}

.response-box {
  border: 1px solid #ddd;
  padding: 15px;
  background-color: #f9f9f9;
  border-radius: 4px;
  min-height: 50px;
  margin-top: 10px;
}

.status {
  margin-top: 20px;
  padding: 10px;
  background-color: #e7f3ff;
  border-radius: 4px;
}
</style>