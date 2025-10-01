import React, { useState, useEffect } from 'react';
import { postService, connectionService } from '../services/socialService.js';

const ShareModal = ({ show, postId, onClose, onShare }) => {
  const [activeTab, setActiveTab] = useState('share');
  const [connections, setConnections] = useState([]);
  const [selectedConnections, setSelectedConnections] = useState([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (show && activeTab === 'send') {
      loadConnections();
    }
  }, [show, activeTab]);

  const loadConnections = async () => {
    try {
      setLoading(true);
      const response = await connectionService.getUserConnections(1, 50, searchQuery);
      if (response.success) {
        setConnections(response.data.connections || []);
      }
    } catch (error) {
      console.error('Failed to load connections:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleShare = async () => {
    try {
      await onShare(postId);
    } catch (error) {
      console.error('Failed to share post:', error);
      alert('Failed to share post. Please try again.');
    }
  };

  const handleSend = async () => {
    if (selectedConnections.length === 0) {
      alert('Please select at least one connection to send to.');
      return;
    }

    try {
      setLoading(true);
      const response = await postService.sendPost(postId, selectedConnections, message);
      if (response.success) {
        alert(`Post sent to ${selectedConnections.length} connection(s)!`);
        onClose();
      }
    } catch (error) {
      console.error('Failed to send post:', error);
      alert('Failed to send post. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const toggleConnection = (connectionId) => {
    setSelectedConnections(prev => 
      prev.includes(connectionId)
        ? prev.filter(id => id !== connectionId)
        : [...prev, connectionId]
    );
  };

  const copyLink = () => {
    const postUrl = `${window.location.origin}/post/${postId}`;
    navigator.clipboard.writeText(postUrl);
    alert('Link copied to clipboard!');
    onClose();
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-96 max-w-md mx-4 max-h-[80vh] overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="text-lg font-semibold text-gray-900">Share Post</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b">
          <button
            onClick={() => setActiveTab('share')}
            className={`flex-1 px-4 py-2 text-sm font-medium ${
              activeTab === 'share'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Share & Copy
          </button>
          <button
            onClick={() => setActiveTab('send')}
            className={`flex-1 px-4 py-2 text-sm font-medium ${
              activeTab === 'send'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Send to Connections
          </button>
        </div>

        <div className="p-4">
          {activeTab === 'share' && (
            <div className="space-y-3">
              <button
                onClick={handleShare}
                className="w-full flex items-center space-x-3 p-3 text-left hover:bg-gray-50 rounded-lg transition-colors"
              >
                <span className="text-xl">🔄</span>
                <div>
                  <div className="font-medium text-gray-900">Share to your feed</div>
                  <div className="text-sm text-gray-500">Share this post with your connections</div>
                </div>
              </button>
              
              <button
                onClick={copyLink}
                className="w-full flex items-center space-x-3 p-3 text-left hover:bg-gray-50 rounded-lg transition-colors"
              >
                <span className="text-xl">🔗</span>
                <div>
                  <div className="font-medium text-gray-900">Copy link</div>
                  <div className="text-sm text-gray-500">Copy link to this post</div>
                </div>
              </button>
            </div>
          )}

          {activeTab === 'send' && (
            <div className="space-y-4">
              {/* Message Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Add a message (optional)
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Add a personal message..."
                  className="w-full p-3 border rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows="3"
                />
              </div>

              {/* Search Connections */}
              <div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search connections..."
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Connections List */}
              <div className="max-h-60 overflow-y-auto">
                {loading ? (
                  <div className="text-center py-4">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-2 text-sm text-gray-500">Loading connections...</p>
                  </div>
                ) : connections.length === 0 ? (
                  <p className="text-center text-gray-500 py-4">No connections found</p>
                ) : (
                  <div className="space-y-2">
                    {connections
                      .filter(conn => 
                        !searchQuery || 
                        conn.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        conn.role?.toLowerCase().includes(searchQuery.toLowerCase())
                      )
                      .map((connection) => (
                      <div
                        key={connection._id}
                        className={`flex items-center space-x-3 p-2 rounded-lg cursor-pointer transition-colors ${
                          selectedConnections.includes(connection._id)
                            ? 'bg-blue-50 border border-blue-200'
                            : 'hover:bg-gray-50'
                        }`}
                        onClick={() => toggleConnection(connection._id)}
                      >
                        <input
                          type="checkbox"
                          checked={selectedConnections.includes(connection._id)}
                          onChange={() => toggleConnection(connection._id)}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                          <span className="text-sm font-medium text-gray-600">
                            {connection.name.charAt(0)}
                          </span>
                        </div>
                        <div className="flex-1">
                          <div className="font-medium text-sm text-gray-900">
                            {connection.name}
                          </div>
                          {connection.role && (
                            <div className="text-xs text-gray-500">
                              {connection.role}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Send Button */}
              <div className="flex justify-end space-x-2 pt-4 border-t">
                <button
                  onClick={onClose}
                  className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSend}
                  disabled={selectedConnections.length === 0 || loading}
                  className="px-4 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Sending...' : `Send to ${selectedConnections.length} connection(s)`}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ShareModal;