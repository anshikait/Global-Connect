import React, { useState, useEffect } from 'react';
import { connectionService, messageService } from '../../services/socialService.js';
import { useAuth } from '../../context/AuthContext.jsx';
import ProfileModal from '../ProfileModal.jsx';

const NetworkTab = ({ profileData, onSwitchToMessages, onConnectionUpdate }) => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('connections');
  const [searchTerm, setSearchTerm] = useState('');
  const [connections, setConnections] = useState([]);
  const [connectionRequests, setConnectionRequests] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [networkStats, setNetworkStats] = useState({
    connections: 0,
    pendingRequests: 0,
    suggestions: 0
  });
  const [loading, setLoading] = useState(true);
  const [selectedProfileId, setSelectedProfileId] = useState(null);
  const [showProfileModal, setShowProfileModal] = useState(false);

  // Load initial data on component mount
  useEffect(() => {
    loadAllInitialData();
  }, []);

  // Load data when tab changes (but not on initial mount)
  useEffect(() => {
    if (activeTab) {
      loadData();
    }
  }, [activeTab]);

  const loadAllInitialData = async () => {
    setLoading(true);
    try {
      // Load all data initially to get accurate counts for all tabs
      await Promise.all([
        loadNetworkStats(),
        loadConnections(),
        loadConnectionRequests(), 
        loadSuggestions()
      ]);
    } catch (error) {
      console.error('Failed to load initial data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadNetworkStats = async () => {
    try {
      const response = await connectionService.getNetworkStats();
      if (response.success) {
        console.log('Network stats loaded:', response.data);
        setNetworkStats(response.data);
      }
    } catch (error) {
      console.error('Failed to load network stats:', error);
    }
  };

  const loadData = async () => {
    // Don't show loading spinner for tab switches since we have initial data
    try {
      switch (activeTab) {
        case 'connections':
          await loadConnections();
          break;
        case 'requests':
          await loadConnectionRequests();
          break;
        case 'suggestions':
          await loadSuggestions();
          break;
      }
    } catch (error) {
      console.error('Failed to load data:', error);
    }
  };

  const loadConnections = async () => {
    const response = await connectionService.getUserConnections(1, 20, searchTerm);
    if (response.success) {
      setConnections(response.data.connections);
      // Update the connections count in stats
      setNetworkStats(prev => ({
        ...prev,
        connections: response.data.connections.length
      }));
    }
  };

  const loadConnectionRequests = async () => {
    const response = await connectionService.getConnectionRequests();
    if (response.success) {
      setConnectionRequests(response.data.requests);
      // Update the pending requests count in stats
      setNetworkStats(prev => ({
        ...prev,
        pendingRequests: response.data.requests.length
      }));
    }
  };

  const loadSuggestions = async () => {
    const response = await connectionService.getConnectionSuggestions();
    if (response.success) {
      console.log('Suggestions loaded:', response.data.suggestions.length, 'items');
      setSuggestions(response.data.suggestions);
      // Update the suggestions count in stats
      setNetworkStats(prev => ({
        ...prev,
        suggestions: response.data.suggestions.length
      }));
    }
  };

  const handleConnectionRequest = async (recipientId, action) => {
    try {
      if (action === 'send') {
        await connectionService.sendConnectionRequest(recipientId);
        alert('Connection request sent!');
        await loadSuggestions(); // This will update the suggestions count
        // Also refresh stats from server to be safe
        await loadNetworkStats();
        // Refresh dashboard stats
        if (onConnectionUpdate) onConnectionUpdate();
      } else if (action === 'accept' || action === 'decline') {
        await connectionService.respondToConnectionRequest(recipientId, action);
        alert(`Connection request ${action}ed!`);
        await loadConnectionRequests(); // This will update the requests count
        await loadConnections(); // This will update the connections count
        // Refresh stats from server to ensure consistency
        await loadNetworkStats();
        // Refresh dashboard stats
        if (onConnectionUpdate) onConnectionUpdate();
      }
    } catch (error) {
      console.error('Failed to handle connection request:', error);
      alert('Failed to process request. Please try again.');
    }
  };

  const handleStartConversation = async (participantId) => {
    try {
      const response = await messageService.getOrCreateConversation(participantId);
      if (response.success) {
        // Switch to messages tab
        if (onSwitchToMessages) {
          onSwitchToMessages(response.data);
        } else {
          alert('Conversation started! Go to Messages tab to chat.');
        }
      }
    } catch (error) {
      console.error('Failed to start conversation:', error);
      alert('Failed to start conversation. Make sure you are connected to this user.');
    }
  };

  const handleViewProfile = (userId) => {
    setSelectedProfileId(userId);
    setShowProfileModal(true);
  };

  const filteredConnections = connections.filter(conn =>
    conn.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    conn.user?.role?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    conn.user?.bio?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Network Stats */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg shadow-md p-6 text-white">
        <h2 className="text-xl font-bold mb-4">Your Network</h2>
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold">{networkStats.connections}</div>
            <div className="text-sm text-blue-100">Connections</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">{networkStats.pendingRequests}</div>
            <div className="text-sm text-blue-100">Pending Requests</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">{networkStats.suggestions}</div>
            <div className="text-sm text-blue-100">Suggestions</div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white rounded-lg shadow-md">
        <div className="border-b">
          <nav className="flex space-x-8 px-6">
            {[
              { id: 'connections', label: 'My Connections', count: connections.length },
              { id: 'requests', label: 'Requests', count: connectionRequests.length },
              { id: 'suggestions', label: 'People You May Know', count: suggestions.length }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.label} ({tab.count})
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'connections' && (
            <div className="space-y-4">
              {/* Search Bar */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search your connections..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <svg className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>

              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="mt-2 text-gray-500">Loading connections...</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredConnections.length === 0 ? (
                    <div className="col-span-2 text-center py-8">
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                      </div>
                      <p className="text-gray-500">No connections found</p>
                    </div>
                  ) : (
                    filteredConnections.map((connection) => (
                      <div key={connection._id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                            <span className="text-blue-600 font-semibold">
                              {connection.user?.name?.split(' ').map(n => n[0]).join('') || 'U'}
                            </span>
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold">{connection.user?.name || 'Unknown User'}</h4>
                            <p className="text-sm text-gray-600">{connection.user?.role || 'User'}</p>
                            <p className="text-sm text-gray-500">{connection.user?.bio || 'No bio available'}</p>
                            <p className="text-xs text-green-600">{connection.status || 'Connected'}</p>
                          </div>
                        </div>
                        <div className="mt-3 flex space-x-2">
                          <button 
                            onClick={() => handleStartConversation(connection.user._id)}
                            className="flex-1 bg-blue-50 text-blue-600 px-3 py-2 rounded-lg text-sm hover:bg-blue-100 transition-colors"
                          >
                            Message
                          </button>
                          <button 
                            onClick={() => handleViewProfile(connection.user._id)}
                            className="px-3 py-2 border rounded-lg text-sm hover:bg-gray-50 transition-colors"
                          >
                            View Profile
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          )}

          {activeTab === 'requests' && (
            <div className="space-y-4">
              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="mt-2 text-gray-500">Loading requests...</p>
                </div>
              ) : connectionRequests.length > 0 ? (
                connectionRequests.map((request) => (
                  <div key={request._id} className="flex items-center justify-between border rounded-lg p-4">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center">
                        <span className="text-pink-600 font-semibold">
                          {request.requester?.name?.split(' ').map(n => n[0]).join('') || 'U'}
                        </span>
                      </div>
                      <div>
                        <h4 className="font-semibold">{request.requester?.name || 'Unknown User'}</h4>
                        <p className="text-sm text-gray-600">
                          {request.requester?.role || 'User'} {request.requester?.bio && `• ${request.requester.bio.substring(0, 50)}...`}
                        </p>
                        <p className="text-xs text-gray-500">{request.mutualConnections || 0} mutual connections</p>
                        {request.message && (
                          <p className="text-sm text-gray-700 mt-1 italic">"{request.message}"</p>
                        )}
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => handleConnectionRequest(request._id, 'accept')}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 transition-colors"
                      >
                        Accept
                      </button>
                      <button 
                        onClick={() => handleConnectionRequest(request._id, 'decline')}
                        className="border border-gray-300 px-4 py-2 rounded-lg text-sm hover:bg-gray-50 transition-colors"
                      >
                        Decline
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <p className="text-gray-500">No pending connection requests</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'suggestions' && (
            <div className="space-y-4">
              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="mt-2 text-gray-500">Loading suggestions...</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {suggestions.length === 0 ? (
                    <div className="col-span-2 text-center py-8">
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                      </div>
                      <p className="text-gray-500">No suggestions available</p>
                    </div>
                  ) : (
                    suggestions.map((suggestion) => (
                      <div key={suggestion._id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                            <span className="text-red-600 font-semibold">
                              {suggestion.name?.split(' ').map(n => n[0]).join('') || 'U'}
                            </span>
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold">{suggestion.name || 'Unknown User'}</h4>
                            <p className="text-sm text-gray-600">{suggestion.role || 'User'}</p>
                            <p className="text-sm text-gray-500">{suggestion.bio || 'No bio available'}</p>
                            <p className="text-xs text-blue-600">{suggestion.reason || 'Similar background'}</p>
                            <p className="text-xs text-gray-500">{suggestion.mutualConnections || 0} mutual connections</p>
                          </div>
                        </div>
                        <div className="mt-3 flex space-x-2">
                          <button 
                            onClick={() => handleConnectionRequest(suggestion._id, 'send')}
                            className="flex-1 bg-blue-600 text-white px-3 py-2 rounded-lg text-sm hover:bg-blue-700 transition-colors"
                          >
                            Connect
                          </button>
                          <button className="px-3 py-2 border rounded-lg text-sm hover:bg-gray-50 transition-colors">
                            Dismiss
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          )}


        </div>
      </div>

      {/* Profile Modal */}
      <ProfileModal
        userId={selectedProfileId}
        isOpen={showProfileModal}
        onClose={() => {
          setShowProfileModal(false);
          setSelectedProfileId(null);
        }}
        onSwitchToMessages={onSwitchToMessages}
      />
    </div>
  );
};

export default NetworkTab;