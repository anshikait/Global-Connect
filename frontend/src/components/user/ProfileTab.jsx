import React, { useState } from 'react';

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

export default ProfileTab;