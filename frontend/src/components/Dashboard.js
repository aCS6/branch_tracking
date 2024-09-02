import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './styles/dashboard.css'; // Import the CSS file

const Dashboard = () => {
  const [message, setMessage] = useState('');
  const [username, setUsername] = useState('');

  useEffect(() => {
    const fetchProtectedData = async () => {
      const token = localStorage.getItem('token');
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


  return (
    <div className="dashboard-container">
      <h2>{message}</h2>
      {username && <p>Hello {username}</p>}
    </div>
  );
};

export default Dashboard;
