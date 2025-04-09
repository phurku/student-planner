import React, { useRef, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import AnalogClock from './ClockLogo';
import './Auth.css';

const ForgotPassword = () => {
  const inputRef = useRef();
  const errRef = useRef();
  const [email, setEmail] = useState('');
  const [errMsg, setErrMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState(false);

  useEffect(() => {
    inputRef.current.focus();
  }, []);

  useEffect(() => {
    setErrMsg('');
  }, [email]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Password reset request submitted');
    setSuccessMsg(true);
    setEmail('');
  };

  return (
    <>
      {successMsg ? (
        <section>
          <h1>Request Submitted</h1>
          <p>If an account with this email exists, you will receive a password reset link shortly.</p>
          <Link to="/signin">Go to Login</Link>
        </section>
      ) : (
        <section className='auth-container'>
          <h1>Forgot Password?</h1>
          <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">{errMsg}</p>
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
            <button type="submit">Submit</button>
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

export default ForgotPassword;