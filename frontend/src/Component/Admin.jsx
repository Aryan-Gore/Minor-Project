import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../Admin.css";

function Admin() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("USER");

  useEffect(() => {
    const token = window.__authToken;
    if (!token) { navigate("/"); return; }

    fetch("http://localhost:8080/api/users", {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => setUsers(data))
      .catch(err => console.log(err))
      .finally(() => setLoading(false));
  }, []);

  const createUser = () => {
    const token = window.__authToken;
    if (!name || !email || !password) {
      alert("Fill all fields"); return;
    }

    fetch("http://localhost:8080/api/users", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ name, email, password, role })
    })
      .then(res => res.json())
      .then(data => {
        setUsers(prev => [...prev, data]);
        setName(""); setEmail(""); setPassword("");
        alert("User created!");
      })
      .catch(() => alert("Failed to create user"));
  };

  const deactivateUser = (id) => {
    const token = window.__authToken;

    if (!window.confirm("Deactivate this user?")) return;

    fetch(`http://localhost:8080/api/users/${id}/deactivate`, {
      method: "PATCH",
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(() => {
        setUsers(prev =>
          prev.map(u => u.id === id ? { ...u, isActive: false } : u)
        );
      })
      .catch(() => alert("Failed to deactivate"));
  };

  const handleLogout = () => {
    window.__authToken = null;
    navigate("/");
  };

  if (loading) return <p style={{ color: "#e2e8f0", padding: 24 }}>Loading...</p>;

  return (
    <div className="admin-wrapper">
      <div className="admin-header">
        <h1 className="admin-title">Admin Dashboard</h1>
        <button className="admin-btn admin-btn-danger" onClick={handleLogout}>
          Logout
        </button>
      </div>

      {/* Create user form */}
      <div className="admin-card">
        <h3 className="admin-subtitle">Create New User</h3>
        <div className="admin-form-group">
          <input
            className="admin-input"
            placeholder="Name"
            value={name}
            onChange={e => setName(e.target.value)}
          />
          <input
            className="admin-input"
            placeholder="Email"
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
          <input
            className="admin-input"
            placeholder="Password"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
          <select
            className="admin-select"
            value={role}
            onChange={e => setRole(e.target.value)}
          >
            <option value="USER">USER</option>
            <option value="ADMIN">ADMIN</option>
          </select>
        </div>
        <button className="admin-btn admin-btn-primary" onClick={createUser}>
          Create User
        </button>
      </div>

      {/* Users table */}
      <div className="admin-card">
        <h3 className="admin-subtitle">All Users</h3>
        <table className="admin-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u.id}>
                <td>{u.name}</td>
                <td>{u.email}</td>
                <td>{u.role}</td>
                <td className={u.isActive ? "status-active" : "status-inactive"}>
                  {u.isActive ? "Active" : "Inactive"}
                </td>
                <td>
                  {u.isActive && (
                    <button
                      className="admin-btn admin-btn-danger"
                      onClick={() => deactivateUser(u.id)}
                    >
                      Deactivate
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Admin;