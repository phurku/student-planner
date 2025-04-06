import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faCalendarAlt, faTasks, faChartBar } from '@fortawesome/free-solid-svg-icons';
import './bottomnavigationbar.css';

function BottomNavBar() {
  const navigate = useNavigate();

  return (
    <div className="bottom-nav-bar">
      <button onClick={() => navigate('/home')}>
        <FontAwesomeIcon icon={faHome} />
        <span>Home</span>
      </button>
      <button onClick={() => navigate('/calendar')}>
        <FontAwesomeIcon icon={faCalendarAlt} />
        <span>Calendar</span>
      </button>
      <button onClick={() => navigate('/add-task')}>
        <FontAwesomeIcon icon={faTasks} />
        <span>Add Task</span>
      </button>
      <button onClick={() => navigate('/statistics')}>
        <FontAwesomeIcon icon={faChartBar} />
        <span>Statistics</span>
      </button>
    </div>
  );
}

export default BottomNavBar;