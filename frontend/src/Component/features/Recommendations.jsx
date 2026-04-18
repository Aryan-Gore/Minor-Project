import React, { useState, useEffect } from "react";
import "../CSS-file/Recommendation.css";

function Recommendations() {
  const [recs, setRecs] = useState([]);
  const [villagesMap, setVillagesMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = window.__authToken;

    if (!token) {
      setError("Not logged in");
      setLoading(false);
      return;
    }

    // 🔥 1. Fetch recommendations
    fetch("http://localhost:8080/api/recommendations", {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then(data => setRecs(data))
      .catch(() => setError("Failed to load recommendations"));

    // 🔥 2. Fetch villages and create map
    fetch("http://localhost:8080/api/villages", {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        const map = {};
        data.forEach(v => {
          map[v._id] = v.villageName;   // 🔥 ID → Name mapping
        });
        setVillagesMap(map);
      })
      .catch(() => setError("Failed to load villages"))
      .finally(() => setLoading(false));

  }, []);

  if (loading) return <p>Loading recommendations...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div className="rec-wrapper">
      <div className="rec-card">
        <h2>Recommendations</h2>

        <table className="rec-table">
          <thead>
            <tr>
              <th>Village ID</th>
              <th>Village Name</th>
              <th>Top Scheme</th>
              <th>Top Score</th>
            </tr>
          </thead>

          <tbody>
            {recs.map(r => (
              <tr key={r.villageId}>
                <td>{r.villageId}</td>

                {/* ✅ Village Name */}
                <td>{villagesMap[r.villageId] || "Loading..."}</td>

                <td>
                  <span style={{
                    background: schemeColor(r.topScheme),
                    color: "white",
                    padding: "5px 12px",
                    borderRadius: "20px",
                    fontSize: "12px"
                  }}>
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

// 🎨 Better UI color theme
function schemeColor(code) {
  const colors = {
    SSA: "#4facfe",
    MSSC: "#00c6ff",
    SCSS: "#2a5298",
    PPF: "#1e3c72",
    PLI: "#43e97b",
    RPLI: "#38f9d7",
    RD_TD: "#667eea"
  };
  return colors[code] || "#999";
}

export default Recommendations;