import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Todos from './components/Todos';
import Sidebar from './components/Sidebar';
import Branches from './components/BranchTrack';
import { ToastContainer } from 'react-toastify';

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('access_token'));

  return (
    <Router>
      <div style={{ display: 'flex' }}>
        {isLoggedIn && <Sidebar />}
        <div style={{ marginLeft: isLoggedIn ? '250px' : '0', padding: '20px', flex: 1 }}>
          {isLoggedIn ? (
            <Routes>
              <Route path="/" element={<Dashboard setIsLoggedIn={setIsLoggedIn} />} />
              <Route path="/todos" element={<Todos />} />
              <Route path="/branch_track" element={<Branches />} />
            </Routes>
          ) : (
            <Login setIsLoggedIn={setIsLoggedIn} />
          )}
        </div>
      </div>
      <ToastContainer />
    </Router>
  );
};

export default App;
