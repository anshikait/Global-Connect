import React, { useState } from 'react';

const MessagesTab = () => {
  const [selectedConversation, setSelectedConversation] = useState(null);
  
  // Mock data for conversations
  const conversations = [
    {
      id: 1,
      name: 'John Smith',
      company: 'TechCorp',
      role: 'Senior Recruiter',
      lastMessage: 'Thanks for your application. We would like to schedule an interview.',
      timestamp: '2 hours ago',
      unread: true,
      avatar: '/api/placeholder/40/40'
    },
    {
      id: 2,
      name: 'Sarah Johnson',
      company: 'StartupCo',
      role: 'HR Manager',
      lastMessage: 'Your profile looks interesting. Let\'s connect!',
      timestamp: '1 day ago',
      unread: false,
      avatar: '/api/placeholder/40/40'
    },
    {
      id: 3,
      name: 'Mike Wilson',
      company: 'InnovateLab',
      role: 'Engineering Lead',
      lastMessage: 'We have reviewed your application and would like to proceed to the next round.',
      timestamp: '3 days ago',
      unread: false,
      avatar: '/api/placeholder/40/40'
    }
  ];

  const messages = selectedConversation ? [
    {
      id: 1,
      sender: 'them',
      message: 'Hi there! I noticed your profile and I think you might be a great fit for our team.',
      timestamp: '10:30 AM'
    },
    {
      id: 2,
      sender: 'me',
      message: 'Thank you for reaching out! I\'d love to learn more about the opportunity.',
      timestamp: '10:35 AM'
    },
    {
      id: 3,
      sender: 'them',
      message: 'Great! Would you be available for a call this week to discuss further?',
      timestamp: '10:40 AM'
    }
  ] : [];

  return (
    <div className="bg-white rounded-lg shadow-md h-96 flex">
      {/* Conversations List */}
      <div className="w-1/3 border-r border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Messages</h3>
        </div>
        <div className="overflow-y-auto h-full">
          {conversations.map((conversation) => (
            <div
              key={conversation.id}
              onClick={() => setSelectedConversation(conversation)}
              className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 ${
                selectedConversation?.id === conversation.id ? 'bg-blue-50' : ''
              }`}
            >
              <div className="flex items-start space-x-3">
                <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium text-gray-600">
                    {conversation.name.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {conversation.name}
                    </p>
                    {conversation.unread && (
                      <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                    )}
                  </div>
                  <p className="text-xs text-gray-500">{conversation.company} • {conversation.role}</p>
                  <p className="text-sm text-gray-600 truncate mt-1">
                    {conversation.lastMessage}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">{conversation.timestamp}</p>
                </div>
              </div>
            </div>
          ))}
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
                    {selectedConversation.name.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-900">{selectedConversation.name}</h4>
                  <p className="text-xs text-gray-500">{selectedConversation.company}</p>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 p-4 overflow-y-auto">
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.sender === 'me' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-sm px-4 py-2 rounded-lg ${
                        message.sender === 'me'
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-900'
                      }`}
                    >
                      <p className="text-sm">{message.message}</p>
                      <p className={`text-xs mt-1 ${
                        message.sender === 'me' ? 'text-blue-100' : 'text-gray-500'
                      }`}>
                        {message.timestamp}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Message Input */}
            <div className="p-4 border-t border-gray-200">
              <div className="flex space-x-2">
                <input
                  type="text"
                  placeholder="Type a message..."
                  className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700">
                  Send
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