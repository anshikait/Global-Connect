import React, { useState, useEffect, useRef } from 'react';
import { messageService } from '../../services/socialService.js';
import { useAuth } from '../../context/AuthContext.jsx';
import { useNotifications } from '../../context/NotificationContext.jsx';
import socketService from '../../services/socketService.js';

const MessagesTab = ({ selectedConversation: initialConversation }) => {
  const { user } = useAuth();
  const { markConversationAsRead } = useNotifications();
  const [selectedConversation, setSelectedConversation] = useState(initialConversation || null);
  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef(null);
  
  // Load conversations on component mount
  useEffect(() => {
    loadConversations();
    initializeSocket();
    
    return () => {
      socketService.removeAllListeners();
    };
  }, [user]);

  // Load messages when conversation is selected
  useEffect(() => {
    if (selectedConversation) {
      loadMessages(selectedConversation._id);
      socketService.joinConversation(selectedConversation._id);
      
      return () => {
        socketService.leaveConversation(selectedConversation._id);
      };
    }
  }, [selectedConversation]);

  // Handle initial conversation selection from other tabs
  useEffect(() => {
    if (initialConversation && initialConversation._id !== selectedConversation?._id) {
      setSelectedConversation(initialConversation);
    }
  }, [initialConversation]);

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const initializeSocket = () => {
    if (user) {
      socketService.connect(user.id);
      
      // Listen for new messages
      socketService.onNewMessage((data) => {
        // Only add message if it's not from the current user (to avoid duplication)
        if (data.message.sender._id !== user.id) {
          if (data.conversationId === selectedConversation?._id) {
            setMessages(prev => {
              // Check if message already exists to prevent duplicates
              const messageExists = prev.some(msg => msg._id === data.message._id);
              if (!messageExists) {
                return [...prev, data.message];
              }
              return prev;
            });
          }
        }
        // Update conversation list regardless of sender
        loadConversations();
      });
    }
  };

  const loadConversations = async () => {
    try {
      setLoading(true);
      const response = await messageService.getConversations();
      if (response.success) {
        setConversations(response.data.conversations);
      }
    } catch (error) {
      console.error('Failed to load conversations:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadMessages = async (conversationId) => {
    try {
      const response = await messageService.getMessages(conversationId);
      if (response.success) {
        setMessages(response.data.messages);
        // Mark messages as read and update notification count
        await markConversationAsRead(conversationId);
        // Scroll to bottom after messages load
        setTimeout(() => scrollToBottom(), 100);
      }
    } catch (error) {
      console.error('Failed to load messages:', error);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation || sending) return;

    const messageContent = newMessage.trim();
    const tempId = Date.now().toString(); // Temporary ID for optimistic update

    // Optimistic update - add message immediately to UI
    const optimisticMessage = {
      _id: tempId,
      content: messageContent,
      sender: {
        _id: user.id,
        name: user.name,
        profilePic: user.profilePic
      },
      createdAt: new Date().toISOString(),
      messageType: 'text',
      sending: true // Flag to show sending state
    };

    setMessages(prev => [...prev, optimisticMessage]);
    setNewMessage('');

    try {
      setSending(true);
      const response = await messageService.sendMessage(
        selectedConversation._id, 
        messageContent
      );
      
      if (response.success) {
        // Replace optimistic message with the real one from server
        setMessages(prev => prev.map(msg => 
          msg._id === tempId ? { ...response.data, sending: false } : msg
        ));
      } else {
        // Remove failed message and show error
        setMessages(prev => prev.filter(msg => msg._id !== tempId));
        alert('Failed to send message. Please try again.');
      }
    } catch (error) {
      console.error('Failed to send message:', error);
      // Remove failed message and restore text
      setMessages(prev => prev.filter(msg => msg._id !== tempId));
      setNewMessage(messageContent);
      alert('Failed to send message. Please try again.');
    } finally {
      setSending(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md h-96 flex">
      {/* Conversations List */}
      <div className="w-1/3 border-r border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Messages</h3>
        </div>
        <div className="overflow-y-auto h-full">
          {loading ? (
            <div className="p-4 text-center">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-2 text-sm text-gray-500">Loading conversations...</p>
            </div>
          ) : conversations.length === 0 ? (
            <div className="p-4 text-center">
              <p className="text-gray-500">No conversations yet</p>
              <p className="text-sm text-gray-400 mt-1">Connect with people to start messaging</p>
            </div>
          ) : (
            conversations.map((conversation) => (
              <div
                key={conversation._id}
                onClick={() => setSelectedConversation(conversation)}
                className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 ${
                  selectedConversation?._id === conversation._id ? 'bg-blue-50' : ''
                }`}
              >
                <div className="flex items-start space-x-3">
                  <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium text-gray-600">
                      {conversation.otherParticipant?.name?.split(' ').map(n => n[0]).join('') || 'U'}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {conversation.otherParticipant?.name || 'Unknown User'}
                      </p>
                      {conversation.unread && (
                        <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                      )}
                    </div>
                    <p className="text-xs text-gray-500">
                      {conversation.otherParticipant?.role || 'User'}
                    </p>
                    <p className="text-sm text-gray-600 truncate mt-1">
                      {conversation.lastMessage?.content || 'No messages yet'}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      {conversation.lastActivity ? 
                        new Date(conversation.lastActivity).toLocaleString() : 
                        'No activity'
                      }
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Message Thread */}
      <div className="flex-1 flex flex-col">
        {selectedConversation ? (
          <>
            {/* Header */}
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                  <span className="text-xs font-medium text-gray-600">
                    {selectedConversation.otherParticipant?.name?.split(' ').map(n => n[0]).join('') || 'U'}
                  </span>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-900">
                    {selectedConversation.otherParticipant?.name || 'Unknown User'}
                  </h4>
                  <p className="text-xs text-gray-500">
                    {selectedConversation.otherParticipant?.role || 'User'}
                  </p>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 p-4 overflow-y-auto">
              <div className="space-y-4">
                {messages.length === 0 ? (
                  <div className="text-center text-gray-500 mt-8">
                    <p>No messages yet</p>
                    <p className="text-sm">Start the conversation!</p>
                  </div>
                ) : (
                  messages.map((message) => {
                    const isMyMessage = message.sender._id === user.id;
                    return (
                      <div
                        key={message._id}
                        className={`flex ${isMyMessage ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-sm px-4 py-2 rounded-lg ${
                            isMyMessage
                              ? message.sending 
                                ? 'bg-blue-400 text-white opacity-70' 
                                : 'bg-blue-600 text-white'
                              : 'bg-gray-100 text-gray-900'
                          }`}
                        >
                          <p className="text-sm">{message.content}</p>
                          <div className="flex items-center justify-between mt-1">
                            <p className={`text-xs ${
                              isMyMessage ? 'text-blue-100' : 'text-gray-500'
                            }`}>
                              {new Date(message.createdAt).toLocaleTimeString()}
                            </p>
                            {message.sending && (
                              <div className="ml-2">
                                <div className="animate-spin rounded-full h-3 w-3 border border-white border-t-transparent"></div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
                <div ref={messagesEndRef} />
              </div>
            </div>

            {/* Message Input */}
            <div className="p-4 border-t border-gray-200">
              <div className="flex space-x-2">
                <input
                  type="text"
                  placeholder="Type a message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button 
                  onClick={sendMessage}
                  disabled={!newMessage.trim() || sending}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 disabled:opacity-50"
                >
                  {sending ? 'Sending...' : 'Send'}
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <p className="mt-2 text-sm text-gray-500">Select a conversation to start messaging</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MessagesTab;