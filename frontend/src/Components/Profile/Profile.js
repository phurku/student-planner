
import React from 'react';
import { useParams ,useNavigate} from 'react-router-dom';
import { useEffect } from 'react';
import { buildApiUrl } from '../../config';

function Profile() {
    const { token } = useParams();
    const navigate = useNavigate();
  useEffect(() => {
      const fetchUserProfile = async () => {
        try {
          const response = await fetch(buildApiUrl('users/verify_email/'), {
            method: 'POST',
            body: JSON.stringify({ token }),
            headers: {
              'Content-Type': 'application/json',
            },
          });
  
          if (response.ok) {
            const data = await response.json();
            console.log('User Profile:', data);
            navigate('/signin'); // Redirect to login page after successful verification
          } else {
          }
        } catch (error) {
          console.error('Error fetching user profile:', error);
        }
      };
  
      fetchUserProfile();
    }, []);
  

    return (
        <div className="profile-container">
            <h1>User Profile</h1>
            <p>Token: {token}</p>
            
            {/* Add user profile details here */}
        </div>
    );
}
export default Profile;