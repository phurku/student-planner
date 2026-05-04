import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../Layout/menubar.css'; // Reuse the styles from menubar.css

function AuthButtons({ isAuthenticated, onLogout }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear user authentication data (e.g., tokens)
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');

    // Navigate to the Sign In page
    navigate('/signin');

    // Call the onLogout callback if provided
    if (onLogout) {
      onLogout();
    }
  };

  return (
    <div className="auth-buttons">
      {isAuthenticated ? (
        <button onClick={handleLogout} className="logout-option">
          Logout
        </button>
      ) : (
        <button onClick={() => navigate('/signin')} className="login-option">
          Login
        </button>
      )}
    </div>
  );
}

export default AuthButtons;