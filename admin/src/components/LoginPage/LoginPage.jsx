import React, { useState } from 'react';
import './LoginPage.css';
import axios from 'axios';

const LoginPage = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isForgotPassword, setIsForgotPassword] = useState(false); // To toggle forgot password popup
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotMessage, setForgotMessage] = useState('');

  // Handle Login
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await axios.post('https://foodjunction.onrender.com/api/user/admin-login', { email, password });

      if (response.data.success) {
        localStorage.setItem('token', response.data.token); // Store the token
        onLogin(); // Call the function passed from App to update isLoggedIn
      } else {
        setError(response.data.message);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Server error');
    }
  };

  // Handle Forgot Password
  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setForgotMessage('');

    try {
      const response = await axios.post('https://foodjunction.onrender.com/api/user/forgot-password', {
        email: forgotEmail,
      });

      if (response.data.success) {
        setForgotMessage('Password reset instructions have been sent to your email.');
        setForgotEmail('');
      } else {
        setForgotMessage(response.data.message || 'Failed to send reset instructions.');
      }
    } catch (err) {
      setForgotMessage(err.response?.data?.message || 'Server error');
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>Welcome Back!</h2>
        <p>Login to access your account</p>
        {error && <p className="error-message">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email Address"
              required
            />
          </div>
          <div className="input-group">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              required
            />
          </div>
          <button type="submit" className="login-button">Login</button>
        </form>
        <p className="forgot-password-link" onClick={() => setIsForgotPassword(true)}>
          Forgot Password?
        </p>
      </div>

      {/* Forgot Password Modal */}
      {isForgotPassword && (
        <div className="forgot-password-modal">
          <div className="modal-content">
            <h2>Forgot Password</h2>
            <p>Enter your email address to reset your password.</p>
            <form onSubmit={handleForgotPassword}>
              <div className="input-group">
                <input
                  type="email"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  placeholder="Email Address"
                  required
                />
              </div>
              <button type="submit" className="reset-button">Send Reset Instructions</button>
            </form>
            {forgotMessage && <p className="forgot-message">{forgotMessage}</p>}
            <button className="close-button" onClick={() => setIsForgotPassword(false)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoginPage;
