import React from 'react';
import Navbar from '../Navbar';
import './statistics.css';
import BottomNavBar from '../BottomNavigationBar';
function Statistics() {
  return (
    <div className="statistics">
      <Navbar title="Statistics" />
      <div className="content">
        <h2>Statistics</h2>
        <p>Here you can view your study statistics.</p>
        {/* Add your statistics display logic here */}
      </div>
      <BottomNavBar />
    </div>
  );
}

export default Statistics;