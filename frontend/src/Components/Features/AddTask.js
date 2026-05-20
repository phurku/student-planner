import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { buildApiUrl } from '../../config';
import './addtask.css';
import Navbar from '../Layout/Navbar';
import BottomNavigation from '../Layout/BottomNavigationBar';
import '../Auth/Auth.css'; // Import your CSS file for styling

function AddTask() {
  const navigate = useNavigate();
  const location = useLocation();
  const taskToEdit = location.state?.task || null; // Get task details if passed for editing

  const [taskName, setTaskName] = useState(taskToEdit?.name || '');
  const [description, setDescription] = useState(taskToEdit?.description || '');
  const [dueDate, setDueDate] = useState(taskToEdit?.due_date || '');
  const [priority, setPriority] = useState(taskToEdit?.priority || 'low');
  const [status, setStatus] = useState(taskToEdit?.status || false);
  const [schedules, setSchedules] = useState(
    taskToEdit?.schedules || [{ start_time: '', end_time: '' }]
  );

  // Check if the user is logged in
  const isLoggedIn = !!localStorage.getItem('access_token');

  // Handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();

    const taskData = {
      name: taskName,
      description,
      due_date: new Date(dueDate).toISOString().split('T')[0], // Format as YYYY-MM-DD
      priority,
      status,
      schedules: schedules.map((schedule) => ({
        id: schedule.id || null, // Include schedule ID for updates
        start_time: new Date(schedule.start_time).toISOString(),
        end_time: new Date(schedule.end_time).toISOString(),
      })),
    };

    const token = localStorage.getItem('access_token');
    if (!token) {
      alert('You are not authenticated. Please log in.');
      return;
    }

    try {
      const response = await fetch(
        taskToEdit
          ? buildApiUrl(`tasks/${taskToEdit.id}/`) // Update task if taskToEdit exists
          : buildApiUrl('tasks/'), // Create new task otherwise
        {
          method: taskToEdit ? 'PUT' : 'POST', // Use PUT for updates, POST for new tasks
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(taskData),
        }
      );
  
      if (response.ok) {
        alert(taskToEdit ? 'Task updated successfully.' : 'Task added successfully.');
        navigate('/planner'); // Redirect to the planner page
      } else {
        const errorData = await response.json();
        console.error('Error:', errorData);
        alert('Failed to save task.');
      }
    } catch (error) {
      console.error('Error saving task:', error);
      alert('An error occurred while saving the task.');
    }
  };

  // Handle schedule changes
  const handleScheduleChange = (index, field, value) => {
    const updatedSchedules = [...schedules];
    updatedSchedules[index][field] = value;
    setSchedules(updatedSchedules);
  };

  if (!isLoggedIn) {
    // If the user is not logged in, show a prompt to log in or register
    return (
      <div className="add-task-body">
        <Navbar title="Add Task" />
        <div className="auth-prompt">
          <p>You are not logged in. Please log in or register to add tasks.</p>

          <button onClick={() => navigate('/signin')} className="auth-button">
            Log In
          </button>
          <button onClick={() => navigate('/register')} className="auth-button">
            Register
          </button>
        </div>
        <BottomNavigation />
      </div>
    );
  }
else
  return (
    <div className="add-task-body">
      <Navbar title={taskToEdit ? 'Update Task' : 'Add Task'} />
      <div className="add-task-container">
        <form onSubmit={handleSubmit}>
          <label>
            Task Name:
            <input
              type="text"
              placeholder="Enter task name"
              value={taskName}
              onChange={(e) => setTaskName(e.target.value)}
              required
            />
          </label>

          <label>
            Description:
            <textarea
              placeholder="Enter task description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            ></textarea>
          </label>

          <label>
            Due Date:
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              required
            />
          </label>

          <label>
            Priority:
            <select value={priority} onChange={(e) => setPriority(e.target.value)}>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </label>

          <label>
            Completed::
            <input
              type="checkbox"
              checked={status}
              onChange={(e) => setStatus(e.target.checked)}
            />
          </label>

          {schedules.map((schedule, index) => (
            <div key={index} className="schedule-fields">
              <label>
                Start Time:
                <input
                  type="datetime-local"
                  value={schedule.start_time}
                  onChange={(e) =>
                    handleScheduleChange(index, 'start_time', e.target.value)
                  }
                  required
                />
              </label>
              <label>
                End Time:
                <input
                  type="datetime-local"
                  value={schedule.end_time}
                  onChange={(e) =>
                    handleScheduleChange(index, 'end_time', e.target.value)
                  }
                  required
                />
              </label>
            </div>
          ))}

          <button className='auth-button' type="submit">{taskToEdit ? 'Update Task' : 'Add Task'}</button>
        </form>
      </div>
      <BottomNavigation />
    </div>
  );
}

export default AddTask;