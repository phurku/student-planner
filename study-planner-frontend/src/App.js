import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import UserLogin from './Components/Auth/UserLogin';
import UserRegister from './Components/Auth/UserRegister';
import Home from './Components/Layout/Home';
import ForgotPassword from './Components/Auth/ForgotPassword';
import AddTask from './Components/Features/AddTask'; // Import AddTask component
import Statistics from './Components/Features/Statistics'; // Import Statistics component
import Planner from './Components/Features/Planner'; // Placeholder for Planner
import './App.css';
import UserProfile from './Components/Profile/UserProfile';
import Settings from './Components/Profile/Settings'; // Import Settings component
import ResetPassword from './Components/Auth/ResetPassword'; // Import ChangePassword component
import Profile from './Components/Profile/Profile'; // Import Profile component
import { onMessageListener } from './Components/Firebase/Firebase'; // Import Firebase functions
import Notifications from './Components/Features/Notifications'; // Import Notifications component
import Feedback from './Components/Profile/Feedback'; // Import Feedback component
import { AuthProvider } from './Components/Context/AuthContext'; // Import AuthProvider
function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userProfile, setUserProfile] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (token) {
      // Simulate fetching user profile
      setUserProfile({});
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
    
  }, []);
  useEffect(() => {
    // Listen for incoming messages
    onMessageListener()
      .then((payload) => {
        console.log("Message received: ", payload);
        alert(`Notification: ${payload.notification.title}\n${payload.notification.body}`);
      })
      .catch((err) => console.log("Failed to receive message: ", err));
  }, []);
  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    setIsAuthenticated(false);
    setUserProfile(null);
  };
  return (
    <AuthProvider>  
      
    <Router>
      <div className="App">
        
        <Routes>
          <Route path="/signin" element={<UserLogin />} />
          <Route path="/register" element={<UserRegister />} />
          <Route path="/home" element={<Home />} />
\          <Route path="/add-task" element={<AddTask />} /> {/* Add AddTask route */}
          <Route path="/statistics" element={<Statistics />} /> {/* Add Statistics route */}
          <Route path="/planner" element={<Planner />} /> {/* Placeholder for Planner */}
          <Route path="/update-task/:taskId" element={<AddTask />} /> {/* Update task route */}
          <Route path="/" element={<Navigate to="/home" />} /> {/* Redirect to SignIn on load */}
          <Route path="/user-profile" element={<UserProfile />} />
          <Route path="/settings" element={<Settings
            userProfile={userProfile}
            isAuthenticated={isAuthenticated}
            onLogout={handleLogout}
          />} />
           {/* Redirect to home for unknown routes */}
          <Route path="/verify_email/:token/" element={<Profile/>} />
          <Route path="/notifications" element={<Notifications/>} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route path="/feedback" element={<Feedback />} />

        </Routes>
      </div>
    </Router>
    </AuthProvider>

    
  );
}

export default App;