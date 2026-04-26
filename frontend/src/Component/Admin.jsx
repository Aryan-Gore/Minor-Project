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
  LogOut
} from "lucide-react";

function Admin() {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const isActive = (path) => location.pathname.startsWith(`/admin/${path}`);

  return (
    <div className="admin-layout">

      {/* SIDEBAR */}
      <div className="admin-sidebar">
        <h2 className="admin-logo">Admin Panel</h2>

        <nav>
          <Link className={isActive("dashboard") ? "active" : ""} to="/admin/dashboard">
            <LayoutDashboard size={18} /> Dashboard
          </Link>

          <Link className={isActive("villages") ? "active" : ""} to="/admin/villages">
            <MapPin size={18} /> Villages
          </Link>

          <Link className={isActive("recommendations") ? "active" : ""} to="/admin/recommendations">
            <Target size={18} /> Recommendations
          </Link>

          <Link className={isActive("mela") ? "active" : ""} to="/admin/mela">
            <Calendar size={18} /> Schedule Mela
          </Link>

          <Link className={isActive("upload-history") ? "active" : ""} to="/admin/upload-history">
            <History size={18} /> Upload Logs
          </Link>

          <Link className={isActive("users") ? "active" : ""} to="/admin/users">
            <Users size={18} /> Users
          </Link>
        </nav>

        {/* ✅ Logout button */}
        <button className="admin-logout-btn" onClick={handleLogout}>
          <LogOut size={18} /> Logout
        </button>
      </div>

      {/* CONTENT AREA */}
      <div className="admin-content">
        <Outlet />
      </div>

    </div>
  );
}

export default Admin;