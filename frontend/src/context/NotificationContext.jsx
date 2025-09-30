import React, { createContext, useContext, useState, useEffect } from 'react';
import { messageService } from '../services/socialService.js';
import { useAuth } from './AuthContext.jsx';
import socketService from '../services/socketService.js';

const NotificationContext = createContext();

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

export const NotificationProvider = ({ children }) => {
  const { user } = useAuth();
  const [unreadMessageCount, setUnreadMessageCount] = useState(0);
  const [loading, setLoading] = useState(false);

  // Load unread count when user is authenticated
  useEffect(() => {
    if (user) {
      loadUnreadCount();
      initializeSocketListeners();
    } else {
      setUnreadMessageCount(0);
    }

    return () => {
      if (user) {
        socketService.off('new_message', handleNewMessage);
        socketService.off('messageRead', handleMessageRead);
      }
    };
  }, [user]);

  const loadUnreadCount = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const response = await messageService.getUnreadCount();
      if (response.success) {
        setUnreadMessageCount(response.data.unreadCount);
      }
    } catch (error) {
      console.error('Failed to load unread count:', error);
    } finally {
      setLoading(false);
    }
  };

  const initializeSocketListeners = () => {
    if (!user) return;

    // Listen for new messages to increment count
    socketService.onNewMessage(handleNewMessage);
    
    // Listen for messages being read to decrement count
    socketService.onMessageRead(handleMessageRead);
  };

  const handleNewMessage = (data) => {
    // Only increment if message is not from current user
    if (data.message.sender._id !== user.id) {
      setUnreadMessageCount(prev => prev + 1);
    }
  };

  const handleMessageRead = (data) => {
    // Refresh unread count when messages are marked as read
    loadUnreadCount();
  };

  const markConversationAsRead = async (conversationId) => {
    try {
      await messageService.markMessagesAsRead(conversationId);
      // Refresh unread count after marking as read
      await loadUnreadCount();
    } catch (error) {
      console.error('Failed to mark conversation as read:', error);
    }
  };

  const resetUnreadCount = () => {
    setUnreadMessageCount(0);
  };

  const value = {
    unreadMessageCount,
    loading,
    loadUnreadCount,
    markConversationAsRead,
    resetUnreadCount
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

export default NotificationContext;