// Test script to verify backend API endpoints
const API_BASE_URL = 'http://localhost:5001/api';

// Test registration
const testRegistration = async () => {
  try {
    console.log('Testing user registration...');
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
        role: 'user'
      }),
    });

    const data = await response.json();
    console.log('Registration response:', data);
    
    if (data.success) {
      console.log('✅ Registration successful');
      return data.data.token;
    } else {
      console.log('❌ Registration failed:', data.message);
      return null;
    }
  } catch (error) {
    console.log('❌ Registration error:', error.message);
    return null;
  }
};

// Test login
const testLogin = async () => {
  try {
    console.log('Testing user login...');
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'test@example.com',
        password: 'password123'
      }),
    });

    const data = await response.json();
    console.log('Login response:', data);
    
    if (data.success) {
      console.log('✅ Login successful');
      return data.data.token;
    } else {
      console.log('❌ Login failed:', data.message);
      return null;
    }
  } catch (error) {
    console.log('❌ Login error:', error.message);
    return null;
  }
};

// Test profile update
const testProfileUpdate = async (token) => {
  try {
    console.log('Testing profile update...');
    const response = await fetch(`${API_BASE_URL}/users/profile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        bio: 'Updated bio from test script',
        skills: ['JavaScript', 'React', 'Node.js'],
        location: 'Test City'
      }),
    });

    const data = await response.json();
    console.log('Profile update response:', data);
    
    if (data.success) {
      console.log('✅ Profile update successful');
      return true;
    } else {
      console.log('❌ Profile update failed:', data.message);
      return false;
    }
  } catch (error) {
    console.log('❌ Profile update error:', error.message);
    return false;
  }
};

// Test get profile
const testGetProfile = async (token) => {
  try {
    console.log('Testing get profile...');
    const response = await fetch(`${API_BASE_URL}/users/profile`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      },
    });

    const data = await response.json();
    console.log('Get profile response:', data);
    
    if (data.success) {
      console.log('✅ Get profile successful');
      return true;
    } else {
      console.log('❌ Get profile failed:', data.message);
      return false;
    }
  } catch (error) {
    console.log('❌ Get profile error:', error.message);
    return false;
  }
};

// Run all tests
const runTests = async () => {
  console.log('🚀 Starting backend API tests...\n');
  
  // Test registration
  let token = await testRegistration();
  
  if (!token) {
    // If registration fails (user might already exist), try login
    token = await testLogin();
  }
  
  if (token) {
    // Test profile operations
    await testGetProfile(token);
    await testProfileUpdate(token);
    await testGetProfile(token); // Get updated profile
  }
  
  console.log('\n✨ Tests completed!');
};

// Run tests when this script is executed
if (typeof window === 'undefined') {
  // Running in Node.js
  runTests();
} else {
  // Running in browser
  window.runBackendTests = runTests;
  console.log('Backend test functions loaded. Run window.runBackendTests() to start tests.');
}

export { runTests };