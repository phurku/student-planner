import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTasks, faCalendarAlt, faClipboardList, faChartBar } from '@fortawesome/free-solid-svg-icons';
import './bottomnavigationbar.css';

function BottomNavBar() {
  const navigate = useNavigate();

  return (
    <div className="bottom-nav-bar">
      <button onClick={() => navigate('/add-task')}>
        <FontAwesomeIcon icon={faTasks} />
        <span>Add Task</span>
      </button>
      <button onClick={() => navigate('/schedule')}>
        <FontAwesomeIcon icon={faCalendarAlt} />
        <span>Schedule</span>
      </button>
      <button onClick={() => navigate('/planner')}>
        <FontAwesomeIcon icon={faClipboardList} />
        <span>Planner</span>
      </button>
      <button onClick={() => navigate('/statistics')}>
        <FontAwesomeIcon icon={faChartBar} />
        <span>Statistics</span>
      </button>
    </div>
  );
}

export default BottomNavBar;