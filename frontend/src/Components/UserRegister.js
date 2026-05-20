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
            const successMessage = response?.data?.message || 'Registration successful.';
            setMessage(successMessage);

            // Only redirect immediately when account is already active.
            if (!successMessage.toLowerCase().includes('verify your email')) {
                setTimeout(() => navigate('/signin'), 1200);
            }
        } catch (error) {
            console.error(error.response); // Log the error response
            const errorData = error?.response?.data;
            if (typeof errorData === 'string') {
                setMessage(errorData);
            } else if (errorData?.error) {
                setMessage(errorData.error);
            } else if (errorData?.message) {
                setMessage(errorData.message);
            } else {
                setMessage('Registration failed');
            }
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