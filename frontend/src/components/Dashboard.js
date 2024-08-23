import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './styles/dashboard.css'; // Import the CSS file

const Dashboard = ({ setIsLoggedIn }) => {
  const [message, setMessage] = useState('');
  const [username, setUsername] = useState('');

  useEffect(() => {
    const fetchProtectedData = async () => {
      const token = localStorage.getItem('access_token');
      try {
        const response = await axios.get('http://0.0.0.0:9000/users/protected', {
          headers: {
            'Authorization': `${token}`
          }
        });
        setMessage(response.data.msg);
        setUsername(response.data.user);
      } catch (error) {
        setMessage('Failed to fetch protected data');
      }
    };

    fetchProtectedData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    setIsLoggedIn(false);
  };

  return (
    <div className="dashboard-container">
      <h2>{message}</h2>
      {username && <p>Hello {username}</p>}
      <button onClick={handleLogout} className="logout-button">Logout</button>
    </div>
  );
};

export default Dashboard;
