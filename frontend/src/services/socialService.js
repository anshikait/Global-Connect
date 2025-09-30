import API from './api.js';

// Post services
export const postService = {
  // Create a new post
  createPost: async (postData) => {
    const response = await API.post('/posts', postData);
    return response.data;
  },

  // Get feed posts
  getFeedPosts: async (page = 1, limit = 10) => {
    const response = await API.get(`/posts/feed?page=${page}&limit=${limit}`);
    return response.data;
  },

  // Get post by ID
  getPostById: async (postId) => {
    const response = await API.get(`/posts/${postId}`);
    return response.data;
  },

  // Get user posts
  getUserPosts: async (userId, page = 1, limit = 10) => {
    const response = await API.get(`/posts/user/${userId}?page=${page}&limit=${limit}`);
    return response.data;
  },

  // Like/unlike post
  toggleLikePost: async (postId) => {
    const response = await API.post(`/posts/${postId}/like`);
    return response.data;
  },

  // Add comment to post
  addComment: async (postId, content) => {
    const response = await API.post(`/posts/${postId}/comment`, { content });
    return response.data;
  },

  // Share post
  sharePost: async (postId) => {
    const response = await API.post(`/posts/${postId}/share`);
    return response.data;
  },

  // Delete post
  deletePost: async (postId) => {
    const response = await API.delete(`/posts/${postId}`);
    return response.data;
  }
};

// Connection services
export const connectionService = {
  // Send connection request
  sendConnectionRequest: async (recipientId, message = '') => {
    const response = await API.post(`/connections/request/${recipientId}`, { message });
    return response.data;
  },

  // Respond to connection request
  respondToConnectionRequest: async (connectionId, action) => {
    const response = await API.patch(`/connections/request/${connectionId}/respond`, { action });
    return response.data;
  },

  // Get connection requests
  getConnectionRequests: async (page = 1, limit = 10) => {
    const response = await API.get(`/connections/requests?page=${page}&limit=${limit}`);
    return response.data;
  },

  // Get user connections
  getUserConnections: async (page = 1, limit = 10, search = '') => {
    const response = await API.get(`/connections/my-connections?page=${page}&limit=${limit}&search=${search}`);
    return response.data;
  },

  // Get connection suggestions
  getConnectionSuggestions: async (page = 1, limit = 10) => {
    const response = await API.get(`/connections/suggestions?page=${page}&limit=${limit}`);
    return response.data;
  },

  // Get network statistics
  getNetworkStats: async () => {
    const response = await API.get('/connections/stats');
    return response.data;
  },

  // Remove connection
  removeConnection: async (connectionId) => {
    const response = await API.delete(`/connections/${connectionId}`);
    return response.data;
  }
};

// Message services
export const messageService = {
  // Get conversations
  getConversations: async (page = 1, limit = 20) => {
    const response = await API.get(`/messages/conversations?page=${page}&limit=${limit}`);
    return response.data;
  },

  // Get or create conversation
  getOrCreateConversation: async (participantId) => {
    const response = await API.get(`/messages/conversations/${participantId}`);
    return response.data;
  },

  // Get messages for conversation
  getMessages: async (conversationId, page = 1, limit = 50) => {
    const response = await API.get(`/messages/${conversationId}/messages?page=${page}&limit=${limit}`);
    return response.data;
  },

  // Send message
  sendMessage: async (conversationId, content, messageType = 'text', replyTo = null) => {
    const response = await API.post(`/messages/${conversationId}/messages`, {
      content,
      messageType,
      replyTo
    });
    return response.data;
  },

  // Edit message
  editMessage: async (messageId, content) => {
    const response = await API.put(`/messages/messages/${messageId}`, { content });
    return response.data;
  },

  // Delete message
  deleteMessage: async (messageId) => {
    const response = await API.delete(`/messages/messages/${messageId}`);
    return response.data;
  },

  // Mark messages as read
  markMessagesAsRead: async (conversationId) => {
    const response = await API.patch(`/messages/${conversationId}/read`);
    return response.data;
  },

  // Get unread message count
  getUnreadCount: async () => {
    const response = await API.get('/messages/unread-count');
    return response.data;
  }
};



// User services
export const userService = {
  // Get user profile by ID
  getUserById: async (userId) => {
    const response = await API.get(`/users/profile/${userId}`);
    return response.data;
  },

  // Get user dashboard statistics
  getDashboardStats: async () => {
    const response = await API.get('/users/dashboard-stats');
    return response.data;
  }
};

// Job services
export const jobService = {
  // Get user's job applications
  getUserApplications: async (page = 1, limit = 10, status = '') => {
    const response = await API.get(`/users/applications?page=${page}&limit=${limit}&status=${status}`);
    return response.data;
  },

  // Get saved jobs
  getSavedJobs: async (page = 1, limit = 10) => {
    const response = await API.get(`/users/saved-jobs?page=${page}&limit=${limit}`);
    return response.data;
  },

  // Apply to a job
  applyToJob: async (jobId, applicationData) => {
    const response = await API.post(`/jobs/${jobId}/apply`, applicationData);
    return response.data;
  },

  // Save/unsave a job
  toggleSaveJob: async (jobId) => {
    const response = await API.post(`/jobs/${jobId}/save`);
    return response.data;
  },

  // Get application statistics
  getApplicationStats: async () => {
    const response = await API.get('/users/application-stats');
    return response.data;
  }
};