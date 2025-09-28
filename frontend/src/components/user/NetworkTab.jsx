import React from 'react';

const NetworkTab = ({ profileData }) => (
  <div className="space-y-6">
    {/* Connection Requests */}
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold mb-4">Connection Requests</h3>
      {profileData?.connectionRequests?.length > 0 ? (
        <div className="space-y-4">
          {profileData.connectionRequests
            .filter(req => req.status === 'pending')
            .map((request, index) => (
            <div key={index} className="flex items-center justify-between border-b pb-4">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-semibold">John Doe</h4>
                  <p className="text-sm text-gray-600">Software Engineer at TechCorp</p>
                </div>
              </div>
              <div className="space-x-2">
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700">
                  Accept
                </button>
                <button className="border border-gray-300 px-4 py-2 rounded-lg text-sm hover:bg-gray-50">
                  Decline
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500">No pending connection requests.</p>
      )}
    </div>

    {/* My Connections */}
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold mb-4">My Network ({profileData?.connections?.length || 0})</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[
          { name: 'Alice Johnson', title: 'Product Manager', company: 'TechStart' },
          { name: 'Bob Smith', title: 'UX Designer', company: 'DesignCo' },
          { name: 'Carol Brown', title: 'Data Scientist', company: 'DataFirm' },
          { name: 'David Wilson', title: 'Backend Developer', company: 'CodeBase' }
        ].map((connection, index) => (
          <div key={index} className="border rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 font-semibold text-sm">
                  {connection.name.split(' ').map(n => n[0]).join('')}
                </span>
              </div>
              <div>
                <h4 className="font-semibold text-sm">{connection.name}</h4>
                <p className="text-xs text-gray-600">{connection.title}</p>
                <p className="text-xs text-gray-500">{connection.company}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default NetworkTab;