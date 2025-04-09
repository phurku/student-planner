const cors = require('cors');
const express = require('express');
const jwt = require('jsonwebtoken');
const { Pool } = require('pg'); // Import PostgreSQL client
const app = express();

// Middleware
app.use(cors({ origin: 'http://localhost:3000' })); // Allow requests from the frontend
app.use(express.json({ limit: '110kb' })); // Parse JSON request bodies
app.use(express.urlencoded({ extended: true, limit: '50kb' })); // Parse URL-encoded request bodies

// PostgreSQL connection pool
const pool = new Pool({
  user: 'iamuser', // Replace with your PostgreSQL username
  host: 'localhost',
  database: 'tasksdb', // Replace with your database name
  password: 'your_postgres_password', // Replace with your PostgreSQL password
  port: 5432, // Default PostgreSQL port
});
// Test the database connection
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('Error connecting to the database:', err);
  } else {
    console.log('Database connected:', res.rows[0]);
  }
});
// Secret key for signing the token (use a secure key in production)
const SECRET_KEY = 'your-secret-key';

// Register endpoint
app.post('/register', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  try {
    const userExists = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (userExists.rows.length > 0) {
      return res.status(409).json({ message: 'User already exists' });
    }

    await pool.query('INSERT INTO users (email, password) VALUES ($1, $2)', [email, password]);
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Login endpoint
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  try {
    const user = await pool.query('SELECT * FROM users WHERE email = $1 AND password = $2', [email, password]);
    if (user.rows.length > 0) {
      const token = jwt.sign({ email }, SECRET_KEY, { expiresIn: '1h' });
      res.status(200).json({ message: 'Login successful', token });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Middleware to verify token
const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid token.' });
    }
    req.user = user;
    next();
  });
};

// Task management endpoints

// Create Task
// Create Task
app.post('/api/tasks', async (req, res) => {
    const { name, description, due_date, priority, status } = req.body;
  
    // Log the incoming request data
    console.log('Request body:', req.body);
  
    // Validate required fields
    if (!name || !description || !due_date || !priority) {
      return res.status(400).json({ message: 'All fields are required' });
    }
  
    // Validate priority
    const validPriorities = ['low', 'medium', 'high'];
    if (!validPriorities.includes(priority)) {
      return res.status(400).json({ message: 'Invalid priority value. Must be "low", "medium", or "high".' });
    }
  
    // Validate status
    if (typeof status !== 'boolean') {
      return res.status(400).json({ message: 'Invalid status value. Must be a boolean (true or false).' });
    }
  
    try {
        console.log('Executing query...');
        const result = await pool.query(
          'INSERT INTO tasks (name, description, due_date, priority, status) VALUES ($1, $2, $3, $4, $5) RETURNING *',
          [name, description, due_date, priority, status]
        );
    
        // Log the query result
        console.log('Query result:', result.rows[0]);
    
        res.status(201).json(result.rows[0]);
      } catch (error) {
        console.error('Error creating task:', error);
        res.status(500).json({ message: 'Internal server error' });
      }
  });
  // Update Task
  app.put('/api/tasks/:id', async (req, res) => {
    const { id } = req.params;
    const { name, description, due_date, priority, status } = req.body;
  
    if (!name || !description || !due_date || !priority) {
      return res.status(400).json({ message: 'All fields are required' });
    }
  
    try {
      const result = await pool.query(
        'UPDATE tasks SET name = $1, description = $2, due_date = $3, priority = $4, status = $5, updated_at = NOW() WHERE id = $6 RETURNING *',
        [name, description, due_date, priority, status, id]
      );
      if (result.rows.length === 0) {
        return res.status(404).json({ message: 'Task not found' });
      }
      res.json(result.rows[0]);
    } catch (error) {
      console.error('Error updating task:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });
  
  // Delete Task
  app.delete('/api/tasks/:id', async (req, res) => {
    const { id } = req.params;
  
    try {
      const result = await pool.query('DELETE FROM tasks WHERE id = $1 RETURNING *', [id]);
      if (result.rows.length === 0) {
        return res.status(404).json({ message: 'Task not found' });
      }
      res.json({ message: 'Task deleted successfully' });
    } catch (error) {
      console.error('Error deleting task:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

// Start the server
const PORT = 5001;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));