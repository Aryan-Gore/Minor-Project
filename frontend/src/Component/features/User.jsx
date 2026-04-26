import { Link, Outlet, useNavigate } from "react-router-dom";
import "../CSS-file/User.css";
import { useAuth } from "../../context/Authcontext.jsx";
import {
  Upload,
  History,
  MapPin,
  Target,
  Calendar,
  FileText,
  LogOut
} from "lucide-react";

function User() {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="container">

      {/* Sidebar */}
      <div className="sidebar">
        <h3 className="logo">User Menu</h3>

        <ul className="menu">
          <li><Link to="upload"><Upload size={18} /> Upload</Link></li>
          <li><Link to="history"><History size={18} /> Upload History</Link></li>
          <li><Link to="villages"><MapPin size={18} /> Villages</Link></li>
          <li><Link to="recommendations"><Target size={18} /> Recommendations</Link></li>
          <li><Link to="melas"><Calendar size={18} /> Melas</Link></li>
          <li><Link to="reports"><FileText size={18} /> Reports</Link></li>
        </ul>

        {/* ✅ Logout button */}
        <button
          onClick={handleLogout}
          className="user-logout-btn"
        >
          <LogOut size={18} /> Logout
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