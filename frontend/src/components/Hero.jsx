// src/components/Hero.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

const Hero = () => {
  const navigate = useNavigate();

  return (
    <div className="container 2xl:px-20 mx-auto">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-slate-800 via-blue-900 to-teal-900 text-white py-20 px-8 mx-2 rounded-2xl my-10 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-20 h-20 border border-white rounded-full"></div>
          <div className="absolute top-32 right-16 w-16 h-16 border border-white rounded-full"></div>
          <div className="absolute bottom-20 left-1/4 w-12 h-12 border border-white rounded-full"></div>
        </div>
        
        <div className="text-center relative z-10">
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
            Connect. Network. 
            <span className="text-yellow-300"> Grow.</span>
          </h1>
          <p className="text-lg md:text-xl mb-8 max-w-3xl mx-auto text-slate-200">
            Join the premier professional networking platform where career opportunities meet meaningful connections. 
            Build your network, showcase your expertise, and discover your next career milestone.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <button 
              onClick={() => navigate('/signup')}
              className="bg-white text-slate-800 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-all shadow-lg"
            >
              Join Global Connect
            </button>
            <button 
              onClick={() => {
                const element = document.getElementById('features');
                if (element) {
                  element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
              }}
              className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white hover:text-slate-800 transition-all"
            >
              Explore Features
            </button>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-cyan-300">50K+</div>
              <div className="text-slate-200">Active Professionals</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-cyan-300">10K+</div>
              <div className="text-slate-200">Job Opportunities</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-cyan-300">500+</div>
              <div className="text-slate-200">Companies</div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default Hero;
