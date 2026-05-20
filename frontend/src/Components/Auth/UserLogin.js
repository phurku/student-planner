import React, { useState } from 'react';
import API from '../../api';
import './Auth.css';
import AnalogClock from '../Layout/ClockLogo'; // Import your AnalogClock component
import { useNavigate } from 'react-router-dom';

function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false); // Add loading state
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');
        try {
            console.log('Sending login request:', { username, password });
            const response = await API.post('users/login/', {
                username,
                password,
            });
            const { access, refresh } = response.data;
            localStorage.setItem('access_token', access);
            localStorage.setItem('refresh_token', refresh);
            setMessage('Login successful');
            console.log('Login successful:', response.data);
            navigate('/home');
        } catch (error) {
            const serverMessage = error.response?.data?.error;
            if (serverMessage) {
                setMessage(serverMessage);
            } else if (error.response?.status === 401) {
                setMessage('Invalid username or password.');
            } else if (error.response?.status === 404) {
                setMessage('No account found with that username.');
            } else if (error.response?.status === 403) {
                setMessage('Account is not yet verified. Please check your email.');
            } else {
                setMessage('Login failed. Please try again.');
            }
            console.error('Login error:', error);
        } finally {
            setLoading(false);
        }
    };
    return (
        <div className="container">
            <AnalogClock />
            <form onSubmit={handleLogin} className="login-form">
                <h2>Login</h2>
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
                <button type="submit" disabled={loading}>
                    {loading ? 'Logging in...' : 'Login'}
                </button>
                
                <p>
                    Not a member? <a href="/register">Register</a>
                </p>
                <p>
                    Forgot your password? <a href="/forgot-password">Forget Password?</a></p>
            </form>
            {message && <p className="login-message">{message}</p>}
        </div>
    );
}

export default Login;