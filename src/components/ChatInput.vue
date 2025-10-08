<template>
  <div class="chat-input-container">
    <div v-if="!hasActiveConversation" class="no-conversation-message">
      Please create or select a conversation to start chatting
    </div>
    <div v-else class="input-wrapper">
      <input
        v-model="inputText"
        @keyup.enter="handleSend"
        :disabled="!isConnected || isLoading"
        placeholder="Type your message here..."
        class="chat-input"
        ref="messageInput"
      />
      <button
        @click="handleSend"
        :disabled="!isConnected || !inputText.trim() || isLoading"
        class="send-button"
      >
        Send
      </button>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';

export default {
  name: 'ChatInput',
  props: {
    isConnected: {
      type: Boolean,
      required: true,
    },
    isLoading: {
      type: Boolean,
      default: false,
    },
    hasActiveConversation: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['send-message'],
  setup(props, { emit }) {
    const inputText = ref('');
    const messageInput = ref(null);

    const handleSend = () => {
      if (props.isConnected && inputText.value.trim() && !props.isLoading && props.hasActiveConversation) {
        emit('send-message', inputText.value.trim());
        inputText.value = '';
      }
    };

    return {
      inputText,
      messageInput,
      handleSend,
    };
  },
};
</script>

<style scoped>
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

.no-conversation-message {
  text-align: center;
  color: #6c757d;
  padding: 1rem;
  font-size: 0.95rem;
}
</style>
