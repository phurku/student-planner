import React, { useState } from 'react';
import Navbar from '../Navbar';
import './addtask.css';
import BottomNavBar from '../BottomNavigationBar';
function AddTask() {
  const [taskName, setTaskName] = useState('');
  const [taskDescription, setTaskDescription] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log('Task Name:', taskName);
    console.log('Task Description:', taskDescription);
    // Add your task submission logic here
  };

  return (
    <div className="add-task">
      <Navbar title="Add Task" />
      <div className="content">
        <h2>Add a New Task</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="taskName">Task Name:</label>
            <input
              type="text"
              id="taskName"
              value={taskName}
              onChange={(e) => setTaskName(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="taskDescription">Task Description:</label>
            <textarea
              id="taskDescription"
              value={taskDescription}
              onChange={(e) => setTaskDescription(e.target.value)}
              required
            />
          </div>
          <button type="submit">Add Task</button>
        </form>
      </div>
        <BottomNavBar />
    </div>
  );
}

export default AddTask;