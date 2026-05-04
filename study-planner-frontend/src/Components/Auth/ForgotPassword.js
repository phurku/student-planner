import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { buildApiUrl } from '../../config';
import './Auth.css'; // Import your CSS file for styling

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false); // Add loading state
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    setIsLoading(true); // Set loading state to true

    try {
      const response = await fetch(buildApiUrl('forget-password/'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Password reset link sent:', data);
        setMessage(data.success || 'Password reset link has been sent to your email.');
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to send password reset link. Please try again.');
      }
    } catch (error) {
      console.error('Error sending password reset request:', error);
      setError('An error occurred. Please try again later.');
    } finally {
      setIsLoading(false); // Set loading state to false
    }
  };

  return (
    <div className="container">
      <h1>Forgot Password</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="email">Email:</label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          required
        />
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Sending...' : 'Send Reset Link'}
        </button>
      </form>
      {message && (
        <div className="success-message">
          <p>{message}</p>
          <button onClick={() => navigate('/signin')}>Back to Login</button>
        </div>
      )}
      {error && (
        <div className="error-message">
          <p>{error}</p>
        </div>
      )}
    </div>
  );
}

export default ForgotPassword;