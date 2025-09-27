// src/components/Navbar.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Smooth scroll function for same-page navigation
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
    // Close mobile menu after navigation
    setIsMobileMenuOpen(false);
  };

  // Handle brand click - scroll to top
  const handleBrandClick = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
    setIsMobileMenuOpen(false);
  };

  // Toggle mobile menu
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <div className="shadow py-4 bg-white sticky top-0 z-50">
      <div className="container px-4 2xl:px-20 mx-auto flex justify-between items-center">
        {/* Brand Name instead of logo */}
        <h1 
          className="text-2xl font-bold bg-gradient-to-r from-blue-800 to-teal-700 bg-clip-text text-transparent cursor-pointer hover:from-blue-900 hover:to-teal-800 transition-all"
          onClick={handleBrandClick}
        >
          Global Connect
        </h1>

        {/* Navigation links - Desktop */}
        <div className="hidden md:flex gap-8 text-gray-700 font-medium">
          <button 
            onClick={() => scrollToSection('features')}
            className="hover:text-blue-800 transition-colors cursor-pointer"
          >
            Features
          </button>
          <button 
            onClick={() => scrollToSection('how-it-works')}
            className="hover:text-blue-800 transition-colors cursor-pointer"
          >
            How It Works
          </button>
          <button 
            onClick={() => scrollToSection('jobs')}
            className="hover:text-blue-800 transition-colors cursor-pointer"
          >
            Jobs
          </button>
          <button 
            onClick={() => scrollToSection('testimonials')}
            className="hover:text-blue-800 transition-colors cursor-pointer"
          >
            Reviews
          </button>
        </div>

        {/* Auth buttons - Desktop */}
        <div className="hidden md:flex gap-4 items-center">
          <button 
            className="text-gray-700 hover:text-blue-800 font-medium transition-colors"
            onClick={() => navigate('/login')}
          >
            Login
          </button>
          <button 
            className="bg-gradient-to-r from-blue-800 to-teal-700 text-white px-6 py-2 rounded-lg hover:from-blue-900 hover:to-teal-800 transition-all shadow-lg"
            onClick={() => navigate('/signup')}
          >
            Sign Up
          </button>
        </div>

        {/* Mobile menu button */}
        <div className="md:hidden">
          <button 
            onClick={toggleMobileMenu}
            className="text-gray-700 hover:text-blue-800 p-2"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200 shadow-lg">
          <div className="container px-4 2xl:px-20 mx-auto py-4">
            <div className="flex flex-col space-y-4">
              <button 
                onClick={() => scrollToSection('features')}
                className="text-gray-700 hover:text-blue-800 transition-colors text-left py-2"
              >
                Features
              </button>
              <button 
                onClick={() => scrollToSection('how-it-works')}
                className="text-gray-700 hover:text-blue-800 transition-colors text-left py-2"
              >
                How It Works
              </button>
              <button 
                onClick={() => scrollToSection('jobs')}
                className="text-gray-700 hover:text-blue-800 transition-colors text-left py-2"
              >
                Jobs
              </button>
              <button 
                onClick={() => scrollToSection('testimonials')}
                className="text-gray-700 hover:text-blue-800 transition-colors text-left py-2"
              >
                Reviews
              </button>
              
              {/* Mobile Auth buttons */}
              <div className="flex flex-col space-y-2 pt-4 border-t border-gray-200">
                <button 
                  className="text-gray-700 hover:text-blue-800 font-medium transition-colors text-left py-2"
                  onClick={() => {
                    navigate('/login');
                    setIsMobileMenuOpen(false);
                  }}
                >
                  Login
                </button>
                <button 
                  className="bg-gradient-to-r from-blue-800 to-teal-700 text-white px-6 py-3 rounded-lg hover:from-blue-900 hover:to-teal-800 transition-all text-center"
                  onClick={() => {
                    navigate('/signup');
                    setIsMobileMenuOpen(false);
                  }}
                >
                  Sign Up
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Navbar;
