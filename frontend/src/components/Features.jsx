// src/components/Features.jsx
import React from "react";

const Features = () => {
  const features = [
    {
      icon: "👥",
      title: "Professional Networking",
      description: "Connect with industry professionals, expand your network, and build meaningful business relationships.",
      color: "from-slate-700 to-blue-800"
    },
    {
      icon: "💼",
      title: "Career Opportunities",
      description: "Discover and apply to thousands of job openings from top companies worldwide.",
      color: "from-blue-800 to-teal-700"
    },
    {
      icon: "💬",
      title: "Real-time Chat",
      description: "Engage in instant messaging with your connections and potential collaborators.",
      color: "from-teal-700 to-cyan-800"
    },
    {
      icon: "📱",
      title: "Social Feed",
      description: "Share professional updates, insights, and achievements with your network.",
      color: "from-cyan-800 to-slate-700"
    },
    {
      icon: "🎯",
      title: "Skill Showcase",
      description: "Highlight your expertise, get endorsements, and build your professional brand.",
      color: "from-slate-800 to-blue-900"
    },
    {
      icon: "🔍",
      title: "Smart Search",
      description: "Find the right people, jobs, and opportunities with our advanced search filters.",
      color: "from-blue-900 to-teal-800"
    }
  ];

  return (
    <section id="features" className="py-20 bg-gray-50">
      <div className="container 2xl:px-20 mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
            Why Choose Global Connect?
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Everything you need to advance your career and build professional relationships in one powerful platform.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
            >
              <div className={`w-16 h-16 bg-gradient-to-r ${feature.color} rounded-full flex items-center justify-center text-3xl mb-6`}>
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                {feature.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;