import { ref, onMounted, onUnmounted } from 'vue';
import { WebSocketService } from '../services/websocket.service';

export function useWebSocket(url) {
  const isConnected = ref(false);
  const wsService = new WebSocketService(url);

  const connect = (onMessage) => {
    wsService.connect(
      () => {
        isConnected.value = true;
      },
      onMessage,
      () => {
        isConnected.value = false;
      },
      (error) => {
        console.error('WebSocket error:', error);
        isConnected.value = false;
      }
    );
  };

  const send = (message) => {
    return wsService.send(message);
  };

  const close = () => {
    wsService.close();
  };

  onUnmounted(() => {
    close();
  });

  return {
    isConnected,
    connect,
    send,
    close,
  };
}
