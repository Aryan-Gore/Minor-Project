import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../Admin.css";

function Admin() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Form state for creating new user
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

  if (loading) return <p>Loading...</p>;

  return (
    <div style={{ padding: 24 }}>
      <div style={{ display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center" }}>
        <h1>Admin Dashboard</h1>
        <button onClick={handleLogout}
                style={{ background: "#e53935", color: "white",
                         border: "none", padding: "8px 16px",
                         borderRadius: 8, cursor: "pointer" }}>
          Logout
        </button>
      </div>

      {/* Create user form */}
      <div style={{ border: "1px solid #ddd", borderRadius: 8,
                    padding: 16, marginBottom: 24 }}>
        <h3>Create New User</h3>
        <input placeholder="Name" value={name}
               onChange={e => setName(e.target.value)}
               style={{ marginBottom: 8, display: "block", padding: 6 }} />
        <input placeholder="Email" type="email" value={email}
               onChange={e => setEmail(e.target.value)}
               style={{ marginBottom: 8, display: "block", padding: 6 }} />
        <input placeholder="Password" type="password" value={password}
               onChange={e => setPassword(e.target.value)}
               style={{ marginBottom: 8, display: "block", padding: 6 }} />
        <select value={role} onChange={e => setRole(e.target.value)}
                style={{ marginBottom: 8, display: "block", padding: 6 }}>
          <option value="USER">USER</option>
          <option value="ADMIN">ADMIN</option>
        </select>
        <button onClick={createUser}>Create User</button>
      </div>

      {/* Users table */}
      <h3>All Users</h3>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ background: "#1a3a5c", color: "white" }}>
            <th style={{ padding: 10 }}>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {users.map(u => (
            <tr key={u.id}
                style={{ borderBottom: "1px solid #eee" }}>
              <td style={{ padding: 10 }}>{u.name}</td>
              <td>{u.email}</td>
              <td>{u.role}</td>
              <td style={{ color: u.isActive ? "green" : "red" }}>
                {u.isActive ? "Active" : "Inactive"}
              </td>
              <td>
                {u.isActive && (
                  <button
                    onClick={() => deactivateUser(u.id)}
                    style={{ background: "#e53935", color: "white",
                             border: "none", padding: "4px 10px",
                             borderRadius: 6, cursor: "pointer" }}>
                    Deactivate
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Admin;