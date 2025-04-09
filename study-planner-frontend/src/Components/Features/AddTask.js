import React, { useState } from 'react';
import Navbar from '../Navbar';
import './addtask.css';
import BottomNavBar from '../BottomNavigationBar';
import axios from 'axios';

function AddTask() {
  const [taskName, setTaskName] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState('low');
  const [status, setStatus] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    const taskData = {
      name: taskName,
      description: taskDescription,
      due_date: dueDate,
      priority,
      status,
    };

    try {
      const response = await axios.post('http://localhost:5001/api/tasks', taskData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      setMessage('Task added successfully!');
      setTaskName('');
      setTaskDescription('');
      setDueDate('');
      setPriority('low');
      setStatus(false);
    } catch (error) {
      console.error('Error adding task:', error);
      setMessage('Failed to add task. Please try again.');
    }
  };

  return (
    <div className="add-task">
      <Navbar title="Add Task" />
      <div className="content">
        <h2>Add a New Task</h2>
        {message && <p className="message">{message}</p>}
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
          <div className="form-group">
            <label htmlFor="dueDate">Due Date:</label>
            <input
              type="date"
              id="dueDate"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="priority">Priority:</label>
            <select
              id="priority"
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              required
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="status">Completed:</label>
            <input
              type="checkbox"
              id="status"
              checked={status}
              onChange={(e) => setStatus(e.target.checked)}
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