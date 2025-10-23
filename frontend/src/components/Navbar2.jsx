// src/components/Navbar.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.jpg"; // Assuming you have a logo image'

const Navbar = () => {
    const navigate = useNavigate();

  // Handle brand click
  const handleBrandClick = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
    navigate("/");
  };

  return (
    <div className="shadow py-4 bg-white sticky top-0 z-50">
      <div className="container px-4 2xl:px-20 mx-auto flex justify-between items-center">
        {/* Brand Name instead of logo */}
        <h1 
          className="text-2xl font-bold bg-gradient-to-r from-blue-800 to-teal-700 bg-clip-text text-transparent cursor-pointer hover:from-blue-900 hover:to-teal-800 transition-all"
          onClick={handleBrandClick}
        >
          <img
          src={logo}
          alt="Global Connect Logo"
          className="w-40 h-15"
        />
        </h1>
      </div>
    </div>
  );
};

export default Navbar;
