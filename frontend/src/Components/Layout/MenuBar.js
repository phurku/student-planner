import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './menubar.css';
import AuthButton from '../Auth/AuthButton';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

function MenuBar({ isDrawerOpen, toggleDrawer, userProfile, isAuthenticated, tasksDueSoon }) {
  const navigate = useNavigate();
  const drawerRef = useRef(null);

  // Close the drawer when clicking outside of it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (drawerRef.current && !drawerRef.current.contains(event.target)) {
        toggleDrawer();
      }
    };

    if (isDrawerOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDrawerOpen, toggleDrawer]);

  // Handle navigation with authentication check
  const handleNavigation = (path) => {
    if (!isAuthenticated) {
      if (window.confirm('You need to log in to access this feature. Do you want to log in now?')) {
      }
    } else {
      navigate(path); // Navigate to the desired path
    }
  };

  return (
    <div className={`drawer ${isDrawerOpen ? 'open' : ''}`} ref={drawerRef}>
      <div className="drawer-content">
        {/* Close Button */}
        <button className="close-drawer" onClick={toggleDrawer}>
          <ArrowBackIcon />
        </button>

        {/* Account Header */}
        <div className="account-header-menubar">
          {isAuthenticated && userProfile ? (
            <div className="user-profile">
              <div className="user-details">
                <span className="user-name">{userProfile.username}</span>
                <span className="user-email">{userProfile.email}</span>
              </div>
            </div>
          ) : (
            <div className="user-profile-placeholder">
              <p>Please sign in to view your profile.</p>
            </div>
          )}
        </div>

        {/* Menu Items */}
        <ul className="menu-items">
          <li onClick={() => handleNavigation('/settings',tasksDueSoon)}>Settings</li>
          <li onClick={() => handleNavigation('/notifications', tasksDueSoon)}>
            Notifications
            {tasksDueSoon.length > 0 && (
              <span className="notification-count"> ({tasksDueSoon.length})</span>
            )}
          </li>
        </ul>

        {/* Login/Logout Buttons */}
        <AuthButton isAuthenticated={isAuthenticated} onLogout={toggleDrawer} />
      </div>
    </div>
  );
}

export default MenuBar;