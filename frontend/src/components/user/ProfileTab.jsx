import React, { useState } from 'react';
import api from '../../services/api';

const ProfileTab = ({ profileData, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [resumeUploading, setResumeUploading] = useState(false);
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
      window.open(profileData.resume, '_blank');
    }
  };

  // Resume download
  const handleResumeDownload = () => {
    if (profileData?.resume) {
      const link = document.createElement('a');
      link.href = profileData.resume;
      link.download = profileData.resumeOriginalName || 'resume.pdf';
      link.setAttribute('target', '_blank');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="space-y-6">
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
              <button onClick={handleResumeDownload} className="text-green-600 hover:underline">Download</button>
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
