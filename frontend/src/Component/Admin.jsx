import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import "./CSS-file/Admin.css";
import { useAuth } from "../context/Authcontext.jsx";
import {
  LayoutDashboard,
  MapPin,
  Target,
  Calendar,
  History,
  Users,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  User as UserIcon
} from "lucide-react";
import { useState } from "react";

function Admin() {
  const location = useLocation();
  const navigate = useNavigate();
  const { auth, logout } = useAuth();
  const [collapsed, setCollapsed] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const isActive = (path) => location.pathname.startsWith(`/admin/${path}`);

  return (
    <div className="admin-layout">

      <div className={`admin-sidebar ${collapsed ? "collapsed" : ""}`}>

        {/* HEADER */}
        <div className="sidebar-header">
          {!collapsed && (
            <div className="admin-logo">
              <div className="logo-icon">IP</div>
              <span>India Post</span>
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
          <Link className={isActive("dashboard") ? "active" : ""} to="/admin/dashboard">
            <LayoutDashboard />
            {!collapsed && <span>Dashboard</span>}
          </Link>

          <Link className={isActive("villages") ? "active" : ""} to="/admin/villages">
            <MapPin />
            {!collapsed && <span>Villages</span>}
          </Link>

          <Link className={isActive("recommendations") ? "active" : ""} to="/admin/recommendations">
            <Target />
            {!collapsed && <span>Recommendations</span>}
          </Link>

          <Link className={isActive("mela") ? "active" : ""} to="/admin/mela">
            <Calendar />
            {!collapsed && <span>Schedule Mela</span>}
          </Link>

          <Link className={isActive("upload-history") ? "active" : ""} to="/admin/upload-history">
            <History />
            {!collapsed && <span>Upload Logs</span>}
          </Link>

          <Link className={isActive("users") ? "active" : ""} to="/admin/users">
            <Users />
            {!collapsed && <span>Users Management</span>}
          </Link>
        </nav>

        {/* FOOTER */}
        <div className="sidebar-footer">
          <div className="user-profile">
            <div className="avatar">
              <UserIcon />
            </div>

            {!collapsed && (
              <div className="user-info">
                <span className="user-name">{auth?.name || "Admin"}</span>
                <span className="user-role">Administrator</span>
              </div>
            )}
          </div>

          <button className="admin-logout-btn" onClick={handleLogout}>
            <LogOut />
            {!collapsed && <span>Logout</span>}
          </button>
        </div>
      </div>

      <div className="admin-content">
        <Outlet />
      </div>

    </div>
  );
}

export default Admin;