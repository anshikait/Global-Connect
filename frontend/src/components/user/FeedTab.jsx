import React from 'react';

const FeedTab = () => (
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
            placeholder="Share an update with your network..."
            className="w-full p-3 border rounded-lg resize-none"
            rows="3"
          />
          <div className="flex justify-between items-center mt-3">
            <div className="flex space-x-4">
              <button className="text-blue-800 hover:text-blue-900 text-sm">📷 Photo</button>
              <button className="text-blue-800 hover:text-blue-900 text-sm">🎥 Video</button>
              <button className="text-blue-800 hover:text-blue-900 text-sm">📄 Document</button>
            </div>
            <button className="bg-gradient-to-r from-blue-800 to-blue-900 text-white px-4 py-2 rounded-lg text-sm hover:from-blue-900 hover:to-blue-800 transition-all duration-200">
              Post
            </button>
          </div>
        </div>
      </div>
    </div>

    {/* Sample Posts */}
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex space-x-4">
        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
          <span className="text-green-600 font-semibold">TC</span>
        </div>
        <div className="flex-1">
          <div className="flex items-center space-x-2">
            <h4 className="font-semibold">Tech Company Inc.</h4>
            <span className="text-gray-500 text-sm">• 2h</span>
          </div>
          <p className="text-gray-700 mt-2">
            We're hiring! Looking for talented Software Engineers to join our growing team. 
            Remote work available. #hiring #remotework #softwareengineering
          </p>
          <div className="flex space-x-6 mt-4 text-sm text-gray-500">
            <button className="hover:text-blue-600">👍 Like</button>
            <button className="hover:text-blue-600">💬 Comment</button>
            <button className="hover:text-blue-600">🔄 Share</button>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default FeedTab;