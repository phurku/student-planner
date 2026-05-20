import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import BottomNavBar from '../Layout/BottomNavigationBar';
import Navbar from '../Layout/Navbar';
import { buildApiUrl } from '../../config';
import './statistics.css'; // Import your CSS file for styling

function Statistics() {
  const [taskDurations, setTaskDurations] = useState([]);

  useEffect(() => {
    const fetchTaskDurations = async () => {
      const token = localStorage.getItem('access_token');
      if (!token) {
        setTaskDurations([]);
        return;
      }

      try {
        const response = await fetch(buildApiUrl('timer/total-duration/'), {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.ok) {
          const data = await response.json();
          // Convert total_duration to minutes
          const timeInMinutes = data.map((task) => ({
            ...task,
            total_duration: task.total_duration / 60, // Convert seconds to minutes
          }));
          setTaskDurations(timeInMinutes); // Update the state with fetched durations
        } else {
          console.error('Failed to fetch task durations:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching task durations:', error);
      }
    };

    fetchTaskDurations();
  }, []);

  // Colors for the pie chart
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#FF6384', '#36A2EB'];

  return (
    <div className={`statistics-page`}> {/* Apply the theme class */}
      <Navbar title="Statistics" />

      <div className="statistics-container">
        {taskDurations.length > 0 ? (
          <div className="statistics-grid">
            {/* Table */}
            <div className="table-container">
              <h2 className="chart-title">Task Durations</h2>
              <table className="statistics-table">
                <thead>
                  <tr>
                    <th>Task Name</th>
                    <th>Total Time Spent (Minutes)</th>
                  </tr>
                </thead>
                <tbody>
                  {taskDurations.map((task) => (
                    <tr key={task.task_id}>
                      <td>{task.task_name}</td>
                      <td>{task.total_duration.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {/* Pie Chart */}
            <div className="chart-container">
              <h2 className="chart-title">Task Durations (Pie Chart)</h2>
              <p>Total Time: {taskDurations.reduce((sum, task) => sum + task.total_duration, 0).toFixed(2)} minutes</p>
              <PieChart width={400} height={400}>
                <Pie
                  data={taskDurations}
                  dataKey="total_duration"
                  nameKey="task_name"
                  cx="50%"
                  cy="50%"
                  outerRadius={150}
                  fill="#8884d8"
                  label
                >
                  {taskDurations.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </div>

            {/* Bar Chart */}
            <div className="chart-container">
              <h2 className="chart-title">Task Durations (Bar Chart)</h2>
              <BarChart
                width={600}
                height={300}
                data={taskDurations.map((task) => ({
                  task_name: task.task_name,
                  total_duration: task.total_duration.toFixed(2),
                }))}
                margin={{
                  top: 20,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="task_name" />
                <YAxis label={{ value: 'Minutes', angle: -90, position: 'insideLeft' }} />
                <Tooltip />
                <Legend />
                <Bar dataKey="total_duration" fill="#8884d8" name="Duration (Minutes)" />
              </BarChart>
            </div>
          </div>
        ) : (
          <p className="no-data-message">No data available.</p>
        )}
      </div>
      <BottomNavBar />
    </div>
  );
}

export default Statistics;