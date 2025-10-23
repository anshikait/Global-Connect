import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { userAuthService } from "../services/authService";
import { useAuth } from "../context/AuthContext";
import LoadingSpinner from "../components/LoadingSpinner";
import Navbar2 from "../components/Navbar2";
import userSign from "../assets/userSign.jpg";

const UserSignup = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const navigate = useNavigate();
  const { login, isAuthenticated, isUser, logout, user } = useAuth();

  useEffect(() => {
    if (isAuthenticated()) {
      if (isUser()) {
        navigate("/user-dashboard");
      }
    }
  }, [isAuthenticated, isUser, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    setLoading(true);
    try {
      const response = await userAuthService.register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });
      login(response.data.user, response.data.token);
      navigate("/dashboard");
    } catch (error) {
      setError(error.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Navbar2 />
    <div className="bg-background-light min-h-screen flex flex-center justify-center font-display">
      {/* Left Image Section */}
      <div className="hidden lg:flex justify-center items-center">
        <img
          alt="Professional setting"
          className="ml-18 rounded-xl object-cover max-h-[600px]"
          src={userSign}
        />
      </div>

      {/* Right Form Section */}
      <div className="w-full md:w-1/2 flex items-center justify-center bg-white p-6 lg:p-8">
        <div className="w-full max-w-lg">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
            </div>
            <h2 className="text-5xl font-bold text-blue-600">
              Create Your Account
            </h2>
            <p className="mt-2 text-gray-600 text-xl">
              Join Global Connect as a job seeker
            </p>
          </div>

          {/* Recruiter warning */}
          {isAuthenticated() && !isUser() && (
            <div className="mb-6 bg-yellow-50 border border-yellow-200 rounded-md p-4 text-sm text-yellow-700">
              You’re logged in as a recruiter ({user?.email}). Please logout to
              create a user account.
              <div className="mt-3 flex gap-3">
                <button
                  type="button"
                  onClick={() => logout()}
                  className="bg-yellow-100 px-3 py-1 rounded-md hover:bg-yellow-200"
                >
                  Logout
                </button>
              </div>
            </div>
          )}

          {/* Error message */}
          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm">
              {error}
            </div>
          )}

          {/* Signup Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="sr-only" htmlFor="name">
                Full Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                value={formData.name}
                onChange={handleChange}
                placeholder="Full Name"
                className="form-input w-full p-4 rounded-lg bg-gray-50 text-gray-900 placeholder-gray-500 border border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/30"
              />
            </div>

            <div>
              <label className="sr-only" htmlFor="email">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="Email Address"
                className="form-input w-full p-4 rounded-lg bg-gray-50 text-gray-900 placeholder-gray-500 border border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/30"
              />
            </div>

            {/* Password Field */}
            <div className="relative">
              <label className="sr-only" htmlFor="password">
                Password
              </label>
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                required
                value={formData.password}
                onChange={handleChange}
                placeholder="Password"
                className="form-input w-full p-4 rounded-lg bg-gray-50 text-gray-900 placeholder-gray-500 border border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/30 pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                {showPassword ? "🙈" : "👁️"}
              </button>
            </div>

            {/* Confirm Password Field */}
            <div className="relative">
              <label className="sr-only" htmlFor="confirmPassword">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                required
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm Password"
                className="form-input w-full p-4 rounded-lg bg-gray-50 text-gray-900 placeholder-gray-500 border border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/30 pr-10"
              />
              <button
                type="button"
                onClick={() =>
                  setShowConfirmPassword(!showConfirmPassword)
                }
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                {showConfirmPassword ? "🙈" : "👁️"}
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="text-xl w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-4 rounded-lg hover:bg-primary/90 transition-all duration-300"
            >
              {loading ? <LoadingSpinner size="sm" /> : "Create Account"}
            </button>
          </form>

          {/* Footer Links */}
          <div className=" font-medium mt-8 text-center text-base text-gray-600">
            <p>
              Already have an account?{" "}
              <Link
                to="/user/login"
                className="font-medium text-blue-600 hover:underline"
              >
                Sign in here
              </Link>
            </p>
            <p className="mt-2">
              Looking to hire?{" "}
              <Link
                to="/recruiter/signup"
                className="font-medium text-blue-600 hover:underline"
              >
                Create Recruiter Account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
};

export default UserSignup;
