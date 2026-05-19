import React, { useEffect, useState } from 'react';
import API from '../api';

function Profile() {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await API.get('users/me/');
                setUser(response.data);
            } catch (error) {
                console.error('Failed to fetch user details:', error);
            }
        };
        fetchUser();
    }, []);

    if (!user) {
        return <p>Loading...</p>;
    }

    return (
        <div>
            <h2>Profile</h2>
            <p>Username: {user.username}</p>
            <p>Email: {user.email}</p>
        </div>
    );
}

export default Profile;