// src/components/HowItWorks.jsx
import React from "react";

const HowItWorks = () => {
  const steps = [
    {
      step: "1",
      title: "Create Your Profile",
      description: "Build a comprehensive professional profile showcasing your skills, experience, and achievements.",
      icon: "👤"
    },
    {
      step: "2",
      title: "Connect & Network",
      description: "Send connection requests to professionals in your field and expand your network.",
      icon: "🤝"
    },
    {
      step: "3",
      title: "Engage & Share",
      description: "Share updates, comment on posts, and engage with your professional community.",
      icon: "📢"
    },
    {
      step: "4",
      title: "Discover Opportunities",
      description: "Browse job listings, apply to positions, and get discovered by recruiters.",
      icon: "🚀"
    }
  ];

  return (
    <section id="how-it-works" className="py-20 bg-white">
      <div className="container 2xl:px-20 mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
            How It Works
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Get started on your professional journey in just four simple steps.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="text-center relative">
              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-12 left-1/2 w-full h-0.5 bg-gradient-to-r from-slate-800 to-blue-800 z-0 transform translate-x-0"></div>
              )}
              
              <div className="relative z-10">
                {/* Step Number */}
                <div className="w-24 h-24 bg-gradient-to-r from-slate-800 to-blue-800 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-6 shadow-lg">
                  {step.step}
                </div>
                
                {/* Icon */}
                <div className="text-4xl mb-4">{step.icon}</div>
                
                {/* Content */}
                <h3 className="text-xl font-semibold text-gray-800 mb-4">
                  {step.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="text-center mt-16">
          <button 
            onClick={() => window.location.href = '/signup'}
            className="bg-gradient-to-r from-slate-800 to-teal-700 text-white px-10 py-4 rounded-lg font-semibold text-lg hover:from-slate-900 hover:to-teal-800 transition-all shadow-lg hover:shadow-xl"
          >
            Start Your Journey Today
          </button>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;