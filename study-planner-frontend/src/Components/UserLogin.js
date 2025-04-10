import React, { useState } from 'react';
import API from '../api';
import './Auth.css'; 
import AnalogCLock from './ClockLogo'; // Import your AnalogClock component
import { useNavigate } from 'react-router-dom';
function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();
    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await API.post('users/login/', {
                username,
                password,
            });
            const { access, refresh } = response.data;
            localStorage.setItem('access_token', access);
            localStorage.setItem('refresh_token', refresh);
            setMessage('Login successful');
            console.log('Login successful:', response.data);
            navigate('/home'); // Redirect to home page
            // Redirect to home page
        } catch (error) {
            setMessage(error.response?.data?.error || 'Login failed');
        }
    };

    return (
        <div>
                <AnalogCLock/>
            <form onSubmit={handleLogin}>
                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button type="submit">Login</button>
                Not a member? <a href="/register">Register</a>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
}

export default Login;