import React, { useState } from 'react';
import api from '../../services/api';

const ProfileTab = ({ profileData, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [resumeUploading, setResumeUploading] = useState(false);
  const [profilePicUploading, setProfilePicUploading] = useState(false);
  const [formData, setFormData] = useState({
    name: profileData?.name || '',
    jobTitle: profileData?.jobTitle || '',
    location: profileData?.location || '',
    bio: profileData?.bio || '',
    yearsOfExperience: profileData?.yearsOfExperience || 0,
    skills: profileData?.skills?.join(', ') || ''
  });

  // Update profile info
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        skills: formData.skills.split(',').map((s) => s.trim()),
      };
      const response = await api.put('/users/profile', payload);
      if (response.data.success) {
        alert('Profile updated successfully!');
        onUpdate();
        setIsEditing(false);
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile');
    }
  };

  // Resume upload
  const handleResumeUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      alert('Please select a PDF file');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      alert('File size must be less than 10MB');
      return;
    }

    setResumeUploading(true);
    const form = new FormData();
    form.append('resume', file);

    try {
      const response = await api.post('/users/resume', form, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      if (response.data.success) {
        alert('Resume uploaded successfully!');
        onUpdate();
      }
    } catch (error) {
      console.error('Resume upload error:', error);
      alert('Failed to upload resume');
    } finally {
      setResumeUploading(false);
      event.target.value = '';
    }
  };

  // Resume delete
  const handleResumeDelete = async () => {
    if (!window.confirm('Are you sure you want to delete your resume?')) return;

    try {
      const response = await api.delete('/users/resume');
      if (response.data.success) {
        alert('Resume deleted successfully!');
        onUpdate();
      }
    } catch (error) {
      console.error('Resume delete error:', error);
      alert('Failed to delete resume');
    }
  };

  // Resume view
  const handleResumeView = () => {
    if (profileData?.resume) {
      // Construct full URL for local files (remove /api from URL)
      const baseUrl = (import.meta.env.VITE_API_URL || 'http://localhost:5000/api').replace('/api', '');
      const resumeUrl = profileData.resume.startsWith('http') 
        ? profileData.resume 
        : `${baseUrl}${profileData.resume}`;
      window.open(resumeUrl, '_blank');
    }
  };

  // Profile picture upload
  const handleProfilePicUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      alert('Please select a valid image file (JPEG, PNG, or WebP)');
      return;
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      alert('File size must be less than 5MB');
      return;
    }

    setProfilePicUploading(true);
    const form = new FormData();
    form.append('profilePic', file);

    try {
      const response = await api.post('/users/profile-pic', form, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      if (response.data.success) {
        alert('Profile picture updated successfully!');
        onUpdate();
      }
    } catch (error) {
      console.error('Profile picture upload error:', error);
      alert('Failed to upload profile picture');
    } finally {
      setProfilePicUploading(false);
      event.target.value = '';
    }
  };

  return (
    <div className="space-y-6">
      {/* Profile Picture Section */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center space-x-6">
          <div className="relative">
            <div className="w-24 h-24 rounded-full overflow-hidden bg-gradient-to-br from-blue-100 to-teal-100 flex items-center justify-center ring-4 ring-blue-50">
              {profileData?.profilePic ? (
                <img
                  src={profileData.profilePic}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <svg className="w-12 h-12 text-blue-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              )}
            </div>
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Profile Picture</h3>
            <p className="text-sm text-gray-600 mb-4">
              Upload a professional photo to help others recognize you. Supported formats: JPG, PNG, WebP (max 5MB)
            </p>
            <div className="flex space-x-3">
              <label className="relative cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleProfilePicUpload}
                  className="hidden"
                  disabled={profilePicUploading}
                />
                <span className={`inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  profilePicUploading
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-gradient-to-r from-blue-600 to-teal-600 text-white hover:from-blue-700 hover:to-teal-700'
                }`}>
                  {profilePicUploading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Uploading...
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      {profileData?.profilePic ? 'Change Photo' : 'Upload Photo'}
                    </>
                  )}
                </span>
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Profile Info */}
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
              <label className="block text-sm font-medium">Full Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="mt-1 block w-full border rounded-md px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Job Title</label>
              <input
                type="text"
                value={formData.jobTitle}
                onChange={(e) => setFormData({ ...formData, jobTitle: e.target.value })}
                className="mt-1 block w-full border rounded-md px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Location</label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="mt-1 block w-full border rounded-md px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Bio</label>
              <textarea
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                className="mt-1 block w-full border rounded-md px-3 py-2"
                rows="4"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Years of Experience</label>
              <input
                type="number"
                value={formData.yearsOfExperience}
                onChange={(e) =>
                  setFormData({ ...formData, yearsOfExperience: parseInt(e.target.value) })
                }
                className="mt-1 block w-full border rounded-md px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Skills (comma separated)</label>
              <input
                type="text"
                value={formData.skills}
                onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                className="mt-1 block w-full border rounded-md px-3 py-2"
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
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold">Personal Information</h4>
              <p><span className="text-gray-600">Name:</span> {profileData?.name}</p>
              <p><span className="text-gray-600">Email:</span> {profileData?.email}</p>
              <p><span className="text-gray-600">Job Title:</span> {profileData?.jobTitle || 'Not set'}</p>
              <p><span className="text-gray-600">Location:</span> {profileData?.location || 'Not set'}</p>
              <p><span className="text-gray-600">Experience:</span> {profileData?.yearsOfExperience || 0} years</p>
            </div>
            <div>
              <h4 className="font-semibold">About</h4>
              <p className="text-gray-700">{profileData?.bio || 'No bio added yet.'}</p>
            </div>
          </div>
        )}
      </div>

      {/* Skills */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4">Skills</h3>
        <div className="flex flex-wrap gap-2">
          {profileData?.skills?.length > 0 ? (
            profileData.skills.map((skill, i) => (
              <span key={i} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                {skill}
              </span>
            ))
          ) : (
            <p className="text-gray-500">No skills added yet.</p>
          )}
        </div>
      </div>

      {/* Resume */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4">Resume</h3>
        {profileData?.resume ? (
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <p className="font-medium">{profileData.resumeOriginalName || 'Resume.pdf'}</p>
              <p className="text-sm text-gray-500">
                Uploaded on{' '}
                {profileData.resumeUploadedAt
                  ? new Date(profileData.resumeUploadedAt).toLocaleDateString()
                  : 'Unknown date'}
              </p>
            </div>
            <div className="flex space-x-3">
              <button onClick={handleResumeView} className="text-blue-600 hover:underline">View</button>
              <button onClick={handleResumeDelete} className="text-red-600 hover:underline">Delete</button>
            </div>
          </div>
        ) : (
          <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
            <p className="text-gray-600">No resume uploaded</p>
            <p className="text-xs text-gray-500">Upload a PDF file (max 10MB)</p>
            <label className="cursor-pointer mt-4 inline-block">
              <span className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                {resumeUploading ? 'Uploading...' : 'Upload Resume'}
              </span>
              <input
                type="file"
                accept=".pdf"
                onChange={handleResumeUpload}
                disabled={resumeUploading}
                className="hidden"
              />
            </label>
          </div>
        )}
        {profileData?.resume && (
          <div className="mt-3 text-center">
            <label className="cursor-pointer">
              <span className="text-blue-600 hover:underline">
                {resumeUploading ? 'Uploading...' : 'Replace Resume'}
              </span>
              <input
                type="file"
                accept=".pdf"
                onChange={handleResumeUpload}
                disabled={resumeUploading}
                className="hidden"
              />
            </label>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileTab;
