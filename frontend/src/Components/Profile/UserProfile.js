import React, { useEffect, useState } from 'react';
import API from '../../api'; // Adjust the import based on your project structure

function UserProfile() {
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({ username: '', email: '' });

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('access_token');
      if (!token) {
        setUser(null);
        return;
      }

      try {
        const response = await API.get('users/me/');
        setUser(response.data);
        setFormData({ username: response.data.username, email: response.data.email });
      } catch (error) {
        console.error('Failed to fetch user details:', error);
      }
    };
    fetchUser();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await API.put('users/me/', formData);
      setUser(response.data); // Update the user state with the new data
      alert('Profile updated successfully!');
      
    } catch (error) {
      console.error('Failed to update user details:', error);
      alert('Failed to update profile.');
    }
  };

  if (!user) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <h2>Profile</h2>
      <form onSubmit={handleFormSubmit}>
        <label>
          Username:
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleInputChange}
          />
        </label>
        <br />
        <label>
          Email:
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
          />
        </label>
        <br />
        <button type="submit">Save Changes</button>
      </form>
    </div>
  );
}

export default UserProfile;