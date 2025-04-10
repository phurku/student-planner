import React, { useState } from 'react';
import API from '../api';
import AnalogClock from './ClockLogo';
import './Auth.css'; // Import your CSS file for styling
import { useNavigate } from 'react-router-dom';
function Register() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        console.log({
            username,
            email,
            password,
        }); // Log the data being sent
        try {
            const response = await API.post('users/', {
                username,
                email,
                password,
            });
            setMessage(response.data.message);
            navigate('/signin'); // Redirect to login page
        } catch (error) {
            console.error(error.response); // Log the error response
            setMessage(error.response?.data?.error || 'Registration failed');
        }
    };
    return (
        <div>
            <AnalogClock />
            <h2>Register</h2>
            <form onSubmit={handleRegister}>
                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                />
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button type="submit">Register</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
}

export default Register;