import React from 'react';
import { Link } from 'react-router-dom';

const AuthSelection = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-teal-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-800 to-teal-700 bg-clip-text text-transparent mb-4">
            Welcome to Global Connect
          </h1>
          <p className="text-xl text-slate-600">
            Choose how you'd like to join our platform
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Job Seeker Card */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
            <div className="bg-gradient-to-r from-blue-800 to-blue-900 px-6 py-4">
              <h2 className="text-2xl font-bold text-white">Job Seeker</h2>
              <p className="text-blue-100 mt-1">Find your dream job</p>
            </div>
            
            <div className="p-6">
              <div className="mb-6">
                <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-blue-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2V6" />
                  </svg>
                </div>
                
                <ul className="space-y-3 text-slate-600">
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-teal-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Browse thousands of job opportunities
                  </li>
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-teal-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Build your professional profile
                  </li>
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-teal-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Connect with recruiters
                  </li>
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-teal-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Track your applications
                  </li>
                </ul>
              </div>
              
              <div className="space-y-3">
                <Link
                  to="/user/signup"
                  className="w-full bg-gradient-to-r from-blue-800 to-blue-900 text-white py-3 px-4 rounded-lg font-semibold hover:from-blue-900 hover:to-blue-800 transition-all duration-200 block text-center shadow-lg"
                >
                  Sign Up as Job Seeker
                </Link>
                
                <Link
                  to="/user/login"
                  className="w-full bg-white text-blue-800 py-3 px-4 rounded-lg font-semibold border-2 border-blue-800 hover:bg-blue-50 transition-colors duration-200 block text-center"
                >
                  Already have an account? Sign In
                </Link>
              </div>
            </div>
          </div>

          {/* Recruiter Card */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
            <div className="bg-gradient-to-r from-teal-700 to-teal-800 px-6 py-4">
              <h2 className="text-2xl font-bold text-white">Recruiter</h2>
              <p className="text-teal-100 mt-1">Find top talent</p>
            </div>
            
            <div className="p-6">
              <div className="mb-6">
                <div className="w-16 h-16 bg-teal-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-teal-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                
                <ul className="space-y-3 text-slate-600">
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-teal-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Post job openings
                  </li>
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-teal-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Search candidate profiles
                  </li>
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-teal-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Manage applications
                  </li>
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-teal-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Build company profile
                  </li>
                </ul>
              </div>
              
              <div className="space-y-3">
                <Link
                  to="/recruiter/signup"
                  className="w-full bg-gradient-to-r from-teal-700 to-teal-800 text-white py-3 px-4 rounded-lg font-semibold hover:from-teal-800 hover:to-teal-900 transition-all duration-200 block text-center shadow-lg"
                >
                  Sign Up as Recruiter
                </Link>
                
                <Link
                  to="/recruiter/login"
                  className="w-full bg-white text-teal-700 py-3 px-4 rounded-lg font-semibold border-2 border-teal-700 hover:bg-teal-50 transition-colors duration-200 block text-center"
                >
                  Already have an account? Sign In
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center mt-12">
          <Link
            to="/"
            className="text-slate-500 hover:text-slate-700 font-medium"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AuthSelection;