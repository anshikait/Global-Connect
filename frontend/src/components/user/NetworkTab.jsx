import React, { useState } from 'react';

const NetworkTab = ({ profileData }) => {
  const [activeTab, setActiveTab] = useState('connections');
  const [searchTerm, setSearchTerm] = useState('');

  const connectionRequests = [
    {
      id: 1,
      name: 'Sarah Miller',
      title: 'Senior Product Manager',
      company: 'Google',
      mutualConnections: 12,
      avatar: 'SM',
      avatarBg: 'bg-pink-100',
      avatarText: 'text-pink-600'
    },
    {
      id: 2,
      name: 'Michael Chen',
      title: 'Full Stack Developer',
      company: 'Microsoft',
      mutualConnections: 8,
      avatar: 'MC',
      avatarBg: 'bg-blue-100',
      avatarText: 'text-blue-600'
    }
  ];

  const connections = [
    { id: 1, name: 'Alice Johnson', title: 'Product Manager', company: 'TechStart', avatar: 'AJ', avatarBg: 'bg-purple-100', avatarText: 'text-purple-600', status: 'Active now' },
    { id: 2, name: 'Bob Smith', title: 'UX Designer', company: 'DesignCo', avatar: 'BS', avatarBg: 'bg-green-100', avatarText: 'text-green-600', status: '2h ago' },
    { id: 3, name: 'Carol Brown', title: 'Data Scientist', company: 'DataFirm', avatar: 'CB', avatarBg: 'bg-orange-100', avatarText: 'text-orange-600', status: '1d ago' },
    { id: 4, name: 'David Wilson', title: 'Backend Developer', company: 'CodeBase', avatar: 'DW', avatarBg: 'bg-indigo-100', avatarText: 'text-indigo-600', status: '3d ago' }
  ];

  const suggestions = [
    {
      id: 1,
      name: 'Emma Rodriguez',
      title: 'Frontend Developer',
      company: 'Netflix',
      mutualConnections: 5,
      reason: 'Works at Netflix',
      avatar: 'ER',
      avatarBg: 'bg-red-100',
      avatarText: 'text-red-600'
    },
    {
      id: 2,
      name: 'James Kim',
      title: 'DevOps Engineer',
      company: 'Amazon',
      mutualConnections: 3,
      reason: 'Similar background',
      avatar: 'JK',
      avatarBg: 'bg-yellow-100',
      avatarText: 'text-yellow-600'
    },
    {
      id: 3,
      name: 'Lisa Wang',
      title: 'Machine Learning Engineer',
      company: 'Tesla',
      mutualConnections: 7,
      reason: 'You both know Alice Johnson',
      avatar: 'LW',
      avatarBg: 'bg-teal-100',
      avatarText: 'text-teal-600'
    }
  ];

  const events = [
    {
      id: 1,
      title: 'Tech Networking Mixer',
      date: 'Dec 15, 2024',
      time: '6:00 PM',
      location: 'Virtual Event',
      attendees: 156,
      type: 'Networking'
    },
    {
      id: 2,
      title: 'AI & Machine Learning Conference',
      date: 'Dec 20, 2024',
      time: '9:00 AM',
      location: 'San Francisco, CA',
      attendees: 489,
      type: 'Conference'
    },
    {
      id: 3,
      title: 'Startup Pitch Night',
      date: 'Dec 22, 2024',
      time: '7:00 PM',
      location: 'New York, NY',
      attendees: 78,
      type: 'Pitch Event'
    }
  ];

  const filteredConnections = connections.filter(conn =>
    conn.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    conn.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
    conn.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Network Stats */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg shadow-md p-6 text-white">
        <h2 className="text-xl font-bold mb-4">Your Network</h2>
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold">{connections.length}</div>
            <div className="text-sm text-blue-100">Connections</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">{connectionRequests.length}</div>
            <div className="text-sm text-blue-100">Pending Requests</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">{suggestions.length}</div>
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
              { id: 'suggestions', label: 'People You May Know', count: suggestions.length },
              { id: 'events', label: 'Events', count: events.length }
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

              {/* Connections List */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredConnections.map((connection) => (
                  <div key={connection.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-center space-x-3">
                      <div className={`w-12 h-12 ${connection.avatarBg} rounded-full flex items-center justify-center`}>
                        <span className={`${connection.avatarText} font-semibold`}>
                          {connection.avatar}
                        </span>
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold">{connection.name}</h4>
                        <p className="text-sm text-gray-600">{connection.title}</p>
                        <p className="text-sm text-gray-500">{connection.company}</p>
                        <p className="text-xs text-green-600">{connection.status}</p>
                      </div>
                    </div>
                    <div className="mt-3 flex space-x-2">
                      <button className="flex-1 bg-blue-50 text-blue-600 px-3 py-2 rounded-lg text-sm hover:bg-blue-100 transition-colors">
                        Message
                      </button>
                      <button className="px-3 py-2 border rounded-lg text-sm hover:bg-gray-50 transition-colors">
                        View Profile
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'requests' && (
            <div className="space-y-4">
              {connectionRequests.length > 0 ? (
                connectionRequests.map((request) => (
                  <div key={request.id} className="flex items-center justify-between border rounded-lg p-4">
                    <div className="flex items-center space-x-4">
                      <div className={`w-12 h-12 ${request.avatarBg} rounded-full flex items-center justify-center`}>
                        <span className={`${request.avatarText} font-semibold`}>
                          {request.avatar}
                        </span>
                      </div>
                      <div>
                        <h4 className="font-semibold">{request.name}</h4>
                        <p className="text-sm text-gray-600">{request.title} at {request.company}</p>
                        <p className="text-xs text-gray-500">{request.mutualConnections} mutual connections</p>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 transition-colors">
                        Accept
                      </button>
                      <button className="border border-gray-300 px-4 py-2 rounded-lg text-sm hover:bg-gray-50 transition-colors">
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {suggestions.map((suggestion) => (
                  <div key={suggestion.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-center space-x-3">
                      <div className={`w-12 h-12 ${suggestion.avatarBg} rounded-full flex items-center justify-center`}>
                        <span className={`${suggestion.avatarText} font-semibold`}>
                          {suggestion.avatar}
                        </span>
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold">{suggestion.name}</h4>
                        <p className="text-sm text-gray-600">{suggestion.title}</p>
                        <p className="text-sm text-gray-500">{suggestion.company}</p>
                        <p className="text-xs text-blue-600">{suggestion.reason}</p>
                        <p className="text-xs text-gray-500">{suggestion.mutualConnections} mutual connections</p>
                      </div>
                    </div>
                    <div className="mt-3 flex space-x-2">
                      <button className="flex-1 bg-blue-600 text-white px-3 py-2 rounded-lg text-sm hover:bg-blue-700 transition-colors">
                        Connect
                      </button>
                      <button className="px-3 py-2 border rounded-lg text-sm hover:bg-gray-50 transition-colors">
                        Dismiss
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'events' && (
            <div className="space-y-4">
              {events.map((event) => (
                <div key={event.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h4 className="font-semibold text-lg">{event.title}</h4>
                      <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
                        <div className="flex items-center space-x-1">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <span>{event.date} at {event.time}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          <span>{event.location}</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 mt-2">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          event.type === 'Networking' ? 'bg-blue-100 text-blue-800' :
                          event.type === 'Conference' ? 'bg-green-100 text-green-800' :
                          'bg-purple-100 text-purple-800'
                        }`}>
                          {event.type}
                        </span>
                        <span className="text-sm text-gray-500">{event.attendees} attending</span>
                      </div>
                    </div>
                    <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 transition-colors">
                      RSVP
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NetworkTab;