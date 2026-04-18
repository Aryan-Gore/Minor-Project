import React, { useState, useEffect } from "react";
import "../CSS-file/Recommendation.css";

function Recommendations() {
  const [recs, setRecs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = window.__authToken; // ✅ fixed

    if (!token) { setError("Not logged in"); return; }

    fetch("http://localhost:8080/api/recommendations", {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        if (!res.ok) throw new Error("Failed to load");
        return res.json();
      })
      .then(data => setRecs(data))
      .catch(err => setError("Failed to load recommendations"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Loading recommendations...</p>;
  if (error)   return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div className="rec-wrapper">
      <div className="rec-card">
        <h2>Recommendations</h2>

        <table className="rec-table">
          <thead>
            <tr>
              <th>Village ID</th>
              <th>Top Scheme</th>
              <th>Top Score</th>
            </tr>
          </thead>
          <tbody>
            {recs.map(r => (
              <tr key={r.villageId}>
                <td>{r.villageId}</td>
                <td>
                  {/* Scheme badge with colour */}
                  <span style={{
                    background: schemeColor(r.topScheme),
                    color: "white",
                    padding: "3px 10px",
                    borderRadius: 12,
                    fontSize: 12
                  }}>
                    {r.topScheme}
                  </span>
                </td>
                <td>{r.topScore
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

// Scheme colour map
function schemeColor(code) {
  const colors = {
    SSA:   "#E91E63",
    MSSC:  "#9C27B0",
    SCSS:  "#FF9800",
    PPF:   "#2196F3",
    PLI:   "#00BCD4",
    RPLI:  "#4CAF50",
    RD_TD: "#795548"
  };
  return colors[code] || "#888";
}

export default Recommendations;