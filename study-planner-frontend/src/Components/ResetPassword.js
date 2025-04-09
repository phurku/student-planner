import React, { useRef, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import AnalogClock from './ClockLogo';
import axios from 'axios'; // Import Axios
import './Auth.css';
import Navbar from './Navbar';

const ResetPassword = () => {
  const inputRef = useRef();
  const errRef = useRef();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errMsg, setErrMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState(false);

  useEffect(() => {
    inputRef.current.focus();
  }, []);

  useEffect(() => {
    setErrMsg('');
  }, [password, confirmPassword]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setErrMsg("Passwords do not match");
      return;
    }

    try {
      const response = await axios.post('https://your-api-url.com/reset-password', {
        password,
      });
      console.log(response.data); // Handle the response data
      setSuccessMsg(true);
      setPassword('');
      setConfirmPassword('');
    } catch (error) {
      if (error.response) {
        // Server responded with a status other than 2xx
        setErrMsg(error.response.data.message || "Password reset failed");
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
          <h1>Password Reset Successful</h1>
          <p>You can now log in with your new password.</p>
          <Link to="/signin">Go to Login</Link>
        </section>
      ) : (
        <section className='auth-container'>
          <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">{errMsg}</p>
                    <Navbar />
          <AnalogClock />
          <form className="auth-form" onSubmit={handleSubmit}>
            <label htmlFor="password">New Password:</label>
            <input
              type="password"
              id="password"
              ref={inputRef}
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              required
            />
            <label htmlFor="confirmPassword">Confirm New Password:</label>
            <input
              type="password"
              id="confirmPassword"
              onChange={(e) => setConfirmPassword(e.target.value)}
              value={confirmPassword}
              required
            />
            <button type="submit">Reset Password</button>
            <span className="auth-link">
              Remembered your password?
              <Link to="/signin">Login here</Link>
            </span>
          </form>
        </section>
      )}
    </>
  );
};

export default ResetPassword;