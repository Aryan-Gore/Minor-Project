import React, { useEffect, useState } from "react";
import "../CSS-file/AdminDashboard.css";

function AdminDashboard() {
  const [stats, setStats] = useState({
    villages: 0,
    uploads: 0,
    schemes: 0
  });

  const [recentUploads, setRecentUploads] = useState([]);
  const [topSchemes, setTopSchemes] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = window.__authToken;

  useEffect(() => {
    const fetchData = async () => {
      try {
        // ✅ Demo mode
        if (!token) {
          console.log("Demo mode");

          setStats({
            villages: 120,
            uploads: 35,
            schemes: 7
          });

          setRecentUploads([
            { id: "1", source: "CSV", totalRows: 200, failedRows: 5 },
            { id: "2", source: "Excel", totalRows: 150, failedRows: 2 },
            { id: "3", source: "CSV", totalRows: 300, failedRows: 10 }
          ]);

          setTopSchemes([
            ["SSA", 45],
            ["MSSC", 30],
            ["PPF", 25]
          ]);

          return;
        }

        // ✅ API mode
        const [villagesRes, uploadsRes, recRes] = await Promise.all([
          fetch("http://localhost:8080/api/villages", {
            headers: { Authorization: `Bearer ${token}` }
          }),
          fetch("http://localhost:8080/api/uploads", {
            headers: { Authorization: `Bearer ${token}` }
          }),
          fetch("http://localhost:8080/api/recommendations", {
            headers: { Authorization: `Bearer ${token}` }
          })
        ]);

        if (!villagesRes.ok || !uploadsRes.ok || !recRes.ok) {
          throw new Error("API failed");
        }

        const villagesData = await villagesRes.json();
        const uploadsData = await uploadsRes.json();
        const recData = await recRes.json();

        setStats({
          villages: villagesData.length || 0,
          uploads: uploadsData.length || 0,
          schemes: recData.length || 0
        });

        setRecentUploads(uploadsData.slice(0, 5));

        const schemeCount = {};
        recData.forEach(r => {
          if (r.topScheme) {
            schemeCount[r.topScheme] =
              (schemeCount[r.topScheme] || 0) + 1;
          }
        });

        const sortedSchemes = Object.entries(schemeCount)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 5);

        setTopSchemes(sortedSchemes);

      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token]);

  if (loading) return <p className="dash-loading">Loading Dashboard...</p>;

  return (
    <div className="dashboard">

      <h2 className="dash-title">Admin Dashboard</h2>

      {!token && (
        <p style={{ color: "#888", marginBottom: 10 }}>
          ⚠ Demo Mode (Login for real data)
        </p>
      )}

      {/* Stats */}
      <div className="stats-grid">
        <div className="stat-card">
          <h3>{stats.villages}</h3>
          <p>Total Villages</p>
        </div>

        <div className="stat-card">
          <h3>{stats.uploads}</h3>
          <p>Total Uploads</p>
        </div>

        <div className="stat-card">
          <h3>{stats.schemes}</h3>
          <p>Total Schemes</p>
        </div>
      </div>

      {/* Recent Uploads */}
      <div className="card">
        <h3>Recent Uploads</h3>

        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Type</th>
              <th>Total Rows</th>
              <th>Failed</th>
            </tr>
          </thead>
          <tbody>
            {recentUploads.map(u => (
              <tr key={u.id}>
                <td title={u.id}>{u.id?.toString().substring(0, 8)}...</td>
                <td>{u.source}</td>
                <td>{u.totalRows}</td>
                <td>{u.failedRows}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Top Schemes */}
      <div className="card">
        <h3>Top Performing Schemes</h3>

        <ul className="scheme-list">
          {topSchemes.map(([scheme, count]) => (
            <li key={scheme}>
              <span>{scheme}</span>
              <b>{count} villages</b>
            </li>
          ))}
        </ul>
      </div>

    </div>
  );
}

export default AdminDashboard;