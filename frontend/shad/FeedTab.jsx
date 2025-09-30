import React, { useState, useEffect } from 'react';
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
    if (postContent.trim() && !posting) {
      try {
        setPosting(true);
        const response = await postService.createPost({
          content: postContent.trim(),
          visibility: 'public'
        });
        if (response.success) {
          setPosts(prev => [response.data, ...prev]);
          setPostContent('');
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
      }
    } catch (error) {
      console.error('Failed to add comment:', error);
    }
  };

  const handleShare = async (postId) => {
    try {
      const response = await postService.sharePost(postId);
      if (response.success) {
        setPosts(prev => prev.map(post => 
          post._id === postId 
            ? { ...post, shareCount: response.data.shareCount }
            : post
        ));
        alert('Post shared successfully!');
      }
    } catch (error) {
      console.error('Failed to share post:', error);
    }
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
      shares: 15,
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
      shares: 5,
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
      shares: 32,
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
      shares: 22,
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
      shares: 78,
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
            <div className="flex justify-between items-center mt-3">
              <div className="flex space-x-4">
                <button className="flex items-center space-x-1 text-blue-800 hover:text-blue-900 text-sm transition-colors">
                  <span>📷</span>
                  <span>Photo</span>
                </button>
                <button className="flex items-center space-x-1 text-blue-800 hover:text-blue-900 text-sm transition-colors">
                  <span>🎥</span>
                  <span>Video</span>
                </button>
                <button className="flex items-center space-x-1 text-blue-800 hover:text-blue-900 text-sm transition-colors">
                  <span>📄</span>
                  <span>Document</span>
                </button>
                <button className="flex items-center space-x-1 text-blue-800 hover:text-blue-900 text-sm transition-colors">
                  <span>🎉</span>
                  <span>Celebrate</span>
                </button>
              </div>
              <button 
                onClick={handlePostSubmit}
                disabled={!postContent.trim() || posting}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  postContent.trim() && !posting
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
        <div key={post.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
          <div className="flex space-x-4">
            <div className={`w-12 h-12 ${post.avatarBg} rounded-full flex items-center justify-center`}>
              <span className={`${post.avatarText} font-semibold text-sm`}>{post.avatar}</span>
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
              
              {/* Engagement Stats */}
              <div className="flex items-center space-x-4 mt-4 text-sm text-gray-500 border-b pb-3">
                <span>{post.likeCount || post.likes || 0} likes</span>
                <span>{post.commentCount || post.comments?.length || 0} comments</span>
                <span>{post.shareCount || post.shares || 0} shares</span>
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
                <button className="flex items-center space-x-1 text-gray-600 hover:text-blue-600 py-2 px-3 rounded-lg hover:bg-blue-50 transition-colors">
                  <span>�</span>
                  <span>Comment</span>
                </button>
                <button className="flex items-center space-x-1 text-gray-600 hover:text-blue-600 py-2 px-3 rounded-lg hover:bg-blue-50 transition-colors">
                  <span>�</span>
                  <span>Share</span>
                </button>
                <button className="flex items-center space-x-1 text-gray-600 hover:text-blue-600 py-2 px-3 rounded-lg hover:bg-blue-50 transition-colors">
                  <span>�</span>
                  <span>Send</span>
                </button>
              </div>
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

// Comment Button Component
const CommentButton = ({ postId, onComment }) => {
  const [showCommentBox, setShowCommentBox] = useState(false);
  const [commentText, setCommentText] = useState('');

  const handleSubmitComment = async () => {
    if (commentText.trim()) {
      await onComment(postId, commentText.trim());
      setCommentText('');
      setShowCommentBox(false);
    }
  };

  return (
    <div className="relative">
      <button 
        onClick={() => setShowCommentBox(!showCommentBox)}
        className="flex items-center space-x-1 text-gray-600 hover:text-blue-600 py-2 px-3 rounded-lg hover:bg-blue-50 transition-colors"
      >
        <span>💬</span>
        <span>Comment</span>
      </button>
      
      {showCommentBox && (
        <div className="absolute top-full left-0 mt-2 w-80 bg-white border rounded-lg shadow-lg p-3 z-10">
          <textarea
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder="Write a comment..."
            className="w-full p-2 border rounded resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows="3"
          />
          <div className="flex justify-end space-x-2 mt-2">
            <button
              onClick={() => setShowCommentBox(false)}
              className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmitComment}
              disabled={!commentText.trim()}
              className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
            >
              Comment
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FeedTab;