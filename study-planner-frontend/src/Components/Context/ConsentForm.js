import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { buildApiUrl } from '../../config';
import '../Auth/Auth.css'; // Import your CSS file for styling
function ConsentForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleConsent = async () => {
    setIsSubmitting(true);
    setError('');

    try {
      const response = await fetch(buildApiUrl('users/consent/'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('access_token')}`, // Include the token
        },
        body: JSON.stringify({ consent: true }),
      });

      if (response.ok) {
        console.log('Consent recorded successfully');
        navigate('/register'); // Redirect to the dashboard or home page
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to record consent. Please try again.');
      }
    } catch (err) {
      console.error('Error recording consent:', err);
      setError('An error occurred. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="consent-form">
      <h1>Terms and Conditions</h1>
      <p>
        By using this application, you agree to our terms and conditions, privacy policy, and data usage policies.
      </p>
      {error && <p className="error-message">{error}</p>}
      <button onClick={handleConsent} disabled={isSubmitting}>
        {isSubmitting ? 'Submitting...' : 'I Agree'}
      </button>
    </div>
  );
}

export default ConsentForm;