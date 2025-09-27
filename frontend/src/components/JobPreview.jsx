// src/components/JobPreview.jsx
import React from "react";

const JobPreview = () => {
  const featuredJobs = [
    {
      title: "Senior Software Engineer",
      company: "TechCorp Inc.",
      location: "San Francisco, CA",
      type: "Full-time",
      salary: "$150K - $200K",
      skills: ["React", "Node.js", "Python"],
      posted: "2 days ago",
      applicants: 45
    },
    {
      title: "Product Manager",
      company: "InnovateLab",
      location: "New York, NY",
      type: "Full-time",
      salary: "$120K - $160K",
      skills: ["Strategy", "Analytics", "Leadership"],
      posted: "1 day ago",
      applicants: 32
    },
    {
      title: "UX Designer",
      company: "DesignStudio",
      location: "Remote",
      type: "Contract",
      salary: "$80K - $120K",
      skills: ["Figma", "User Research", "Prototyping"],
      posted: "3 days ago",
      applicants: 28
    }
  ];

  return (
    <section id="jobs" className="py-20 bg-white">
      <div className="container 2xl:px-20 mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
            Featured Job Opportunities
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover amazing career opportunities from top companies looking for talented professionals like you.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {featuredJobs.map((job, index) => (
            <div
              key={index}
              className="bg-white border border-gray-200 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              {/* Job Header */}
              <div className="mb-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-semibold text-gray-800 line-clamp-2">
                    {job.title}
                  </h3>
                  <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                    {job.type}
                  </span>
                </div>
                <p className="text-slate-700 font-medium">{job.company}</p>
                <p className="text-gray-500 text-sm flex items-center">
                  📍 {job.location}
                </p>
              </div>

              {/* Salary */}
              <div className="mb-4">
                <p className="text-gray-800 font-semibold">{job.salary}</p>
              </div>

              {/* Skills */}
              <div className="mb-4">
                <div className="flex flex-wrap gap-2">
                  {job.skills.map((skill, skillIndex) => (
                    <span
                      key={skillIndex}
                      className="bg-slate-100 text-slate-700 text-xs px-3 py-1 rounded-full"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Job Footer */}
              <div className="flex justify-between items-center text-sm text-gray-500 mb-4">
                <span>Posted {job.posted}</span>
                <span>{job.applicants} applicants</span>
              </div>

              {/* Apply Button */}
              <button className="w-full bg-gradient-to-r from-slate-800 to-blue-800 text-white py-3 rounded-lg font-medium hover:from-slate-900 hover:to-blue-900 transition-all">
                Apply Now
              </button>
            </div>
          ))}
        </div>

        {/* View All Jobs Button */}
        <div className="text-center">
          <button 
            onClick={() => window.location.href = '/signup'}
            className="bg-gradient-to-r from-slate-800 to-teal-700 text-white px-10 py-4 rounded-lg font-semibold text-lg hover:from-slate-900 hover:to-teal-800 transition-all shadow-lg hover:shadow-xl"
          >
            View All 10,000+ Jobs
          </button>
        </div>
      </div>
    </section>
  );
};

export default JobPreview;