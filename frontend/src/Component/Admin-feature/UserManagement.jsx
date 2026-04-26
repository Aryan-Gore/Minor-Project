import React, { useEffect, useState } from "react";
import "../CSS-file/UserManagement.css";

function UserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = window.__authToken;

  useEffect(() => {
    fetch("http://localhost:8080/api/users", {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => setUsers(data))
      .catch(() => alert("Failed to load users"))
      .finally(() => setLoading(false));
  }, []);

  // 🔁 Change Role
  const changeRole = (id, role) => {
    fetch(`http://localhost:8080/api/users/${id}/role`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ role })
    })
      .then(res => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then(() => {
        setUsers(prev =>
          prev.map(u => u.id === id ? { ...u, role } : u)
        );
      })
      .catch(() => alert("Role update failed"));
  };

  // 🚫 Toggle Active/Disable
  const toggleActive = (id, active) => {
    fetch(`http://localhost:8080/api/users/${id}/status`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ active: !active })
    })
      .then(res => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then(() => {
        setUsers(prev =>
          prev.map(u =>
            u.id === id ? { ...u, active: !active } : u
          )
        );
      })
      .catch(() => alert("Status update failed"));
  };

  if (loading) return <p className="status-text">Loading users...</p>;

  return (
    <div className="user-wrapper">

      <h2>User Management</h2>

      <table className="user-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {users.map(user => (
            <tr key={user.id}>

              <td>{user.name}</td>
              <td>{user.email}</td>

              {/* Role dropdown */}
              <td>
                <select
                  value={user.role}
                  onChange={(e) =>
                    changeRole(user.id, e.target.value)
                  }
                >
                  <option value="ADMIN">Admin</option>
                  <option value="USER">User</option>
                </select>
              </td>

              {/* Status */}
              <td>
                <span
                  className={
                    user.active ? "status active" : "status inactive"
                  }
                >
                  {user.active ? "Active" : "Disabled"}
                </span>
              </td>

              {/* Actions */}
              <td>
                <button
                  className={user.active ? "btn-disable" : "btn-enable"}
                  onClick={() =>
                    toggleActive(user.id, user.active)
                  }
                >
                  {user.active ? "Disable" : "Enable"}
                </button>
              </td>

            </tr>
          ))}
        </tbody>
      </table>

    </div>
  );
}

export default UserManagement;