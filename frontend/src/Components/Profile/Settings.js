import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { buildApiUrl } from '../../config';
import './settings.css';
import Navbar from '../Layout/Navbar';
import ProfileImage from '../../assets/profileimage.jpeg';
import BottomNavBar from '../Layout/BottomNavigationBar';


function Settings({ onLogout, isAuthenticated, task }) {
  const USER_MANUAL_URL = "https://scribehow.com/viewer/Registering_and_Managing_Tasks_in_Study_Mate_Application__tLHKmH8SQvSm-CoCkXPGrA";

  const navigate = useNavigate();
  const [userProfile, setUserProfile] = useState(null);
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light'); // Load theme from localStorage or default to 'light'

  useEffect(() => {
    const fetchUserProfile = async () => {
      const token = localStorage.getItem('access_token');
      if (!token) {
        setUserProfile(null);
        return;
      }

      try {
        const response = await fetch(buildApiUrl('users/me/'), {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setUserProfile(data); // Set the user profile data
        } else {
          console.error('Failed to fetch user profile');
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    };

    fetchUserProfile();
  }, [navigate]);

  useEffect(() => {
    // Apply the selected theme to the body element
    document.body.className = theme;
    localStorage.setItem('theme', theme); // Save the theme to localStorage
  }, [theme]);

  const handleThemeChange = (e) => {
    setTheme(e.target.value); // Update the theme state
  };

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to log out?')) {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      navigate('/signin');
      if (onLogout) {
        onLogout();
      }
    }
  };

  return (
    <div className="settings-page">
      <Navbar title="Settings" />

      <div className="account-header-setting">
        {isAuthenticated && userProfile ? (
          <div className="user-profile">
            <div className="user-details">
              <span className="user-avatar">
                <img
                  src={userProfile.profile_picture || ProfileImage}
                  alt="User Profile"
                  className="profile-img"
                />
              </span>
              <span className="user-name">{userProfile.username}</span>
            </div>
          </div>
        ) : (
          <div className="user-profile-placeholder">
            <p>Please sign in to view your profile.</p>
          </div>
        )}

        <ul className="settings-options">
          <li onClick={() => navigate('/user-profile')}>Profile</li>
          <li onClick={() => navigate('/notifications')}>Notifications</li>
          <li onClick={() => navigate('/forgot-password')}>Change Password</li>          

          <li onClick={() => navigate('/feedback')}>Feedback</li>
          <li>App Version: 1.0.0</li>
          <li> <a className='usermanual' href={USER_MANUAL_URL}>Help</a>  </li>

        </ul>

        {isAuthenticated && (
          <button className="auth-buttons" onClick={handleLogout}>
            Logout
          </button>
        )}
      </div>
      <BottomNavBar />
    </div>
  );
}

export default Settings;