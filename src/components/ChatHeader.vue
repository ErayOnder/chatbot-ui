<template>
  <div class="chat-header">
    <h1>{{ conversationTitle || 'Chatbot UI' }}</h1>
    <div class="status" :class="{ connected: isConnected }">
      Status: {{ isConnected ? 'Connected' : 'Disconnected' }}
    </div>
  </div>
</template>

<script>
export default {
  name: 'ChatHeader',
  props: {
    isConnected: {
      type: Boolean,
      required: true,
    },
    conversationTitle: {
      type: String,
      default: null,
    },
  },
};
</script>

<style scoped>
.chat-header {
  background-color: #2c3e50;
  color: white;
  padding: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.chat-header h1 {
  font-size: 1.5rem;
  font-weight: 500;
}

.status {
  font-size: 0.9rem;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  background-color: rgba(255, 255, 255, 0.1);
  transition: background-color 0.3s;
}

.status.connected {
  background-color: rgba(76, 175, 80, 0.3);
}
</style>
