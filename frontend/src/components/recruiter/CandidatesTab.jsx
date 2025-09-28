import React from 'react';

const CandidatesTab = () => (
  <div className="space-y-6">
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Search Candidates</h2>
    </div>

    {/* Search Filters */}
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <input
          type="text"
          placeholder="Search by skills, title..."
          className="border border-gray-300 rounded-md px-3 py-2"
        />
        <select className="border border-gray-300 rounded-md px-3 py-2">
          <option>All Locations</option>
          <option>New York</option>
          <option>San Francisco</option>
          <option>Remote</option>
        </select>
        <select className="border border-gray-300 rounded-md px-3 py-2">
          <option>Experience Level</option>
          <option>Entry Level</option>
          <option>Mid Level</option>
          <option>Senior Level</option>
        </select>
        <button className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700">
          Search
        </button>
      </div>
    </div>

    {/* Candidates List */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[
        { name: 'Alice Johnson', title: 'Frontend Developer', location: 'New York', experience: '3 years', skills: ['React', 'JavaScript', 'CSS'] },
        { name: 'Bob Smith', title: 'Full Stack Engineer', location: 'San Francisco', experience: '5 years', skills: ['Node.js', 'React', 'MongoDB'] },
        { name: 'Carol Brown', title: 'UI/UX Designer', location: 'Remote', experience: '4 years', skills: ['Figma', 'Adobe XD', 'Prototyping'] },
        { name: 'David Wilson', title: 'Backend Developer', location: 'Chicago', experience: '6 years', skills: ['Python', 'Django', 'PostgreSQL'] },
        { name: 'Eva Martinez', title: 'Data Scientist', location: 'Austin', experience: '2 years', skills: ['Python', 'Machine Learning', 'SQL'] },
        { name: 'Frank Taylor', title: 'DevOps Engineer', location: 'Seattle', experience: '7 years', skills: ['AWS', 'Docker', 'Kubernetes'] }
      ].map((candidate, index) => (
        <div key={index} className="bg-white rounded-lg shadow-md p-6">
          <div className="text-center mb-4">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-blue-600 font-semibold">
                {candidate.name.split(' ').map(n => n[0]).join('')}
              </span>
            </div>
            <h3 className="font-semibold text-gray-900">{candidate.name}</h3>
            <p className="text-gray-600">{candidate.title}</p>
            <p className="text-sm text-gray-500">{candidate.location} • {candidate.experience}</p>
          </div>
          
          <div className="mb-4">
            <h4 className="text-sm font-medium text-gray-900 mb-2">Skills</h4>
            <div className="flex flex-wrap gap-1">
              {candidate.skills.map((skill, skillIndex) => (
                <span
                  key={skillIndex}
                  className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
          
          <div className="flex space-x-2">
            <button className="flex-1 bg-green-600 text-white py-2 px-3 rounded-md text-sm hover:bg-green-700">
              View Profile
            </button>
            <button className="flex-1 border border-green-600 text-green-600 py-2 px-3 rounded-md text-sm hover:bg-green-50">
              Save
            </button>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default CandidatesTab;