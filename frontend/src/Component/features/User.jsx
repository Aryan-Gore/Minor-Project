import React from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import "../CSS-file/User.css";

function User() {
  const navigate = useNavigate();

  const handleLogout = () => {
    window.__authToken = null;
    navigate("/");
  };

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

        {/* ✅ Logout button */}
        <button
          onClick={handleLogout}
          style={{ marginTop: "auto", background: "#e53935",
                   color: "white", border: "none", padding: "8px 16px",
                   borderRadius: 8, cursor: "pointer", width: "100%" }}>
          Logout
        </button>
      </div>

      {/* Content Area */}
      <div className="content">
        <Outlet />
      </div>

    </div>
  );
}

export default User;