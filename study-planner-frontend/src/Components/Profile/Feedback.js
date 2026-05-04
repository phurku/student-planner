import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { buildApiUrl } from '../../config';
import Navbar from '../Layout/Navbar';
import BottomNavBar from '../Layout/BottomNavigationBar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faPaperPlane, faCheckCircle, faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import './Feedback.css';

const CATEGORIES = [
  { value: 'general',  label: 'General Feedback' },
  { value: 'bug',      label: 'Bug Report' },
  { value: 'feature',  label: 'Feature Request' },
  { value: 'ux',       label: 'UI / UX Issue' },
  { value: 'other',    label: 'Other' },
];

function Feedback() {
  const navigate = useNavigate();

  const [rating,   setRating]   = useState(0);
  const [hover,    setHover]    = useState(0);
  const [category, setCategory] = useState('');
  const [message,  setMessage]  = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error,    setError]    = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (rating === 0) {
      setError('Please select a star rating.');
      return;
    }
    if (!category) {
      setError('Please choose a feedback category.');
      return;
    }
    if (message.trim().length < 10) {
      setError('Please write at least 10 characters in your message.');
      return;
    }

    setError('');

    try {
      const token = localStorage.getItem('access_token');
      const headers = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const response = await fetch(buildApiUrl('feedback/'), {
        method: 'POST',
        headers,
        body: JSON.stringify({ rating, category, message }),
      });

      if (response.ok) {
        setSubmitted(true);
      } else {
        const data = await response.json();
        setError(data?.message || 'Something went wrong. Please try again.');
      }
    } catch {
      setError('Network error. Please check your connection and try again.');
    }
  };

  if (submitted) {
    return (
      <div className="fb-page">
        <Navbar title="Feedback" />
        <div className="fb-thanks">
          <div className="fb-thanks-icon">
            <FontAwesomeIcon icon={faCheckCircle} />
          </div>
          <h2>Thank you for your feedback!</h2>
          <p>Your response has been recorded. We really appreciate you taking the time to help us improve Study Mate.</p>
          <button className="fb-btn-primary" onClick={() => navigate('/settings')}>
            Back to Settings
          </button>
        </div>
        <BottomNavBar />
      </div>
    );
  }

  return (
    <div className="fb-page">
      <Navbar title="Feedback" />

      <div className="fb-container">
        {/* Back button */}
        <button className="fb-back" onClick={() => navigate('/settings')}>
          <FontAwesomeIcon icon={faChevronLeft} /> Back
        </button>

        <div className="fb-card">
          <div className="fb-card-header">
            <h1 className="fb-title">Share Your Feedback</h1>
            <p className="fb-subtitle">
              Help us make Study Mate better — every comment counts.
            </p>
          </div>

          <form className="fb-form" onSubmit={handleSubmit} noValidate>
            {/* Star rating */}
            <div className="fb-field">
              <label className="fb-label">How would you rate your experience?</label>
              <div className="fb-stars">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    type="button"
                    key={star}
                    className={`fb-star ${star <= (hover || rating) ? 'active' : ''}`}
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHover(star)}
                    onMouseLeave={() => setHover(0)}
                    aria-label={`${star} star${star > 1 ? 's' : ''}`}
                  >
                    <FontAwesomeIcon icon={faStar} />
                  </button>
                ))}
              </div>
              {rating > 0 && (
                <span className="fb-rating-text">
                  {['', 'Poor', 'Fair', 'Good', 'Very Good', 'Excellent'][rating]}
                </span>
              )}
            </div>

            {/* Category */}
            <div className="fb-field">
              <label className="fb-label" htmlFor="fb-category">Category</label>
              <select
                id="fb-category"
                className="fb-select"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="">Select a category…</option>
                {CATEGORIES.map((c) => (
                  <option key={c.value} value={c.value}>{c.label}</option>
                ))}
              </select>
            </div>

            {/* Message */}
            <div className="fb-field">
              <label className="fb-label" htmlFor="fb-message">Your Message</label>
              <textarea
                id="fb-message"
                className="fb-textarea"
                placeholder="Tell us what you think, what's broken, or what you'd love to see..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={5}
                maxLength={1000}
              />
              <span className="fb-char-count">{message.length} / 1000</span>
            </div>

            {/* Error */}
            {error && <p className="fb-error">{error}</p>}

            {/* Submit */}
            <button type="submit" className="fb-btn-primary">
              <FontAwesomeIcon icon={faPaperPlane} />
              Submit Feedback
            </button>
          </form>
        </div>
      </div>

      <BottomNavBar />
    </div>
  );
}

export default Feedback;
