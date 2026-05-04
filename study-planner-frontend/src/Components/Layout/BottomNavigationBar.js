import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faChartBar, faTasks, faClipboardList } from '@fortawesome/free-solid-svg-icons';
import './bottomnavigationbar.css';

function BottomNavBar() {
  const navigate = useNavigate();

  return (
    <div className="bottom-nav-bar">
      {/* Home */}
      <button onClick={() => navigate('/home')} className="nav-button">
        <FontAwesomeIcon icon={faHome} className="nav-icon" />
        <span className="nav-label">Home</span>
      </button>

     
      {/* Add Task */}
      <button onClick={() => navigate('/add-task')} className="nav-button">
        <FontAwesomeIcon icon={faTasks} className="nav-icon" />
        <span className="nav-label">Add Task</span>
      </button>

      {/* Planner */}
      <button onClick={() => navigate('/planner')} className="nav-button">
        <FontAwesomeIcon icon={faClipboardList} className="nav-icon" />
        <span className="nav-label">Planner</span>
      </button>
       {/* Calendar */}
       <button onClick={() => navigate('/statistics')} className="nav-button">
        <FontAwesomeIcon icon={faChartBar} className="nav-icon" />
        <span className="nav-label">Statistics</span>
      </button>

    </div>
  );
}

export default BottomNavBar;