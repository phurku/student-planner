import React, { useRef, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Auth.css';
import Navbar from './Navbar';
import AnalogClock from './ClockLogo';

const UserLogin = () => {
  const inputRef = useRef();
  const errRef = useRef();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errMsg, setErrMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    inputRef.current.focus();
  }, []);

  useEffect(() => {
    setErrMsg('');
  }, [email, password]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Login request
      const response = await axios.post('http://localhost:5001/login', {
        email,
        password,
      });

      console.log(response.data); // Log the response data

      // Save the token in localStorage
      localStorage.setItem('token', response.data.token);

      // Fetch protected data using the token
      const token = localStorage.getItem('token');
      const fetchResponse = await axios.get('http://localhost:5001/protected-route', {
        headers: {
          Authorization: `Bearer ${token}`, // Include the token in the Authorization header
        },
      });

      console.log('Protected Data:', fetchResponse.data);

      // Set success message and clear form fields
      setSuccessMsg(true);
      setEmail('');
      setPassword('');

      // Redirect to the home page after successful login
      setTimeout(() => {
        navigate('/home');
      }, 2000); // Redirect after 2 seconds
    } catch (error) {
      if (error.response) {
        setErrMsg(error.response.data.message || 'Login failed');
      } else if (error.request) {
        setErrMsg('No response from server');
      } else {
        setErrMsg('An error occurred');
      }
      errRef.current.focus();
    }
  };

  return (
    <>
      {successMsg ? (
        <section>
          <h1>Login Successful</h1>
          <p>Welcome back!</p>
          <p>You will be redirected to the home page shortly.</p>
          <Link to="/home">Go to Home</Link>
        </section>
      ) : (
        <section className="auth-container">
          <p
            ref={errRef}
            className={errMsg ? 'errmsg' : 'offscreen'}
            aria-live="assertive"
          >
            {errMsg}
          </p>
          <Navbar />
          <AnalogClock />
          <form className="auth-form" onSubmit={handleSubmit}>
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              ref={inputRef}
              autoComplete="off"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              required
            />
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              required
            />
            <button type="submit">Sign In</button>
            <span className="auth-link">
              Don't have an account? <Link to="/register">Register here</Link>
            </span>
          </form>
        </section>
      )}
    </>
  );
};

export default UserLogin;