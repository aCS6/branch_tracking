import React from 'react';
import { Link } from 'react-router-dom';
import './styles/sidebar.css'; // Import CSS for sidebar

const Sidebar = () => {
    return (
      <div className="sidebar">
        <h2>
          <Link to="/">Menu</Link> {/* Make "Menu" clickable */}
        </h2>
        <ul>
          <li>
            <Link to="/todos">Todos</Link>
          </li>
          <li>
            <Link to="/branch_track">Branch Tracking</Link>
          </li>
          {/* Future menu items can be added here */}
        </ul>
      </div>
    );
  };
  
export default Sidebar;
