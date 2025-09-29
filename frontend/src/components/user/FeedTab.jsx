import React, { useState } from 'react';

const FeedTab = () => {
  const [postContent, setPostContent] = useState('');
  const [likedPosts, setLikedPosts] = useState(new Set());

  const handlePostSubmit = () => {
    if (postContent.trim()) {
      // Handle post submission
      console.log('Posting:', postContent);
      setPostContent('');
    }
  };

  const toggleLike = (postId) => {
    const newLikedPosts = new Set(likedPosts);
    if (newLikedPosts.has(postId)) {
      newLikedPosts.delete(postId);
    } else {
      newLikedPosts.add(postId);
    }
    setLikedPosts(newLikedPosts);
  };

  const posts = [
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
                disabled={!postContent.trim()}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  postContent.trim() 
                    ? 'bg-gradient-to-r from-blue-800 to-blue-900 text-white hover:from-blue-900 hover:to-blue-800' 
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                Post
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

      {/* Posts Feed */}
      {posts.map((post) => (
        <div key={post.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
          <div className="flex space-x-4">
            <div className={`w-12 h-12 ${post.avatarBg} rounded-full flex items-center justify-center`}>
              <span className={`${post.avatarText} font-semibold text-sm`}>{post.avatar}</span>
            </div>
            <div className="flex-1">
              <div className="flex items-center space-x-2">
                <h4 className="font-semibold text-gray-900">{post.author}</h4>
                {post.isCompany && (
                  <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">Company</span>
                )}
                <span className="text-gray-500 text-sm">• {post.time}</span>
              </div>
              <p className="text-gray-700 mt-3 leading-relaxed">{post.content}</p>
              
              {/* Engagement Stats */}
              <div className="flex items-center space-x-4 mt-4 text-sm text-gray-500 border-b pb-3">
                <span>{post.likes} likes</span>
                <span>{post.comments} comments</span>
                <span>{post.shares} shares</span>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-6 mt-3 text-sm">
                <button 
                  onClick={() => toggleLike(post.id)}
                  className={`flex items-center space-x-1 py-2 px-3 rounded-lg transition-colors ${
                    likedPosts.has(post.id) 
                      ? 'text-blue-600 bg-blue-50' 
                      : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                  }`}
                >
                  <span>{likedPosts.has(post.id) ? '👍' : '👍'}</span>
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
      <div className="text-center">
        <button className="bg-white border border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors">
          Load more posts
        </button>
      </div>
    </div>
  );
};

export default FeedTab;