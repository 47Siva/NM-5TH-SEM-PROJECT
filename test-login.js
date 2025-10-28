// Simple test script to verify login functionality
const fetch = require('node-fetch');

const BASE_URL = 'http://localhost:5000';

async function testLogin() {
  try {
    console.log('Testing login functionality...');
    
    // Test login
    const loginResponse = await fetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: 'test@example.com',
        password: 'password123'
      })
    });
    
    if (!loginResponse.ok) {
      console.log('Login failed - this is expected if user doesn\'t exist');
      console.log('Response:', await loginResponse.text());
      return;
    }
    
    const loginData = await loginResponse.json();
    console.log('Login successful:', loginData);
    
    // Test profile endpoint
    const profileResponse = await fetch(`${BASE_URL}/api/auth/profile`, {
      headers: {
        'Authorization': `Bearer ${loginData.accessToken}`
      }
    });
    
    if (profileResponse.ok) {
      const profileData = await profileResponse.json();
      console.log('Profile data:', profileData);
      console.log('Last Login:', profileData.user.lastLogin);
      console.log('Login Count:', profileData.user.loginCount);
    } else {
      console.log('Profile request failed:', await profileResponse.text());
    }
    
  } catch (error) {
    console.error('Test error:', error);
  }
}

testLogin();