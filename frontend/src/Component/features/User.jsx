import { Link, Outlet, useNavigate, useLocation } from "react-router-dom";
import "../CSS-file/User.css";
import { useAuth } from "../../context/Authcontext.jsx";
import {
  Upload,
  History,
  MapPin,
  Target,
  Calendar,
  FileText,
  LogOut,
  X,
  Menu,
  User as UserIcon
} from "lucide-react";
import { useState } from "react";

function User() {
  const navigate = useNavigate();
  const location = useLocation();
  const { auth, logout } = useAuth();
  const [collapsed, setCollapsed] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const isActive = (path) => location.pathname.includes(`/user/${path}`);

  return (
    <div className="user-layout">

      {/* SIDEBAR */}
      <div className={`user-sidebar ${collapsed ? "collapsed" : ""}`}>

        {/* HEADER */}
        <div className="sidebar-header">
          {!collapsed && (
            <div className="user-logo-branding">
              <div className="logo-icon">UP</div>
              <span>User Panel</span>
            </div>
          )}

          <button
            className="toggle-btn"
            onClick={() => setCollapsed(!collapsed)}
          >
            {collapsed ? <Menu size={26} /> : <X size={26} />}
          </button>
        </div>

        {/* NAVIGATION */}
        <nav className="sidebar-nav">
          <Link className={isActive("upload") ? "active" : ""} to="upload">
            <Upload size={26} />
            {!collapsed && <span>Upload Data</span>}
          </Link>

          <Link className={isActive("history") ? "active" : ""} to="history">
            <History size={26} />
            {!collapsed && <span>Upload History</span>}
          </Link>

          <Link className={isActive("villages") ? "active" : ""} to="villages">
            <MapPin size={26} />
            {!collapsed && <span>Village List</span>}
          </Link>

          <Link className={isActive("recommendations") ? "active" : ""} to="recommendations">
            <Target size={26} />
            {!collapsed && <span>Recommendations</span>}
          </Link>

          <Link className={isActive("melas") ? "active" : ""} to="melas">
            <Calendar size={26} />
            {!collapsed && <span>Scheduled Melas</span>}
          </Link>

          <Link className={isActive("reports") ? "active" : ""} to="reports">
            <FileText size={26} />
            {!collapsed && <span>System Reports</span>}
          </Link>
        </nav>

        {/* FOOTER */}
        <div className="sidebar-footer">
          <div className="user-profile">
            <div className="avatar">
              <UserIcon size={26} />
            </div>

            {!collapsed && (
              <div className="user-info">
                <span className="user-name">{auth?.name || "User"}</span>
                <span className="user-role">Post Office User</span>
              </div>
            )}
          </div>

          <button className="user-logout-btn" onClick={handleLogout}>
            <LogOut size={26} />
            {!collapsed && <span>Logout</span>}
          </button>
        </div>
      </div>

      {/* CONTENT */}
      <div className="user-content">
        <Outlet />
      </div>

    </div>
  );
}

export default User;