// src/components/Footer.jsx
import React from "react";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container px-4 2xl:px-20 mx-auto py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <h2 className="text-2xl font-bold text-cyan-400 mb-4">Global Connect</h2>
            <p className="text-gray-300 mb-6 leading-relaxed">
              The premier professional networking platform connecting talent with opportunities worldwide.
            </p>
            <div className="flex gap-4">
              <a href="https://facebook.com" target="_blank" rel="noreferrer" className="w-10 h-10 bg-gradient-to-r from-slate-700 to-blue-800 rounded-full flex items-center justify-center hover:from-slate-800 hover:to-blue-900 transition-all">
                <span className="text-white font-semibold">f</span>
              </a>
              <a href="https://twitter.com" target="_blank" rel="noreferrer" className="w-10 h-10 bg-gradient-to-r from-blue-800 to-teal-700 rounded-full flex items-center justify-center hover:from-blue-900 hover:to-teal-800 transition-all">
                <span className="text-white font-semibold">t</span>
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="w-10 h-10 bg-gradient-to-r from-teal-700 to-cyan-800 rounded-full flex items-center justify-center hover:from-teal-800 hover:to-cyan-900 transition-all">
                <span className="text-white font-semibold">in</span>
              </a>
            </div>
          </div>

          {/* Platform Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Platform</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Find Jobs</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Post Jobs</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Network</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Messaging</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Feed</a></li>
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Company</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">About Us</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Careers</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Press</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Blog</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Contact</a></li>
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Support</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Help Center</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Terms of Service</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Cookie Policy</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Guidelines</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-700 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            © {new Date().getFullYear()} Global Connect. All rights reserved.
          </p>
          <p className="text-gray-400 text-sm mt-4 md:mt-0">
            Developed by Group 02
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
