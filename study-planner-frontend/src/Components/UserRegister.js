import React, { useRef, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Import useNavigate for redirection
import AnalogClock from './ClockLogo';
import axios from 'axios'; // Import Axios
import './Auth.css';
import Navbar from './Navbar';

const UserRegister = () => {
  const inputRef = useRef();
  const errRef = useRef();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errMsg, setErrMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState(false);
  const navigate = useNavigate(); // Initialize useNavigate for redirection

  useEffect(() => {
    inputRef.current.focus();
  }, []);

  useEffect(() => {
    setErrMsg('');
  }, [email, password, confirmPassword]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setErrMsg("Passwords do not match");
      return;
    }

    try {
      const response = await axios.post('http://localhost:5001/register', {
        email,
        password,
      });
      console.log(response.data); // Handle the response data
      setSuccessMsg(true);
      setEmail('');
      setPassword('');
      setConfirmPassword('');

      // Redirect to the login page after successful registration
      setTimeout(() => {
        navigate('/signin');
      }, 2000); // Redirect after 2 seconds
    } catch (error) {
      if (error.response) {
        // Server responded with a status other than 2xx
        setErrMsg(error.response.data.message || "Registration failed");
      } else if (error.request) {
        // Request was made but no response received
        setErrMsg("No response from server");
      } else {
        // Something else happened
        setErrMsg("An error occurred");
      }
      errRef.current.focus();
    }
  };

  return (
    <>
      {successMsg ? (
        <section>
          <h1>Registration Successful</h1>
          <p>Welcome! You will be redirected to the login page shortly.</p>
          <Link to="/signin">Go to Login</Link>
        </section>
      ) : (
        <section className="auth-container">
          <p
            ref={errRef}
            className={errMsg ? "errmsg" : "offscreen"}
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
            <label htmlFor="confirmPassword">Confirm Password:</label>
            <input
              type="password"
              id="confirmPassword"
              onChange={(e) => setConfirmPassword(e.target.value)}
              value={confirmPassword}
              required
            />
            <button type="submit">Register</button>
            <span className="auth-link">
              Already have an account?
              <Link to="/signin">Login here</Link>
            </span>
          </form>
        </section>
      )}
    </>
  );
};

export default UserRegister;