<template>
  <div class="sidebar">
    <div class="sidebar-header">
      <button class="new-chat-btn" @click="$emit('new-chat')">
        <span class="plus-icon">+</span>
        New Chat
      </button>
    </div>

    <div class="conversations-list">
      <div v-if="isLoading" class="loading">Loading...</div>
      <div v-else-if="conversations.length === 0" class="empty-state">
        No conversations yet.<br />Click "New Chat" to start!
      </div>
      <ConversationItem
        v-else
        v-for="conversation in conversations"
        :key="conversation.id"
        :conversation="conversation"
        :isActive="currentConversationId === conversation.id"
        @select="$emit('select-conversation', conversation.id)"
        @delete="$emit('delete-conversation', conversation.id)"
      />
    </div>
  </div>
</template>

<script>
import ConversationItem from './ConversationItem.vue';

export default {
  name: 'ConversationSidebar',
  components: {
    ConversationItem,
  },
  props: {
    conversations: {
      type: Array,
      default: () => [],
    },
    currentConversationId: {
      type: String,
      default: null,
    },
    isLoading: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['new-chat', 'select-conversation', 'delete-conversation'],
};
</script>

<style scoped>
.sidebar {
  width: 280px;
  background-color: #1e1e1e;
  display: flex;
  flex-direction: column;
  border-right: 1px solid rgba(255, 255, 255, 0.1);
  height: 100vh;
}

.sidebar-header {
  padding: 16px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.new-chat-btn {
  width: 100%;
  padding: 12px 16px;
  background-color: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  color: #fff;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.2s;
}

.new-chat-btn:hover {
  background-color: rgba(255, 255, 255, 0.15);
  border-color: rgba(255, 255, 255, 0.3);
}

.plus-icon {
  font-size: 20px;
  line-height: 1;
}

.conversations-list {
  flex: 1;
  overflow-y: auto;
  padding: 8px;
}

.loading,
.empty-state {
  padding: 24px 16px;
  text-align: center;
  color: rgba(255, 255, 255, 0.6);
  font-size: 14px;
  line-height: 1.5;
}

/* Scrollbar styling */
.conversations-list::-webkit-scrollbar {
  width: 6px;
}

.conversations-list::-webkit-scrollbar-track {
  background: transparent;
}

.conversations-list::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 3px;
}

.conversations-list::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.3);
}
</style>