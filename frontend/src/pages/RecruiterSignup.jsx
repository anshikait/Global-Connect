import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { recruiterAuthService } from '../services/authService';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';
import recSign from "../assets/recSign.jpg";
import Navbar2 from '../components/Navbar2';

const RecruiterSignup = () => {
  const [formData, setFormData] = useState({
    companyName: '',
    email: '',
    password: '',
    confirmPassword: '',
    industry: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const navigate = useNavigate();
  const { login, isAuthenticated, isRecruiter, logout, user } = useAuth();

  useEffect(() => {
    if (isAuthenticated() && isRecruiter()) {
      navigate('/recruiter-dashboard');
    }
  }, [isAuthenticated, isRecruiter, navigate]);

  const industries = [
    'Technology', 'Healthcare', 'Finance', 'Education', 'Manufacturing',
    'Retail', 'Construction', 'Transportation', 'Hospitality', 'Real Estate',
    'Media & Entertainment', 'Non-profit', 'Government', 'Consulting',
    'Marketing & Advertising', 'Other'
  ];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      const response = await recruiterAuthService.register({
        companyName: formData.companyName,
        email: formData.email,
        password: formData.password,
        industry: formData.industry
      });

      login(response.data.user, response.data.token);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Navbar2 />
    <div className="flex flex-col lg:flex-row min-h-screen bg-background-light dark:bg-background-dark font-display">
      {/* Form Section */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-8 lg:p-8">
        <div className="w-full max-w-md">
          <div className="text-center mb-10">
            <h2 className="text-5xl font-bold text-blue-600">Create Recruiter Account</h2>
            <p className="mt-2 text-gray-600 dark:text-gray-400 text-xl">
              Join Global Connect as a recruiter to find top talent
            </p>
          </div>

          {isAuthenticated() && !isRecruiter() && (
            <div className="mb-6 bg-yellow-50 border border-yellow-200 rounded-md p-4">
              <p className="text-sm text-yellow-700">
                You're currently logged in as a job seeker ({user?.email}). Please logout first to create a recruiter account.
              </p>
              <div className="mt-2 flex gap-2">
                <button
                  className="bg-yellow-200 px-3 py-1 rounded-md"
                  onClick={() => {
                    logout();
                    setError('');
                  }}
                >
                  Logout
                </button>
                <button
                  className="bg-yellow-200 px-3 py-1 rounded-md"
                  onClick={() => navigate('/user-dashboard')}
                >
                  Go to Dashboard
                </button>
              </div>
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm">
                {error}
              </div>
            )}

            <input
              type="text"
              name="companyName"
              value={formData.companyName}
              onChange={handleChange}
              placeholder="Company Name"
              className="form-input w-full p-4 rounded-lg bg-gray-50 text-gray-900 placeholder-gray-500 border border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/30 pr-10"
              required
            />

            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Company Email Address"
              className="form-input w-full p-4 rounded-lg bg-gray-50 text-gray-900 placeholder-gray-500 border border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/30 pr-10"
              required
            />

            <select
              name="industry"
              value={formData.industry}
              onChange={handleChange}
              className="form-input w-full p-4 rounded-lg bg-gray-50 text-gray-900 placeholder-gray-500 border border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/30 pr-10"
              required
            >
              <option value="" disabled>Select Industry</option>
              {industries.map((ind) => (
                <option key={ind} value={ind}>{ind}</option>
              ))}
            </select>

            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Password"
                className="form-input w-full p-4 rounded-lg bg-gray-50 text-gray-900 placeholder-gray-500 border border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/30 pr-10"
                required
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "🙈" : "👁️"}
              </button>
            </div>

            <div className="relative">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm Password"
                className="form-input w-full p-4 rounded-lg bg-gray-50 text-gray-900 placeholder-gray-500 border border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/30 pr-10"
                required
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? "🙈" : "👁️"}
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full text-xl bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-4 rounded-lg hover:bg-primary/90 transition"
            >
              {loading ? <LoadingSpinner size="sm" /> : 'Create Recruiter Account'}
            </button>
          </form>

          <div className="font-medium text-base mt-8 text-center text-gray-900 dark:text-gray-400">
            <p>
              Already have an account?{' '}
              <Link className="text-blue-600 font-medium text-primary hover:underline" to="/recruiter/login">
                Sign in here
              </Link>
            </p>
            <p className="mt-2">
              Looking for jobs?{' '}
              <Link className="text-blue-600 font-medium text-primary hover:underline" to="/user/signup">
                Create User Account
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Right Image Section */}
                  <div className="hidden lg:flex justify-center items-center">
                    <img
                      alt="Professional setting"
                      className="rounded-xl object-cover max-h-[500px] transform scale-100"
                      src={recSign}
                    />
                  </div>
    </div>
    </div>
  );
};

export default RecruiterSignup;
