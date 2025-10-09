export class WebSocketService {
  constructor(url) {
    this.url = url;
    this.ws = null;
    this.reconnectInterval = 3000;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
  }

  connect(onOpen, onMessage, onClose, onError) {
    this.ws = new WebSocket(this.url);

    this.ws.onopen = (event) => {
      console.log('Connected to WebSocket');
      this.reconnectAttempts = 0;
      if (onOpen) onOpen(event);
    };

    this.ws.onmessage = (event) => {
      console.log('Received message:', event.data);
      if (onMessage) onMessage(event);
    };

    this.ws.onclose = (event) => {
      console.log('WebSocket connection closed');
      if (onClose) onClose(event);
      this.attemptReconnect(onOpen, onMessage, onClose, onError);
    };

    this.ws.onerror = (event) => {
      console.error('WebSocket error:', event);
      if (onError) onError(event);
    };
  }

  attemptReconnect(onOpen, onMessage, onClose, onError) {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      console.log(`Attempting to reconnect... (${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
      setTimeout(() => {
        this.connect(onOpen, onMessage, onClose, onError);
      }, this.reconnectInterval);
    } else {
      console.error('Max reconnection attempts reached');
    }
  }

  send(conversationId, content) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      const message = JSON.stringify({
        conversationId: conversationId,
        userMessage: content,
      });
      this.ws.send(message);
      return true;
    }
    console.error('WebSocket is not connected');
    return false;
  }

  close() {
    if (this.ws) {
      this.ws.close();
    }
  }

  isConnected() {
    return this.ws && this.ws.readyState === WebSocket.OPEN;
  }
}
