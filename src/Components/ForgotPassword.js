import React, { useState } from 'react';
import './Auth.css';
import Navbar from './Navbar';
function ForgotPassword() {
  const [email, setEmail] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    // Handle forgot password logic here
    console.log('Email:', email);
    // You can integrate with your backend or Firebase to send a password reset email
  };

  return (
    <div className="auth-container">
            <Navbar title="Forgot Password" />
      
      <h2>Forgot Password</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <button type="submit">Send Reset Link</button>
      </form>
    </div>
  );
}

export default ForgotPassword;