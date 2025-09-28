import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { userAuthService } from '../services/authService';
import LoadingSpinner from '../components/LoadingSpinner';

const UserDashboard = () => {
  const { user, logout } = useAuth();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('feed');

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const response = await userAuthService.getProfile();
      setProfileData(response.data.user);
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100">
      {/* Navigation Header */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-800 to-teal-700 bg-clip-text text-transparent">Global Connect</h1>
              <div className="ml-10 flex space-x-4">
                <button
                  onClick={() => setActiveTab('feed')}
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    activeTab === 'feed' 
                      ? 'bg-blue-100 text-blue-700' 
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Feed
                </button>
                <button
                  onClick={() => setActiveTab('jobs')}
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    activeTab === 'jobs' 
                      ? 'bg-blue-100 text-blue-700' 
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Jobs
                </button>
                <button
                  onClick={() => setActiveTab('network')}
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    activeTab === 'network' 
                      ? 'bg-blue-100 text-blue-700' 
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Network
                </button>
                <button
                  onClick={() => setActiveTab('profile')}
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    activeTab === 'profile' 
                      ? 'bg-blue-100 text-blue-700' 
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Profile
                </button>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-700">Welcome, {user?.name}</span>
              <button
                onClick={handleLogout}
                className="bg-red-600 text-white px-4 py-2 rounded-md text-sm hover:bg-red-700"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Sidebar - Profile Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="text-center">
                <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  {profileData?.profilePic ? (
                    <img
                      src={profileData.profilePic}
                      alt="Profile"
                      className="w-20 h-20 rounded-full object-cover"
                    />
                  ) : (
                    <svg className="w-12 h-12 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  )}
                </div>
                <h3 className="text-lg font-semibold text-gray-900">{profileData?.name}</h3>
                <p className="text-sm text-gray-600">{profileData?.jobTitle || 'Job Seeker'}</p>
                <p className="text-sm text-gray-500">{profileData?.location || 'Location not set'}</p>
              </div>
              
              <div className="mt-6 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Profile Completeness</span>
                  <span className="text-blue-600">
                    {profileData?.isProfileComplete ? '100%' : '60%'}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-blue-800 to-blue-900 h-2 rounded-full" 
                    style={{ width: profileData?.isProfileComplete ? '100%' : '60%' }}
                  ></div>
                </div>
                {!profileData?.isProfileComplete && (
                  <button 
                    onClick={() => setActiveTab('profile')}
                    className="w-full text-sm text-blue-600 hover:text-blue-800"
                  >
                    Complete your profile
                  </button>
                )}
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Connections</span>
                    <span className="font-medium">{profileData?.connections?.length || 0}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Applications</span>
                    <span className="font-medium">{profileData?.applications?.length || 0}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Saved Jobs</span>
                    <span className="font-medium">{profileData?.savedJobs?.length || 0}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-3">
            {activeTab === 'feed' && <FeedTab />}
            {activeTab === 'jobs' && <JobsTab profileData={profileData} />}
            {activeTab === 'network' && <NetworkTab profileData={profileData} />}
            {activeTab === 'profile' && <ProfileTab profileData={profileData} onUpdate={fetchUserProfile} />}
          </div>
        </div>
      </div>
    </div>
  );
};

// Feed Tab Component
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

// Jobs Tab Component
const JobsTab = ({ profileData }) => (
  <div className="space-y-6">
    {/* Job Search */}
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold mb-4">Find Jobs</h3>
      <div className="flex space-x-4">
        <input
          type="text"
          placeholder="Search for jobs..."
          className="flex-1 p-3 border rounded-lg"
        />
        <input
          type="text"
          placeholder="Location"
          className="w-40 p-3 border rounded-lg"
        />
        <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700">
          Search
        </button>
      </div>
    </div>

    {/* My Applications */}
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold mb-4">My Applications</h3>
      {profileData?.applications?.length > 0 ? (
        <div className="space-y-4">
          {profileData.applications.map((app, index) => (
            <div key={index} className="border rounded-lg p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-semibold">Software Engineer</h4>
                  <p className="text-gray-600">Tech Company Inc.</p>
                  <p className="text-sm text-gray-500">Applied on {new Date(app.appliedAt).toLocaleDateString()}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm ${
                  app.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                  app.status === 'reviewed' ? 'bg-blue-100 text-blue-800' :
                  app.status === 'shortlisted' ? 'bg-green-100 text-green-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500">No applications yet. Start applying to jobs!</p>
      )}
    </div>

    {/* Recommended Jobs */}
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold mb-4">Recommended for You</h3>
      <div className="space-y-4">
        {[
          { title: 'Frontend Developer', company: 'StartupCo', location: 'Remote', salary: '$70k - $90k' },
          { title: 'Full Stack Engineer', company: 'TechFirm', location: 'New York', salary: '$80k - $120k' },
          { title: 'React Developer', company: 'WebAgency', location: 'San Francisco', salary: '$75k - $100k' }
        ].map((job, index) => (
          <div key={index} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-semibold text-blue-600">{job.title}</h4>
                <p className="text-gray-800">{job.company}</p>
                <p className="text-sm text-gray-600">{job.location} • {job.salary}</p>
              </div>
              <div className="space-x-2">
                <button className="text-blue-600 hover:text-blue-800 text-sm">Save</button>
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700">
                  Apply
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

// Network Tab Component
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

// Profile Tab Component
const ProfileTab = ({ profileData, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: profileData?.name || '',
    jobTitle: profileData?.jobTitle || '',
    location: profileData?.location || '',
    bio: profileData?.bio || '',
    yearsOfExperience: profileData?.yearsOfExperience || 0,
    skills: profileData?.skills?.join(', ') || ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Here you would call the API to update profile
      console.log('Updating profile:', formData);
      setIsEditing(false);
      onUpdate();
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-start">
          <h3 className="text-lg font-semibold">Profile Information</h3>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="text-blue-600 hover:text-blue-800 text-sm"
          >
            {isEditing ? 'Cancel' : 'Edit Profile'}
          </button>
        </div>

        {isEditing ? (
          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Full Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="mt-1 block w-full border rounded-md px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Job Title</label>
              <input
                type="text"
                value={formData.jobTitle}
                onChange={(e) => setFormData({...formData, jobTitle: e.target.value})}
                className="mt-1 block w-full border rounded-md px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Location</label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({...formData, location: e.target.value})}
                className="mt-1 block w-full border rounded-md px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Bio</label>
              <textarea
                value={formData.bio}
                onChange={(e) => setFormData({...formData, bio: e.target.value})}
                className="mt-1 block w-full border rounded-md px-3 py-2"
                rows="4"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Years of Experience</label>
              <input
                type="number"
                value={formData.yearsOfExperience}
                onChange={(e) => setFormData({...formData, yearsOfExperience: parseInt(e.target.value)})}
                className="mt-1 block w-full border rounded-md px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Skills (comma separated)</label>
              <input
                type="text"
                value={formData.skills}
                onChange={(e) => setFormData({...formData, skills: e.target.value})}
                className="mt-1 block w-full border rounded-md px-3 py-2"
                placeholder="React, Node.js, Python, etc."
              />
            </div>
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
            >
              Save Changes
            </button>
          </form>
        ) : (
          <div className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-gray-900">Personal Information</h4>
                <div className="mt-3 space-y-2">
                  <p><span className="text-gray-600">Name:</span> {profileData?.name}</p>
                  <p><span className="text-gray-600">Email:</span> {profileData?.email}</p>
                  <p><span className="text-gray-600">Job Title:</span> {profileData?.jobTitle || 'Not set'}</p>
                  <p><span className="text-gray-600">Location:</span> {profileData?.location || 'Not set'}</p>
                  <p><span className="text-gray-600">Experience:</span> {profileData?.yearsOfExperience || 0} years</p>
                </div>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">About</h4>
                <p className="mt-3 text-gray-700">
                  {profileData?.bio || 'No bio added yet. Click Edit Profile to add your professional summary.'}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Skills Section */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4">Skills</h3>
        <div className="flex flex-wrap gap-2">
          {profileData?.skills?.length > 0 ? (
            profileData.skills.map((skill, index) => (
              <span
                key={index}
                className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
              >
                {skill}
              </span>
            ))
          ) : (
            <p className="text-gray-500">No skills added yet. Update your profile to add skills.</p>
          )}
        </div>
      </div>

      {/* Experience Section */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4">Experience</h3>
        {profileData?.experience?.length > 0 ? (
          <div className="space-y-4">
            {profileData.experience.map((exp, index) => (
              <div key={index} className="border-l-2 border-blue-500 pl-4">
                <h4 className="font-semibold">{exp.role}</h4>
                <p className="text-gray-600">{exp.company}</p>
                <p className="text-sm text-gray-500">
                  {new Date(exp.from).toLocaleDateString()} - {exp.current ? 'Present' : new Date(exp.to).toLocaleDateString()}
                </p>
                {exp.description && <p className="mt-2 text-gray-700">{exp.description}</p>}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No experience added yet.</p>
        )}
      </div>

      {/* Education Section */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4">Education</h3>
        {profileData?.education?.length > 0 ? (
          <div className="space-y-4">
            {profileData.education.map((edu, index) => (
              <div key={index} className="border-l-2 border-green-500 pl-4">
                <h4 className="font-semibold">{edu.degree}</h4>
                <p className="text-gray-600">{edu.school}</p>
                <p className="text-sm text-gray-500">
                  {new Date(edu.from).toLocaleDateString()} - {edu.current ? 'Present' : new Date(edu.to).toLocaleDateString()}
                </p>
                {edu.description && <p className="mt-2 text-gray-700">{edu.description}</p>}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No education added yet.</p>
        )}
      </div>
    </div>
  );
};

export default UserDashboard;