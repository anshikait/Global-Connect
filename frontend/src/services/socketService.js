import { io } from 'socket.io-client';

class SocketService {
  constructor() {
    this.socket = null;
    this.connected = false;
  }

  connect(userId) {
    if (this.socket && this.connected) {
      return;
    }

    const serverUrl = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000';
    
    this.socket = io(serverUrl, {
      autoConnect: true,
      transports: ['websocket', 'polling']
    });

    this.socket.on('connect', () => {
      console.log('Connected to server with socket ID:', this.socket.id);
      this.connected = true;
      
      // Join user's personal room
      if (userId) {
        this.socket.emit('join_user_room', userId);
      }
    });

    this.socket.on('disconnect', () => {
      console.log('Disconnected from server');
      this.connected = false;
    });

    this.socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
      this.connected = false;
    });

    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.connected = false;
    }
  }

  // Join a conversation room
  joinConversation(conversationId) {
    if (this.socket && this.connected) {
      this.socket.emit('join_conversation', conversationId);
    }
  }

  // Leave a conversation room
  leaveConversation(conversationId) {
    if (this.socket && this.connected) {
      this.socket.emit('leave_conversation', conversationId);
    }
  }

  // Send typing indicator
  sendTypingIndicator(conversationId, userId, isTyping) {
    if (this.socket && this.connected) {
      this.socket.emit('typing', {
        conversationId,
        userId,
        isTyping
      });
    }
  }

  // Listen for new messages
  onNewMessage(callback) {
    if (this.socket) {
      this.socket.on('new_message', callback);
    }
  }

  // Listen for message edits
  onMessageEdited(callback) {
    if (this.socket) {
      this.socket.on('message_edited', callback);
    }
  }

  // Listen for message deletions
  onMessageDeleted(callback) {
    if (this.socket) {
      this.socket.on('message_deleted', callback);
    }
  }

  // Listen for messages being read
  onMessageRead(callback) {
    if (this.socket) {
      this.socket.on('messageRead', callback);
    }
  }

  // Listen for typing indicators
  onUserTyping(callback) {
    if (this.socket) {
      this.socket.on('user_typing', callback);
    }
  }

  // Remove all listeners for a specific event
  off(event, callback) {
    if (this.socket) {
      this.socket.off(event, callback);
    }
  }

  // Remove all listeners
  removeAllListeners() {
    if (this.socket) {
      this.socket.removeAllListeners();
    }
  }

  // Get connection status
  isConnected() {
    return this.connected && this.socket && this.socket.connected;
  }
}

// Create a singleton instance
const socketService = new SocketService();

export default socketService;