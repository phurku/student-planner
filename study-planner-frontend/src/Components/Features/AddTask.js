import React, { useState } from 'react';
import Navbar from '../Navbar';
import './addtask.css';
import BottomNavBar from '../BottomNavigationBar';
// import axios from 'axios';

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
  
    };



  return (
    <div className="add-task-container">
      <Navbar title="Add Task" />
     
      <BottomNavBar />
    </div>
  );
}

export default AddTask;