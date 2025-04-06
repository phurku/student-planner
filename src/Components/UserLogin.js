import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import AnalogClock from './ClockLogo';
import './Auth.css';

function UserLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    // Handle login logic here
    console.log('Email:', email);
    console.log('Password:', password);
  };

  return (
    <div className="auth-container">
      <AnalogClock/>
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
        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <Link to="/forgot-password" className="register-button" >Forgot Password?</Link><br/>
        <button type="submit">SignIn </button>
        <Link to="/home" className="register-button">Home</Link>

        <p>Not registered yet?</p> 
        <button>
          <Link to="/register" className="register-button">Sign Up</Link>
        </button>
      </form>
    </div>
  );
}

export default UserLogin;