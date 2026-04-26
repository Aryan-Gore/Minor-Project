import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../CSS-file/Recommendation.css";

function Recommendations() {
  const [recs, setRecs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const token = window.__authToken;

    if (!token) {
      setError("Not logged in");
      setLoading(false);
      return;
    }

    fetch("http://localhost:8080/api/recommendations", {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        if (!res.ok) throw new Error("Failed to load");
        return res.json();
      })
      .then(data => setRecs(data))
      .catch(() => setError("Failed to load recommendations"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="status-text">Loading recommendations...</p>;
  if (error) return <p className="status-text error">{error}</p>;

  return (
    <div className="rec-wrapper">
      <div className="rec-card">
        <h2>Recommendations</h2>

        <table className="rec-table">
          <thead>
            <tr>
              <th>Village Name</th>
              <th>Village ID</th>
              <th>Top Scheme</th>
              <th>Top Score</th>
            </tr>
          </thead>

          <tbody>
            {recs.map(r => (
              <tr key={r.villageId}>
                
                {/* 🔥 Clickable village name */}
                <td
                  className="village-link"
                  onClick={() => navigate(`/villages/${r.villageId}`)}
                >
                  {r.villageName}
                </td>

                <td>{r.villageId}</td>

                <td>
                  <span
                    className="scheme-badge"
                    style={{ background: schemeColor(r.topScheme) }}
                  >
                    {r.topScheme}
                  </span>
                </td>

                <td>
                  {r.topScore
                    ? Math.round(r.topScore * 100) + "%"
                    : "—"}
                </td>

              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// 🎨 Scheme color mapping
function schemeColor(code) {
  const colors = {
    SSA: "#E91E63",
    MSSC: "#9C27B0",
    SCSS: "#FF9800",
    PPF: "#2196F3",
    PLI: "#00BCD4",
    RPLI: "#4CAF50",
    RD_TD: "#795548"
  };
  return colors[code] || "#888";
}

export default Recommendations;