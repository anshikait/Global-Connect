import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { recruiterAuthService } from '../services/authService';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';
import Navbar2 from '../components/Navbar2';
import recruiter from "../assets/recruiter.jpg";

const RecruiterLogin = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const { login, isAuthenticated, isRecruiter, logout, user } = useAuth();

  // Handle authentication state
  useEffect(() => {
    if (isAuthenticated()) {
      if (isRecruiter()) {
        // Already a recruiter, redirect to dashboard
        navigate('/recruiter-dashboard');
      }
      // If user is authenticated but not a recruiter (i.e., user), let them stay on this page
      // They can either logout or be warned about switching roles
    }
  }, [isAuthenticated, isRecruiter, navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    // Clear error when user starts typing
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.email || !formData.password) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);

    try {
      const response = await recruiterAuthService.login(formData);
      
      // Login recruiter
      login(response.data.user, response.data.token);
      
      // Redirect to dashboard
      navigate('/dashboard');
      
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Navbar2 />
    <div className="font-display bg-background-light dark:bg-background-dark text-foreground-light dark:text-foreground-dark min-h-screen flex flex-col">
      {/* Main content */}
      <main className="flex-grow flex items-center justify-center">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 items-center gap-12">
            {/* Left Form Section */}
            <div className="mx-auto w-full max-w-md">
              <span className="text-5xl font-bold bg-gradient-to-r text-blue-600 bg-clip-text">
                Sign in to your account 
              </span>
              <p className="mt-2 text-lg text-subtle-light text-left">
                Access your recruiter dashboard !!
              </p>

              {/* Already logged in warning */}
              {isAuthenticated() && !isUser() && (
                <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-md p-4">
                  <div className="flex">
                    <svg
                      className="h-5 w-5 text-yellow-500 mt-1"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98L8.257 3.1zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <div className="ml-3 text-sm text-yellow-700">
                      You’re logged in as a job seeker ({user?.email}). Logout to continue as a recruiter.
                      <div className="mt-3 flex gap-2">
                        <button
                          onClick={() => {
                            logout();
                            setError("");
                          }}
                          className="px-3 py-1 bg-yellow-100 rounded-md text-yellow-800 hover:bg-yellow-200"
                        >
                          Logout and Continue
                        </button>
                        <button
                          onClick={() => navigate("/recruiter-dashboard")}
                          className="px-3 py-1 bg-yellow-100 rounded-md text-yellow-800 hover:bg-yellow-200"
                        >
                          Go to Dashboard
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm">
                    {error}
                  </div>
                )}

                <div>
                  <input
                    type="email"
                    name="email"
                    placeholder="Enter Your Company Email Address"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-3 py-4 border border-border-light rounded-t-lg placeholder-subtle-light focus:outline-none focus:ring-primary focus:border-primary text-medium"
                  />
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      placeholder="Password"
                      required
                      value={formData.password}
                      onChange={handleChange}
                      className="w-full px-3 py-4 border-t-0 border border-border-light rounded-b-lg placeholder-subtle-light focus:outline-none focus:ring-primary focus:border-primary text-medium pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    >
                      {showPassword ? (
                        <svg
                          className="h-5 w-5 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"
                          />
                        </svg>
                      ) : (
                        <svg
                          className="h-5 w-5 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                          />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <input
                      id="remember-me"
                      name="remember-me"
                      type="checkbox"
                      className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                    />
                    <label htmlFor="remember-me" className="text-medium ml-2">
                      Remember me
                    </label>
                  </div>
                  <Link
                    to="/forgot-password"
                    className="text-blue-600 text-medium font-medium text-primary hover:text-primary/90"
                  >
                    Forgot your password?
                  </Link>
                </div>
              
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 text-xl font-semibold rounded-lg text-center bg-blue-600 hover:bg-blue-700 text-white hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition"
                >
                  {loading ? <LoadingSpinner size="sm" /> : "Sign In"}
                </button>
              </form>

              <div className="mt-6 text-center text-medium space-y-2">
                <p>
                  Don't have an account? {' '}
                  <Link to="/recruiter/signup" className="text-blue-600 hover:underline font-medium hover:text-underline">
                    Sign up here
                  </Link>
                </p>
                <p>
                  Are you a job seeker? {' '}
                  <Link to="/user/login" className="text-blue-600 hover:underline font-medium hover:text-underline">
                    Job-Seeker Login
                  </Link>
                </p>
              </div>
            </div>

            {/* Right Image Section */}
            <div className="hidden lg:flex justify-center items-center">
              <img
                alt="Professional setting"
                className="rounded-xl object-cover max-h-[900px] transform scale-115"
                src={recruiter}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
    </div>
  );
};

export default RecruiterLogin;