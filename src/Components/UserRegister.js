import React, { useState, useEffect } from 'react';
import './Auth.css';
import Navbar from './Navbar';
import { Link, useNavigate } from 'react-router-dom';
import countries from '../countrieslist.json'

function UserRegister() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [country, setCountry] = useState('');
  const [countryList, setCountryList] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Load the countries from the JSON file
    setCountryList(countries);
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();
    // Handle register logic here
    if (password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    console.log('Email:', email);
    console.log('Password:', password);
    console.log('Mobile Number:', mobileNumber);
    console.log('Country:', country);
    // Add your registration logic here
    // After successful registration, you can navigate to the login page
    navigate('/signin');
  };

  const handleGoogleSignup = () => {
    // signInWithPopup(auth, provider)
    //   .then((result) => {
    //     console.log('Google Signup Success:', result.user);
    //   })
    //   .catch((error) => {
    //     console.error('Google Signup Error:', error);
    //   });
  };

  return (
    <div>
      <Navbar title="Register your account" />
      <div className="auth-container">
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
          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password:</label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            /><br />
          </div>
          <div className="form-group">
            <label htmlFor="mobileNumber">Mobile Number:</label>
            <input
              type="tel"
              id="mobileNumber"
              value={mobileNumber}
              onChange={(e) => setMobileNumber(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="country">Country:</label>
            <select
              id="country"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              required
            >
              <option value="">Select your country</option>
              {countryList.map((country, index) => (
                <option key={index} value={country.name}>
                  {country.name}
                </option>
              ))}
            </select>
          </div>
          <p className='info'>Has at least 8 characters, 1 number, 1 symbol and 1 uppercase</p>

          <button type="submit">Register</button>
          <button type="button" onClick={handleGoogleSignup} className="google-auth-button">
            Register with Google
          </button>
          <p>Already registered?</p>
        <button className="register-button">
          <Link to="/signin">SignIn</Link>
        </button>
        </form>
      
      </div>
    </div>
  );
}

export default UserRegister;