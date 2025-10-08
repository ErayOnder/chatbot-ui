<template>
  <div
    class="conversation-item"
    :class="{ active: isActive }"
    @click="$emit('select')"
  >
    <div class="conversation-content">
      <div class="conversation-title">{{ conversation.title }}</div>
      <div class="conversation-date">{{ formattedDate }}</div>
    </div>
    <button
      class="delete-btn"
      @click.stop="$emit('delete')"
      title="Delete conversation"
    >
      ×
    </button>
  </div>
</template>

<script>
import { computed } from 'vue';

export default {
  name: 'ConversationItem',
  props: {
    conversation: {
      type: Object,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['select', 'delete'],
  setup(props) {
    const formattedDate = computed(() => {
      const date = new Date(props.conversation.createdAt);
      const now = new Date();
      const diff = now - date;
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));

      if (days === 0) {
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      } else if (days === 1) {
        return 'Yesterday';
      } else if (days < 7) {
        return `${days} days ago`;
      } else {
        return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
      }
    });

    return {
      formattedDate,
    };
  },
};
</script>

<style scoped>
.conversation-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  margin-bottom: 4px;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.2s;
  background-color: transparent;
}

.conversation-item:hover {
  background-color: rgba(255, 255, 255, 0.05);
}

.conversation-item.active {
  background-color: rgba(255, 255, 255, 0.1);
}

.conversation-content {
  flex: 1;
  overflow: hidden;
}

.conversation-title {
  font-size: 14px;
  font-weight: 500;
  color: #fff;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-bottom: 4px;
}

.conversation-date {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.6);
}

.delete-btn {
  width: 24px;
  height: 24px;
  border: none;
  background-color: transparent;
  color: rgba(255, 255, 255, 0.6);
  font-size: 24px;
  cursor: pointer;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
  transition: all 0.2s;
  opacity: 0;
  padding: 0;
}

.conversation-item:hover .delete-btn {
  opacity: 1;
}

.delete-btn:hover {
  background-color: rgba(255, 255, 255, 0.1);
  color: #ff4444;
}
</style>