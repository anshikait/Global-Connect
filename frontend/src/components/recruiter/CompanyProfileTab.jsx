import React, { useState } from 'react';

const CompanyProfileTab = ({ profileData, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    companyName: profileData?.companyName || '',
    companyDescription: profileData?.companyDescription || '',
    industry: profileData?.industry || '',
    companySize: profileData?.companySize || '',
    website: profileData?.website || '',
    headquarters: profileData?.headquarters || '',
    foundedYear: profileData?.foundedYear || '',
    benefits: profileData?.benefits?.join(', ') || ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Here you would call the API to update company profile
      console.log('Updating company profile:', formData);
      setIsEditing(false);
      onUpdate();
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Company Profile</h2>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="text-green-600 hover:text-green-800"
        >
          {isEditing ? 'Cancel' : 'Edit Profile'}
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        {isEditing ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">Company Name</label>
                <input
                  type="text"
                  value={formData.companyName}
                  onChange={(e) => setFormData({...formData, companyName: e.target.value})}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Industry</label>
                <input
                  type="text"
                  value={formData.industry}
                  onChange={(e) => setFormData({...formData, industry: e.target.value})}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Company Size</label>
                <select
                  value={formData.companySize}
                  onChange={(e) => setFormData({...formData, companySize: e.target.value})}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                >
                  <option value="1-10">1-10 employees</option>
                  <option value="11-50">11-50 employees</option>
                  <option value="51-200">51-200 employees</option>
                  <option value="201-500">201-500 employees</option>
                  <option value="501-1000">501-1000 employees</option>
                  <option value="1000+">1000+ employees</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Website</label>
                <input
                  type="url"
                  value={formData.website}
                  onChange={(e) => setFormData({...formData, website: e.target.value})}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Headquarters</label>
                <input
                  type="text"
                  value={formData.headquarters}
                  onChange={(e) => setFormData({...formData, headquarters: e.target.value})}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Founded Year</label>
                <input
                  type="number"
                  value={formData.foundedYear}
                  onChange={(e) => setFormData({...formData, foundedYear: parseInt(e.target.value)})}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Company Description</label>
              <textarea
                value={formData.companyDescription}
                onChange={(e) => setFormData({...formData, companyDescription: e.target.value})}
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                rows="4"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Benefits (comma separated)</label>
              <input
                type="text"
                value={formData.benefits}
                onChange={(e) => setFormData({...formData, benefits: e.target.value})}
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                placeholder="Health Insurance, Remote Work, Flexible Hours, etc."
              />
            </div>
            
            <button
              type="submit"
              className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700"
            >
              Save Changes
            </button>
          </form>
        ) : (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Company Information</h3>
                <div className="space-y-3">
                  <div>
                    <span className="text-sm font-medium text-gray-500">Company Name:</span>
                    <p className="text-gray-900">{profileData?.companyName}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500">Industry:</span>
                    <p className="text-gray-900">{profileData?.industry}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500">Company Size:</span>
                    <p className="text-gray-900">{profileData?.companySize} employees</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500">Website:</span>
                    <p className="text-gray-900">{profileData?.website || 'Not provided'}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500">Headquarters:</span>
                    <p className="text-gray-900">{profileData?.headquarters || 'Not provided'}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500">Founded:</span>
                    <p className="text-gray-900">{profileData?.foundedYear || 'Not provided'}</p>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">About Company</h3>
                <p className="text-gray-700">
                  {profileData?.companyDescription || 'No company description provided yet.'}
                </p>
              </div>
            </div>
            
            {profileData?.benefits && profileData.benefits.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Benefits & Perks</h3>
                <div className="flex flex-wrap gap-2">
                  {profileData.benefits.map((benefit, index) => (
                    <span
                      key={index}
                      className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm"
                    >
                      {benefit}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CompanyProfileTab;