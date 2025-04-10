import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faBars } from '@fortawesome/free-solid-svg-icons';
import { IconButton } from '@mui/material';
import MenuDrawer from './MenuBar'; // Assuming MenuDrawer is your menu component
import './Navbar.css';

function Navbar({ title }) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const navigate = useNavigate();

  const toggleDrawer = (open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setDrawerOpen(open);
  };

  return (
    <nav className="navbar">
      {/* Left Section: Back Button and Title */}
      <div className="navbar-left">
        {title !== 'Study Mate' && (
          <button className="back-button" onClick={() => navigate(-1)}>
            <FontAwesomeIcon icon={faArrowLeft} />
          </button>
        )}
        <div className="navbar-title">{title}</div>
      </div>

      {/* Right Section: Menu Button */}
      <div className="navbar-right">
        {title !== 'Register your account' &&
          title !== 'Sign In' &&
          title !== 'Forgot Password' && (
            <IconButton className="menu-button" onClick={toggleDrawer(true)}>
              <FontAwesomeIcon icon={faBars} />
            </IconButton>
          )}
        <MenuDrawer drawerOpen={drawerOpen} toggleDrawer={toggleDrawer} />
      </div>
    </nav>
  );
}

export default Navbar;