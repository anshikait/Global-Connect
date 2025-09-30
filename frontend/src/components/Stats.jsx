// src/components/Stats.jsx
import React from "react";

const Stats = () => {
  const stats = [
    {
      number: "50,000+",
      label: "Active Professionals",
      icon: "👥",
      color: "from-slate-700 to-blue-800"
    },
    {
      number: "10,000+",
      label: "Job Opportunities",
      icon: "💼",
      color: "from-blue-800 to-teal-700"
    },
    {
      number: "500+",
      label: "Partner Companies",
      icon: "🏢",
      color: "from-teal-700 to-cyan-800"
    },
    {
      number: "1M+",
      label: "Professional Connections",
      icon: "🤝",
      color: "from-cyan-800 to-slate-800"
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-r from-slate-900 via-blue-900 to-teal-900 text-white">
      <div className="container 2xl:px-20 mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Growing Strong Together
          </h2>
          <p className="text-xl text-slate-200 max-w-2xl mx-auto">
            Join thousands of professionals who are already building their future with Global Connect.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="text-center group hover:scale-105 transition-transform duration-300"
            >
              <div className={`w-20 h-20 bg-gradient-to-r ${stat.color} rounded-full flex items-center justify-center text-3xl mx-auto mb-6 shadow-lg group-hover:shadow-xl transition-shadow`}>
                {stat.icon}
              </div>
              <div className="text-4xl md:text-5xl font-bold mb-2 text-cyan-300">
                {stat.number}
              </div>
              <div className="text-slate-200 text-lg">
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16">
          <h3 className="text-2xl md:text-3xl font-bold mb-6">
            Ready to Join Our Community?
          </h3>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button 
              onClick={() => window.location.href = '/auth'}
              className="bg-white text-slate-900 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-colors shadow-lg"
            >
              Sign Up for Free
            </button>
            <button 
              onClick={() => {
                const element = document.getElementById('features');
                if (element) {
                  element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
              }}
              className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white hover:text-slate-900 transition-all"
            >
              Learn More
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Stats;