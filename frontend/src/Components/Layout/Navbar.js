import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';
import SettingsIcon from '@mui/icons-material/Settings';
import NotificationsIcon from '@mui/icons-material/Notifications';
import CloseIcon from '@mui/icons-material/Close';
import { buildApiUrl } from '../../config';
import './Navbar.css';
import MenuBar from './MenuBar';

function Navbar({ title }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [tasksDueSoon, setTasksDueSoon] = useState([]); // Store tasks due soon
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false); // State for mobile menu



  useEffect(() => {
    const bodyContent = document.querySelector('.content');
    const navbar = document.querySelector('.navbar');

    if (bodyContent && navbar) {
      bodyContent.style.marginTop = `${navbar.offsetHeight}px`;
    }
  }, [isMenuOpen]);

const toggleMenu = () => {
  setIsMenuOpen(!isMenuOpen);
  if (!isMenuOpen) {
    document.body.style.overflow = 'hidden'; // Disable scrolling
  } else {
    document.body.style.overflow = 'auto'; // Enable scrolling
  }
};


  useEffect(() => {
    const fetchUserProfile = async () => {
      const token = localStorage.getItem('access_token');
      if (!token) {
        setUserProfile(null);
        setIsAuthenticated(false);
        return;
      }

      try {
        const response = await fetch(buildApiUrl('users/me/'), {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setUserProfile(data);
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
        setIsAuthenticated(false);
      }
    };

    fetchUserProfile();
  }, []);

  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  useEffect(() => {
    const fetchNotifications = async () => {
      const token = localStorage.getItem('access_token');
      if (!token) {
        setTasksDueSoon([]);
        console.log('User is not authenticated. Notifications cannot be fetched.');
        return;
      }

      try {
        const response = await fetch(buildApiUrl('tasks-due-tomorrow/'), {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setTasksDueSoon(data); // Set the list of tasks due soon
        } else {
          console.error('Failed to fetch tasks due soon:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching tasks due soon:', error);
      }
    };

    fetchNotifications();
  }, []);

  // const markAsRead = async (taskId) => {
  //   const token = localStorage.getItem('access_token');
  //   setTasksDueSoon((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
  //   if (!token) {
  //     alert('You are not authenticated. Please log in.');
  //     return;
  //   }

  //   try {
  //     const response = await fetch(buildApiUrl(`tasks/${taskId}/mark-as-read/`), {
  //       method: 'POST',
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //       },
  //     });

  //     if (response.ok) {
  //       // Remove the task from the list of due tasks
  //       setTasksDueSoon((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
  //       alert('Task marked as read.');
  //     } else {
  //       console.error('Failed to mark task as read:', response.statusText);
  //     }
  //   } catch (error) {
  //     console.error('Error marking task as read:', error);
  //   }
  // };

  return (
    <div className="navbar">
       {/* Hamburger Menu for Mobile */}
       <button className="menu-toggle" onClick={toggleMenu}>
        {isMenuOpen ? <CloseIcon /> : <MenuIcon />}
      </button>
      <div className={`navbar-content ${isMenuOpen ? 'open' : ''}`}>
      {/* Left Side Links */}

      <div className="navbar-left">
        <Link to="/home" className="nav-link">Home</Link>
        <Link to="/add-task" className="nav-link">Add Task</Link>
        <Link to="/planner" className="nav-link"> Planner</Link>
        <Link to="/statistics" className="nav-link">Statistics</Link>

      </div>

      {/* Right Side Icons */}
 <div className="navbar-right">
        {isAuthenticated ? (
          <>
            <div className="notification-container">
              <button className="dropdown-button" onClick={() => navigate('/notifications')} aria-label="Open notifications">
                <NotificationsIcon />
                {tasksDueSoon.length > 0 && (
                  <span className="notification-badge">{tasksDueSoon.length}</span>
                )}
              </button>
            </div>
            <button className="icon-button" onClick={() => navigate('/settings')}>
              <SettingsIcon />
            </button>
            <button className="menu-button" onClick={toggleDrawer}>
              <span className="user-name">{userProfile?.username}</span>
            </button>
          </>
        ) : (
          <>
            <button className="nav-link" onClick={() => navigate('/signin')}>
              Login
            </button>
            <button className="nav-link" onClick={() => navigate('/register')}>
              Register
            </button>
            <button className="menu-button" onClick={toggleDrawer}>
              <MenuIcon />
            </button>
          </>
        )}
      </div>     
      </ div>

      {/* Drawer Menu */}
      <MenuBar
        isDrawerOpen={isDrawerOpen}
        toggleDrawer={toggleDrawer}
        userProfile={userProfile}
        isAuthenticated={isAuthenticated}
        tasksDueSoon={tasksDueSoon}
        
      />
    </div>
  );
}

export default Navbar;