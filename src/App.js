import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import UserLogin from './Components/UserLogin';
import UserRegister from './Components/UserRegister';
import Home from './Components/Home';
import ResetPassword from './Components/ResetPassword';
import ForgotPassword from './Components/ForgotPassword';
import CalendarComponent from './Components/Features/Calendar';
import AddTask from './Components/Features/AddTask'; // Import AddTask component
import Statistics from './Components/Features/Statistics'; // Import Statistics component
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/signin" element={<UserLogin />} />
          <Route path="/register" element={<UserRegister />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/home" element={<Home />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/calendar" element={<CalendarComponent />} />
          <Route path="/add-task" element={<AddTask />} /> {/* Add AddTask route */}
          <Route path="/statistics" element={<Statistics />} /> {/* Add Statistics route */}
          <Route path="/" element={<Navigate to="/home" />} /> {/* Redirect to SignIn on load */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;