import React, { useState } from 'react';
import API from '../../api';
import AnalogClock from '../Layout/ClockLogo';
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
            console.log(response); // Log the response data
            setMessage(response.data.message || 'Registration successful! Please check your email to verify your account.');
            navigate('/signin'); // Redirect to login page
        } catch (error) {
            const data = error.response?.data;
            if (data && typeof data === 'object') {
                // Flatten all field-level and non-field errors into one readable message
                const messages = Object.entries(data)
                    .map(([field, msgs]) => {
                        const text = Array.isArray(msgs) ? msgs.join(' ') : String(msgs);
                        return field === 'non_field_errors' ? text : `${field}: ${text}`;
                    })
                    .join('  •  ');
                setMessage(messages || 'Registration failed. Please try again.');
            } else {
                setMessage('Registration failed. Please try again.');
            }
            console.error(data);
        }
    };
    return (
        <div className="container">
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
                <div class_name="">

                    <p>
                        By signing up, you agree to our <a href="/terms">Terms of Service</a> and <a href="/privacy">Privacy Policy</a>.
                    </p>                <input type="checkbox" required />

                </div>
                <button type="submit">Register</button>
                <p>
                    Already have an account? <a href="/signin">Login</a></p>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
}

export default Register;