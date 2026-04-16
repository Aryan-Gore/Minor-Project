import React from "react";
import { Link, Outlet } from "react-router-dom";
import "../CSS-file/User.css";

function User() {
  return (

    <div className="container">

      {/* Sidebar */}
      <div className="sidebar">

        <h3 className="logo">User Menu</h3>

        <ul className="menu">

          <li><Link to="upload">Upload</Link></li>
          <li><Link to="history">Upload History</Link></li>
          <li><Link to="villages">Villages</Link></li>
          <li><Link to="recommendations">Recommendations</Link></li>
          <li><Link to="melas">Melas</Link></li>
          <li><Link to="reports">Reports</Link></li>

        </ul>

      </div>

      {/* Content Area */}
      <div className="content">
        <Outlet />
      </div>

    </div>

  );
}

export default User;