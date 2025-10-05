<template>
  <div class="chat-history" ref="chatHistory">
    <ChatMessage
      v-for="message in messages"
      :key="message.id"
      :message="message"
    />
    <div v-if="isLoading" class="message bot">
      <div class="message-content typing">Bot is typing...</div>
    </div>
  </div>
</template>

<script>
import { ref, watch, nextTick } from 'vue';
import ChatMessage from './ChatMessage.vue';

export default {
  name: 'ChatHistory',
  components: {
    ChatMessage,
  },
  props: {
    messages: {
      type: Array,
      required: true,
    },
    isLoading: {
      type: Boolean,
      default: false,
    },
  },
  setup(props) {
    const chatHistory = ref(null);

    const scrollToBottom = () => {
      nextTick(() => {
        if (chatHistory.value) {
          chatHistory.value.scrollTop = chatHistory.value.scrollHeight;
        }
      });
    };

    watch(() => props.messages.length, scrollToBottom);
    watch(() => props.isLoading, scrollToBottom);

    return {
      chatHistory,
    };
  },
};
</script>

<style scoped>
.chat-history {
  flex: 1;
  padding: 1rem;
  overflow-y: auto;
  background-color: white;
  margin: 1rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.typing {
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
  100% {
    opacity: 1;
  }
}
</style>
