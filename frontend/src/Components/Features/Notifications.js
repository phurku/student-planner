import React, { useState, useEffect } from 'react';
import Navbar from '../Layout/Navbar';
import { buildApiUrl } from '../../config';
import './notifications.css'; // Import your CSS file for styling
function Notifications() {
  const [tasksDueSoon, setTasksDueSoon] = useState([]); // State to store due tasks

  const isOverdue = (dueDate) => {
    const due = new Date(dueDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return due < today;
  };

  useEffect(() => {
    const fetchDueTasks = async () => {
      const token = localStorage.getItem('access_token');
      if (!token) {
        setTasksDueSoon([]);
        alert('You are not authenticated. Please log in.');
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
          setTasksDueSoon(data); // Set the fetched tasks
        } else {
          console.error('Failed to fetch due tasks:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching due tasks:', error);
      }
    };

    fetchDueTasks();
  }, []); // Fetch tasks when the component mounts

  return (
    <div className="notifications-page">
      <Navbar title="Notifications" />
    <div>
      <h1>Due and Overdue Tasks</h1>
      {tasksDueSoon.length > 0 ? (
        <ul className="notifications-list">
          {tasksDueSoon.map((task) => (
            <li key={task.id} className="notification-item">
              <h4> Task name: {task.name}</h4>
              <p>Status: {isOverdue(task.due_date) ? 'Overdue' : 'Due soon'}</p>
              <p>Due Date: {new Date(task.due_date).toLocaleDateString()}</p>
              <p>Description: {task.description}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p>No due or overdue tasks.</p>
      )}
    </div></div>
  );
}

export default Notifications;