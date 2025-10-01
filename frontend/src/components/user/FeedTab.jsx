import React, { useState, useEffect, useRef } from 'react';
import { postService } from '../../services/socialService.js';
import { useAuth } from '../../context/AuthContext.jsx';

const FeedTab = () => {
  const { user } = useAuth();
  const [postContent, setPostContent] = useState('');
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [posting, setPosting] = useState(false);
  const [likedPosts, setLikedPosts] = useState(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [commentStates, setCommentStates] = useState({});
  const fileInputRef = useRef(null);

  // Load feed posts
  useEffect(() => {
    loadFeedPosts();
  }, []);

  const loadFeedPosts = async () => {
    try {
      setLoading(true);
      const response = await postService.getFeedPosts(currentPage, 10);
      if (response.success) {
        if (currentPage === 1) {
          setPosts(response.data.posts);
        } else {
          setPosts(prev => [...prev, ...response.data.posts]);
        }
        setHasMore(response.data.pagination.hasMore);
        
        // Set initial liked posts
        const liked = new Set();
        response.data.posts.forEach(post => {
          if (post.isLikedByUser) {
            liked.add(post._id);
          }
        });
        setLikedPosts(liked);
      }
    } catch (error) {
      console.error('Failed to load feed posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePostSubmit = async () => {
    if ((postContent.trim() || selectedFiles.length > 0) && !posting) {
      try {
        setPosting(true);
        
        // Create FormData for file uploads
        const formData = new FormData();
        formData.append('content', postContent.trim());
        formData.append('visibility', 'public');
        
        // Add files to FormData
        selectedFiles.forEach((file, index) => {
          if (file.type.startsWith('image/')) {
            formData.append('images', file);
          } else if (file.type.startsWith('video/')) {
            formData.append('videos', file);
          }
        });
        
        const response = await postService.createPost(formData);
        if (response.success) {
          setPosts(prev => [response.data, ...prev]);
          setPostContent('');
          setSelectedFiles([]);
        }
      } catch (error) {
        console.error('Failed to create post:', error);
        alert('Failed to create post. Please try again.');
      } finally {
        setPosting(false);
      }
    }
  };

  const toggleLike = async (postId) => {
    try {
      const response = await postService.toggleLikePost(postId);
      if (response.success) {
        const newLikedPosts = new Set(likedPosts);
        if (response.data.action === 'liked') {
          newLikedPosts.add(postId);
        } else {
          newLikedPosts.delete(postId);
        }
        setLikedPosts(newLikedPosts);
        
        // Update post in list
        setPosts(prev => prev.map(post => 
          post._id === postId 
            ? { ...post, likeCount: response.data.likeCount, isLikedByUser: response.data.isLiked }
            : post
        ));
      }
    } catch (error) {
      console.error('Failed to toggle like:', error);
    }
  };

  const handleComment = async (postId, content) => {
    if (!content.trim()) return;
    
    try {
      const response = await postService.addComment(postId, content);
      if (response.success) {
        setPosts(prev => prev.map(post => 
          post._id === postId 
            ? { ...post, commentCount: response.data.commentCount, comments: [...(post.comments || []), response.data.comment] }
            : post
        ));
        
        // Clear comment state for this post
        setCommentStates(prev => ({
          ...prev,
          [postId]: { ...prev[postId], text: '', showBox: false }
        }));
      }
    } catch (error) {
      console.error('Failed to add comment:', error);
      alert('Failed to add comment. Please try again.');
    }
  };

  // Handle file selection
  const handleFileSelect = (event) => {
    const files = Array.from(event.target.files);
    const validFiles = files.filter(file => {
      const maxSize = 10 * 1024 * 1024; // 10MB
      const allowedTypes = [
        'image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp',
        'video/mp4', 'video/webm', 'video/ogg'
      ];
      
      if (file.size > maxSize) {
        alert(`File ${file.name} is too large. Maximum size is 10MB.`);
        return false;
      }
      
      if (!allowedTypes.includes(file.type)) {
        alert(`File type ${file.type} is not supported.`);
        return false;
      }
      
      return true;
    });
    
    setSelectedFiles(prev => [...prev, ...validFiles]);
  };

  // Remove selected file
  const removeFile = (index) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  // Toggle comment box
  const toggleCommentBox = (postId) => {
    setCommentStates(prev => ({
      ...prev,
      [postId]: {
        ...prev[postId],
        showBox: !prev[postId]?.showBox,
        text: prev[postId]?.text || ''
      }
    }));
  };

  // Update comment text
  const updateCommentText = (postId, text) => {
    setCommentStates(prev => ({
      ...prev,
      [postId]: { ...prev[postId], text }
    }));
  };

  const loadMorePosts = async () => {
    if (hasMore && !loading) {
      setCurrentPage(prev => prev + 1);
      await loadFeedPosts();
    }
  };

  // Mock posts data for fallback
  const mockPosts = [
    {
      id: 1,
      author: "TechCorp Solutions",
      avatar: "TC",
      avatarBg: "bg-blue-100",
      avatarText: "text-blue-600",
      time: "2h",
      content: "🚀 We're expanding our team! Looking for passionate Full Stack Developers to join our innovative projects. Remote-first culture with competitive benefits. Apply now! #Hiring #FullStack #RemoteWork",
      likes: 142,
      comments: 28,
      isCompany: true
    },
    {
      id: 2,
      author: "Sarah Johnson",
      avatar: "SJ",
      avatarBg: "bg-purple-100",
      avatarText: "text-purple-600",
      time: "4h",
      content: "Just completed my first project using React and Node.js! 🎉 The learning curve was steep, but the satisfaction of seeing everything work together is incredible. Thank you to everyone who helped me along the way! #ReactJS #NodeJS #Learning",
      likes: 89,
      comments: 12,
      isCompany: false
    },
    {
      id: 3,
      author: "AI Innovations Ltd",
      avatar: "AI",
      avatarBg: "bg-green-100",
      avatarText: "text-green-600",
      time: "6h",
      content: "🤖 The future of AI is here! Our latest research shows 78% improvement in machine learning efficiency. We're looking for AI researchers and data scientists to join our mission. #AI #MachineLearning #DataScience",
      likes: 256,
      comments: 45,
      isCompany: true
    },
    {
      id: 4,
      author: "Alex Chen",
      avatar: "AC",
      avatarBg: "bg-orange-100",
      avatarText: "text-orange-600",
      time: "8h",
      content: "Networking tip: Don't just connect, engage! I've learned more from commenting on posts and starting conversations than from sending connection requests. What's your best networking advice? 💡 #Networking #CareerTips",
      likes: 178,
      comments: 34,
      isCompany: false
    },
    {
      id: 5,
      author: "Global Finance Corp",
      avatar: "GF",
      avatarBg: "bg-indigo-100",
      avatarText: "text-indigo-600",
      time: "12h",
      content: "📊 Market Update: Tech sector shows 15% growth this quarter. We're seeing increased demand for cybersecurity professionals and cloud architects. Great time to upskill! #MarketUpdate #TechCareers #Cybersecurity",
      likes: 298,
      comments: 67,
      isCompany: true
    }
  ];

  return (
    <div className="space-y-6">
      {/* Post Creation */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex space-x-4">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <div className="flex-1">
            <textarea
              placeholder="Share your professional insights, achievements, or industry thoughts..."
              className="w-full p-3 border rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows="3"
              value={postContent}
              onChange={(e) => setPostContent(e.target.value)}
            />
            
            {/* Selected Files Preview */}
            {selectedFiles.length > 0 && (
              <div className="mt-3 p-3 border rounded-lg bg-gray-50">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Selected Files:</h4>
                <div className="space-y-2">
                  {selectedFiles.map((file, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-white rounded border">
                      <div className="flex items-center space-x-2">
                        <span className="text-lg">
                          {file.type.startsWith('image/') ? '📷' : 
                           file.type.startsWith('video/') ? '🎥' : '❓'}
                        </span>
                        <span className="text-sm text-gray-700 truncate max-w-xs">
                          {file.name}
                        </span>
                        <span className="text-xs text-gray-500">
                          ({(file.size / 1024 / 1024).toFixed(2)} MB)
                        </span>
                      </div>
                      <button
                        onClick={() => removeFile(index)}
                        className="text-red-500 hover:text-red-700 p-1"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex justify-between items-center mt-3">
              <div className="flex space-x-4">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileSelect}
                  multiple
                  accept="image/*,video/*"
                  className="hidden"
                />
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center space-x-1 text-blue-800 hover:text-blue-900 text-sm transition-colors"
                >
                  <span>📷</span>
                  <span>Photo</span>
                </button>
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center space-x-1 text-blue-800 hover:text-blue-900 text-sm transition-colors"
                >
                  <span>🎥</span>
                  <span>Video</span>
                </button>
              </div>
              <button 
                onClick={handlePostSubmit}
                disabled={(!postContent.trim() && selectedFiles.length === 0) || posting}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  (postContent.trim() || selectedFiles.length > 0) && !posting
                    ? 'bg-gradient-to-r from-blue-800 to-blue-900 text-white hover:from-blue-900 hover:to-blue-800' 
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                {posting ? 'Posting...' : 'Post'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Industry Insights Banner */}
      <div className="bg-gradient-to-r from-indigo-500 to-blue-600 rounded-lg shadow-md p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold mb-2">🌟 Industry Insights</h3>
            <p className="text-indigo-100">Tech job market up 23% this month. AI and Cloud roles in high demand.</p>
          </div>
          <button className="bg-white text-indigo-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-50 transition-colors">
            Learn More
          </button>
        </div>
      </div>

      {/* Loading State */}
      {loading && posts.length === 0 && (
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-500">Loading posts...</p>
        </div>
      )}

      {/* Posts Feed */}
      {(posts.length > 0 ? posts : mockPosts).map((post) => (
        <div key={post.id || post._id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
          <div className="flex space-x-4">
            <div className={`w-12 h-12 ${post.avatarBg || 'bg-blue-100'} rounded-full flex items-center justify-center`}>
              <span className={`${post.avatarText || 'text-blue-600'} font-semibold text-sm`}>
                {post.avatar || post.author?.name?.charAt(0) || 'U'}
              </span>
            </div>
            <div className="flex-1">
              <div className="flex items-center space-x-2">
                <h4 className="font-semibold text-gray-900">
                  {post.author?.name || post.author}
                </h4>
                {(post.isCompanyPost || post.isCompany) && (
                  <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">Company</span>
                )}
                <span className="text-gray-500 text-sm">
                  • {post.createdAt ? new Date(post.createdAt).toLocaleDateString() : post.time}
                </span>
              </div>
              <p className="text-gray-700 mt-3 leading-relaxed">{post.content}</p>
              
              {/* Post Attachments */}
              {((post.images && post.images.length > 0) || 
                (post.videos && post.videos.length > 0)) && (
                <div className="mt-4">
                  {/* Images */}
                  {post.images && post.images.length > 0 && (
                    <div className="grid grid-cols-2 gap-2 mb-3">
                      {post.images.slice(0, 4).map((image, index) => (
                        <div key={index} className="relative">
                          <img 
                            src={image} 
                            alt={`Post image ${index + 1}`}
                            className="w-full h-48 object-cover rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
                            onClick={() => window.open(image, '_blank')}
                          />
                          {index === 3 && post.images.length > 4 && (
                            <div className="absolute inset-0 bg-black bg-opacity-50 rounded-lg flex items-center justify-center text-white font-semibold">
                              +{post.images.length - 4} more
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {/* Videos */}
                  {post.videos && post.videos.length > 0 && (
                    <div className="mb-3">
                      {post.videos.slice(0, 1).map((video, index) => (
                        <video 
                          key={index}
                          src={video} 
                          controls 
                          className="w-full max-h-80 rounded-lg"
                        />
                      ))}
                      {post.videos.length > 1 && (
                        <p className="text-sm text-gray-500 mt-1">+{post.videos.length - 1} more video(s)</p>
                      )}
                    </div>
                  )}
                </div>
              )}
              
              {/* Engagement Stats */}
              <div className="flex items-center space-x-4 mt-4 text-sm text-gray-500 border-b pb-3">
                <span>{post.likeCount || post.likes || 0} likes</span>
                <span>{post.commentCount || post.comments?.length || 0} comments</span>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-6 mt-3 text-sm">
                <button 
                  onClick={() => toggleLike(post._id || post.id)}
                  className={`flex items-center space-x-1 py-2 px-3 rounded-lg transition-colors ${
                    likedPosts.has(post._id || post.id) 
                      ? 'text-blue-600 bg-blue-50' 
                      : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                  }`}
                >
                  <span>{likedPosts.has(post._id || post.id) ? '👍' : '👍'}</span>
                  <span>Like</span>
                </button>
                <button 
                  onClick={() => toggleCommentBox(post._id || post.id)}
                  className="flex items-center space-x-1 text-gray-600 hover:text-blue-600 py-2 px-3 rounded-lg hover:bg-blue-50 transition-colors"
                >
                  <span>💬</span>
                  <span>Comment</span>
                </button>
              </div>

              {/* Comment Box */}
              {commentStates[post._id || post.id]?.showBox && (
                <div className="mt-4 border-t pt-4">
                  <div className="flex space-x-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-blue-600 text-sm font-medium">
                        {user?.name?.charAt(0) || 'U'}
                      </span>
                    </div>
                    <div className="flex-1">
                      <textarea
                        value={commentStates[post._id || post.id]?.text || ''}
                        onChange={(e) => updateCommentText(post._id || post.id, e.target.value)}
                        placeholder="Write a comment..."
                        className="w-full p-3 border rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        rows="2"
                      />
                      <div className="flex justify-end space-x-2 mt-2">
                        <button
                          onClick={() => toggleCommentBox(post._id || post.id)}
                          className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => handleComment(post._id || post.id, commentStates[post._id || post.id]?.text)}
                          disabled={!commentStates[post._id || post.id]?.text?.trim()}
                          className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Comment
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Existing Comments */}
              {post.comments && post.comments.length > 0 && (
                <div className="mt-4 border-t pt-4 space-y-3">
                  {post.comments.slice(0, 3).map((comment, index) => (
                    <div key={comment._id || index} className="flex space-x-3">
                      <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-gray-600 text-sm font-medium">
                          {comment.user?.name?.charAt(0) || 'U'}
                        </span>
                      </div>
                      <div className="flex-1">
                        <div className="bg-gray-50 rounded-lg p-3">
                          <div className="flex items-center space-x-2 mb-1">
                            <span className="font-medium text-sm text-gray-900">
                              {comment.user?.name || 'User'}
                            </span>
                            <span className="text-xs text-gray-500">
                              {new Date(comment.createdAt || Date.now()).toLocaleDateString()}
                            </span>
                          </div>
                          <p className="text-sm text-gray-700">{comment.content}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                  {post.comments.length > 3 && (
                    <button className="text-sm text-blue-600 hover:text-blue-800 ml-11">
                      View all {post.comments.length} comments
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      ))}

      {/* Load More Button */}
      {hasMore && (
        <div className="text-center">
          <button 
            onClick={loadMorePosts}
            disabled={loading}
            className="bg-white border border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            {loading ? 'Loading...' : 'Load more posts'}
          </button>
        </div>
      )}
    </div>
  );
};

export default FeedTab;