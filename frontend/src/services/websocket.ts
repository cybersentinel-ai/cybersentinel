export class WebSocketManager {
  private socket: WebSocket | null = null;
  private url: string;
  private onMessage: (data: any) => void;
  private onConnect: () => void;
  private onDisconnect: () => void;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;

  constructor(
    url: string,
    onMessage: (data: any) => void,
    onConnect: () => void,
    onDisconnect: () => void
  ) {
    this.url = url;
    this.onMessage = onMessage;
    this.onConnect = onConnect;
    this.onDisconnect = onDisconnect;
  }

  connect() {
    try {
      this.socket = new WebSocket(this.url);

      this.socket.onopen = () => {
        console.log('WebSocket Connected');
        this.reconnectAttempts = 0;
        this.onConnect();
      };

      this.socket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        this.onMessage(data);
      };

      this.socket.onclose = () => {
        console.log('WebSocket Disconnected');
        this.onDisconnect();
        this.attemptReconnect();
      };

      this.socket.onerror = (error) => {
        console.error('WebSocket Error:', error);
      };
    } catch (error) {
      console.error('WebSocket Connection Error:', error);
      this.attemptReconnect();
    }
  }

  private attemptReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      console.log(`Attempting reconnect ${this.reconnectAttempts}...`);
      setTimeout(() => this.connect(), 2000 * this.reconnectAttempts);
    }
  }

  disconnect() {
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
  }

  send(data: any) {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify(data));
    }
  }
}
