import React, { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { useNavigate } from 'react-router-dom';
import Navbar from '../Layout/Navbar';
import BottomNavigation from '../Layout/BottomNavigationBar';
import { useContext } from 'react';
import { buildApiUrl } from '../../config';
import './planner.css';
import { AuthContext } from '../Context/AuthContext'; // Import the AuthContext
function Planner() {
  const { isAuthenticated } = useContext(AuthContext); // Get authentication state
  const [tasks, setTasks] = useState([]);
  const [events, setEvents] = useState([]);
  const [view, setView] = useState('list'); // Toggle between 'list' and 'calendar'
  const navigate = useNavigate();
  const [durationId, setDurationId] = useState(null); // Store the duration ID for stopping the timer
  const [activeTaskId, setActiveTaskId] = useState(null); // Store the ID of the task being timed
  useEffect(() => {
    if (!isAuthenticated) {
      console.log('User is not authenticated.');
    }
  }, [isAuthenticated]);

  // Fetch tasks from the backend
  useEffect(() => {
    const fetchTasks = async () => {
      const token = localStorage.getItem('access_token');
      if (!token) {
        setTasks([]);
        setEvents([]);
        console.log('User is not authenticated. Tasks cannot be displayed.');
        return;
      }

      try {
        const response = await fetch(buildApiUrl('tasks/'), {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const tasksData = await response.json();
          setTasks(tasksData);

          // Format tasks as events for FullCalendar
          const formattedEvents = tasksData.map((task) => ({
            id: task.id,
            title: task.name,
            start: task.schedules[0]?.start_time,
            end: task.schedules[0]?.end_time,
            description: task.description,
          }));
          setEvents(formattedEvents);
        } else {
          console.error('Failed to fetch tasks');
        }
      } catch (error) {
        console.error('Error fetching tasks:', error);
      }
    };

    fetchTasks();
  }, []);

const isTaskOverDue=(duedate)=>{
  const currentDate = new Date();
  const taskDueDate = new Date(duedate);
  return taskDueDate < currentDate&&isNaN(taskDueDate);}

  // Handle task deletion
  const handleDelete = async (taskId) => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      console.log('User is not authenticated. Cannot process DELETE function.');
      return;
    }

    try {
      const response = await fetch(buildApiUrl(`tasks/${taskId}/`), {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        alert('Task deleted successfully.');
        setTasks(tasks.filter((task) => task.id !== taskId)); // Remove the task from the list
        setEvents(events.filter((event) => event.id !== taskId)); // Remove the task from the calendar
      } else {
        console.error('Failed to delete task');
        alert('Failed to delete task.');
      }
    } catch (error) {
      console.error('Error deleting task:', error);
      alert('An error occurred while deleting the task.');
    }
  };

  // Handle task update (navigate to AddTask page with task data)
  const handleUpdate = (task) => {
    navigate('/add-task', { state: { task } });
  };

  // Handle event click in FullCalendar
  const handleEventClick = (info) => {
    // Find the task associated with the clicked event
    const task = tasks.find((task) => task.id === parseInt(info.event.id));
    if (task) {
      navigate('/add-task', { state: { task } }); // Navigate to the edit page with task data
    }
  };
  const handleStartTimer = async (taskId) => {
    const token = localStorage.getItem('access_token');
    try {
      const response = await fetch(buildApiUrl(`timer/start/${taskId}/`), {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setDurationId(data.duration_id); // Store the duration ID
        setActiveTaskId(taskId); // Set the active task ID
        console.log('Timer started:', data);
        // alert('Timer started successfully!');
      } else {
        console.error('Failed to start timer:', response.statusText);
        alert('Failed to start timer.');
      }
    } catch (error) {
      console.error('Error starting timer:', error);
      alert('An error occurred while starting the timer.');
    }
  };

  const handleStopTimer = async () => {
    if (!durationId) {
      alert('No active timer to stop.');
      return;
    }

    const token = localStorage.getItem('access_token');
    try {
      const response = await fetch(buildApiUrl(`timer/stop/${durationId}/`), {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setDurationId(null); // Clear the duration ID
        setActiveTaskId(null); // Clear the active task ID
        console.log('Timer stopped:', data);
        // alert(`Timer stopped. Total duration: ${data.duration.toFixed(2)} seconds`);
      } else {
        console.error('Failed to stop timer:', response.statusText);
        alert('Failed to stop timer.');
      }
    } catch (error) {
      console.error('Error stopping timer:', error);
      alert('An error occurred while stopping the timer.');
    }
  };

  const calculateProgress = () => {
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter((task) => task.status).length;
    const completionPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
    return { totalTasks, completedTasks, completionPercentage };
  }
  const { totalTasks, completedTasks, completionPercentage } = calculateProgress();


return (
    <div className="planner-page">
      <Navbar title="Planner" />

      {isAuthenticated ? (
        <>
          <div className="view-toggle">
            <button
              className={view === 'list' ? 'active' : ''}
              onClick={() => setView('list')}
            >
              List View
            </button>
            <button
              className={view === 'calendar' ? 'active' : ''}
              onClick={() => setView('calendar')}
            >
              Calendar View
            </button>
          </div>

          {view === 'list' && (
            <div className="task-list">
              {tasks.length > 0 ? (
                tasks.map((task) => (
                  <div key={task.id} className="task-card">
                    <h3
                      className={`task-name ${task.status ? 'completed-task' : isTaskOverDue(task.due_date) ? 'overdue-task' : ''}`}
                    >
                      {task.name}{' '}
                      {isTaskOverDue(task.due_date) && !task.status && (
                        <span className="overdue-label">Overdue</span>
                      )}
                    </h3>
                    <p>{task.description}</p>
                    <p>
                      <strong>Due Date:</strong> {task.due_date}
                    </p>
                    <p>
                      <strong>Priority:</strong> {task.priority}
                    </p>
                    <p>Status: {task.status ? 'Completed' : 'Pending'}</p>
                    <div className="task-actions">
                      <button
                        className="start-timer-button"
                        onClick={() => handleStartTimer(task.id)}
                        disabled={task.status || activeTaskId === task.id} // Disable if task is completed or timer is running
                      >
                        Start Timer {activeTaskId === task.id ? ' (Running)' : ''}
                      </button>
                      <button
                        className="stop-timer-button"
                        onClick={() => handleStopTimer()}
                        disabled={task.status || activeTaskId !== task.id} // Disable if task is completed or timer is not running
                      >
                        Stop Timer {activeTaskId === task.id ? ' (Running)' : ''}
                      </button>
                      <button
                        className="update-button"
                        onClick={() => handleUpdate(task)}
                        disabled={task.status} // Disable if task is completed
                      >
                        Update
                      </button>
                      <button
                        className="delete-button"
                        onClick={() => handleDelete(task.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <p>No tasks available.</p>
              )}
              <div className="progress-tracking">
              <h2>Progress Tracking</h2>
              <p>Total Tasks: {totalTasks}</p>
              <p>Completed Tasks: {completedTasks}</p>
              <p>Task Completion: {completionPercentage}%</p>
              <div className="progress-bar-container">
                <div
                  className="progress-bar-fill"
                  style={{ width: `${completionPercentage}%` }}
                ></div>
              </div>
            </div>
            </div>
          )}

          {view === 'calendar' && (
            <div className="calendar-view">
              <FullCalendar
                plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                initialView="dayGridMonth"
                headerToolbar={{
                  left: 'prev,next today',
                  center: 'title',
                  right: 'dayGridMonth,timeGridWeek,timeGridDay',
                }}
                events={events}
                editable={true}
                selectable={true}
                eventClick={handleEventClick}
              />
            </div>
          )}
        </>
      ) : (
        <div className="auth-prompt">
          <p>You are not logged in. Please log in or register to view tasks.</p>
          <button onClick={() => navigate('/signin')} className="auth-button">
            Log In
          </button>
          <button onClick={() => navigate('/register')} className="auth-button">
            Register
          </button>
        </div>

      )}

      <BottomNavigation />
    </div>
  );
}

export default Planner;