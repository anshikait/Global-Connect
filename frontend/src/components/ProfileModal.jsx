import React, { useState, useEffect } from 'react';
import { userService, connectionService, messageService } from '../services/socialService';
import { useAuth } from '../context/AuthContext';

const ProfileModal = ({ userId, isOpen, onClose, onSwitchToMessages }) => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [connectionStatus, setConnectionStatus] = useState(null); 
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    if (isOpen && userId) {
      fetchUserProfile();
    }
  }, [isOpen, userId]);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Check if viewing own profile
      if (userId === user.id) {
        setConnectionStatus('self');
      }
      
      // Fetch profile
      const profileResponse = await userService.getUserById(userId);
      
      if (profileResponse.success) {
        setProfile(profileResponse.data.user);
        
        // Only check connection status if not viewing own profile
        if (userId !== user.id) {
          try {
            const [connectionsResponse, requestsResponse] = await Promise.all([
              connectionService.getUserConnections(1, 100),
              connectionService.getConnectionRequests(1, 100)
            ]);
            
            let status = 'none';
            
            // Check if already connected
            if (connectionsResponse.success) {
              const isConnected = connectionsResponse.data.connections.some(
                conn => conn.user._id === userId
              );
              if (isConnected) {
                status = 'connected';
              }
            }
            
            // Check if there's a pending request
            if (status === 'none' && requestsResponse.success) {
              const hasPendingRequest = requestsResponse.data.requests.some(
                req => req.requester._id === userId || req.recipient === userId
              );
              if (hasPendingRequest) {
                status = 'pending';
              }
            }
            
            setConnectionStatus(status);
          } catch (connectionError) {
            console.warn('Could not determine connection status:', connectionError);
            setConnectionStatus('none');
          }
        }
      } else {
        setError(profileResponse.message || 'Failed to load profile');
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
      setError('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async () => {
    try {
      setActionLoading(true);
      const response = await messageService.getOrCreateConversation(userId);
      if (response.success) {
        onClose();
        if (onSwitchToMessages) {
          onSwitchToMessages(response.data);
        }
      }
    } catch (error) {
      console.error('Failed to start conversation:', error);
      alert('Failed to start conversation. Make sure you are connected to this user.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleConnectionAction = async () => {
    try {
      setActionLoading(true);
      if (connectionStatus === 'none') {
        await connectionService.sendConnectionRequest(userId);
        setConnectionStatus('pending');
        alert('Connection request sent!');
      }
    } catch (error) {
      console.error('Failed to send connection request:', error);
      alert('Failed to send connection request.');
    } finally {
      setActionLoading(false);
    }
  };

  if (!isOpen) return null;

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            <span className="ml-2">Loading profile...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 max-w-md">
          <h3 className="text-lg font-semibold text-red-600 mb-2">Error</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  if (!profile) return null;

  return (
    <div className="fixed inset-0 backdrop-blur-md bg-white/30 flex items-center justify-center z-50 p-4">
      <div className="bg-white/95 backdrop-blur-lg rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-white/20">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-white/20 sticky top-0 bg-white/80 backdrop-blur-sm">
          <h2 className="text-xl font-semibold text-gray-900">Profile</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl"
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-8">
          {/* Basic Info */}
          <div className="flex items-start space-x-6">
            <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
              {profile.profilePic ? (
                <img 
                  src={profile.profilePic} 
                  alt={profile.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-blue-100 flex items-center justify-center">
                  <span className="text-blue-600 font-semibold text-2xl">
                    {profile.name?.split(' ').map(n => n[0]).join('') || 'U'}
                  </span>
                </div>
              )}
            </div>
            
            <div className="flex-1">
              <h3 className="text-3xl font-bold text-gray-900 mb-2">{profile.name}</h3>
              <p className="text-xl text-gray-600 mb-1">{profile.jobTitle || 'Professional'}</p>
              <p className="text-gray-500 mb-3">{profile.location || 'Location not specified'}</p>
              
              {/* Connection Stats */}
              <div className="flex items-center space-x-6 text-sm text-gray-600">
                <span>{profile.connections?.length || 0} connections</span>
              </div>
            </div>
          </div>

          {/* Bio */}
          {profile.bio && (
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="text-lg font-semibold mb-3 text-gray-900">About</h4>
              <p className="text-gray-700 leading-relaxed">{profile.bio}</p>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Experience */}
            {profile.experience && profile.experience.length > 0 && (
              <div className="bg-white border rounded-lg p-6">
                <h4 className="text-lg font-semibold mb-4 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2h8zM16 10h.01M8 10h.01" />
                  </svg>
                  Experience
                </h4>
                <div className="space-y-4">
                  {profile.experience.map((exp, index) => (
                    <div key={index} className="border-l-3 border-blue-200 pl-4 pb-4">
                      <h5 className="font-semibold text-gray-900">{exp.jobTitle || exp.role}</h5>
                      <p className="text-blue-600 font-medium">{exp.company}</p>
                      <p className="text-sm text-gray-500 mb-2">
                        {exp.startDate && new Date(exp.startDate).getFullYear()} - {exp.endDate ? new Date(exp.endDate).getFullYear() : 'Present'}
                      </p>
                      {exp.description && (
                        <p className="text-gray-700 text-sm">{exp.description}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Education */}
            {profile.education && profile.education.length > 0 && (
              <div className="bg-white border rounded-lg p-6">
                <h4 className="text-lg font-semibold mb-4 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                  </svg>
                  Education
                </h4>
                <div className="space-y-4">
                  {profile.education.map((edu, index) => (
                    <div key={index} className="border-l-3 border-green-200 pl-4">
                      <h5 className="font-semibold text-gray-900">{edu.degree}</h5>
                      <p className="text-green-600 font-medium">{edu.institution}</p>
                      <p className="text-sm text-gray-500">
                        {edu.startYear} - {edu.endYear || 'Present'}
                      </p>
                      {edu.grade && (
                        <p className="text-sm text-gray-600">Grade: {edu.grade}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Skills */}
          {profile.skills && profile.skills.length > 0 && (
            <div className="bg-white border rounded-lg p-6">
              <h4 className="text-lg font-semibold mb-4 flex items-center">
                <svg className="w-5 h-5 mr-2 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
                Skills & Expertise
              </h4>
              <div className="flex flex-wrap gap-2">
                {profile.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Certifications */}
          {profile.certifications && profile.certifications.length > 0 && (
            <div className="bg-white border rounded-lg p-6">
              <h4 className="text-lg font-semibold mb-4 flex items-center">
                <svg className="w-5 h-5 mr-2 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                </svg>
                Certifications
              </h4>
              <div className="space-y-3">
                {profile.certifications.map((cert, index) => (
                  <div key={index} className="border-l-3 border-yellow-200 pl-4">
                    <h5 className="font-semibold text-gray-900">{cert.name}</h5>
                    <p className="text-yellow-600 font-medium">{cert.issuer}</p>
                    {cert.issueDate && (
                      <p className="text-sm text-gray-500">
                        Issued: {new Date(cert.issueDate).toLocaleDateString()}
                        {cert.expiryDate && ` • Expires: ${new Date(cert.expiryDate).toLocaleDateString()}`}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Projects */}
          {profile.projects && profile.projects.length > 0 && (
            <div className="bg-white border rounded-lg p-6">
              <h4 className="text-lg font-semibold mb-4 flex items-center">
                <svg className="w-5 h-5 mr-2 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14-7H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V6a2 2 0 00-2-2zM9 7h6m-6 4h6m-6 4h6" />
                </svg>
                Projects
              </h4>
              <div className="space-y-4">
                {profile.projects.map((project, index) => (
                  <div key={index} className="border-l-3 border-indigo-200 pl-4">
                    <h5 className="font-semibold text-gray-900">{project.title}</h5>
                    {project.description && (
                      <p className="text-gray-700 text-sm mt-1">{project.description}</p>
                    )}
                    {project.technologies && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {project.technologies.map((tech, techIndex) => (
                          <span key={techIndex} className="bg-indigo-100 text-indigo-700 px-2 py-1 rounded text-xs">
                            {tech}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex space-x-4 pt-6 border-t border-white/20 sticky bottom-0 bg-white/80 backdrop-blur-sm">
            {connectionStatus === 'self' ? (
              <div className="flex-1 text-center py-3 text-gray-500">
                This is your profile
              </div>
            ) : connectionStatus === 'connected' ? (
              <button 
                onClick={handleSendMessage}
                disabled={actionLoading}
                className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center"
              >
                {actionLoading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                ) : (
                  <>
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    Send Message
                  </>
                )}
              </button>
            ) : (
              <button 
                onClick={handleConnectionAction}
                disabled={actionLoading || connectionStatus === 'pending'}
                className="flex-1 border border-blue-600 text-blue-600 px-6 py-3 rounded-lg hover:bg-blue-50 transition-colors disabled:opacity-50 flex items-center justify-center"
              >
                {actionLoading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                ) : (
                  <>
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                    </svg>
                    {connectionStatus === 'pending' ? 'Request Sent' : 'Send Connection Request'}
                  </>
                )}
              </button>
            )}
            
            <button 
              onClick={onClose}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileModal;