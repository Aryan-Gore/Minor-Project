import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../CSS-file/AdminRecommendations.css";

function Recommendations() {
  const [recs, setRecs] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [schemeFilter, setSchemeFilter] = useState("ALL");
  const [sortDesc, setSortDesc] = useState(true);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const token = window.__authToken;

  // ===== FETCH SAFE =====
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError("");

        const res = await fetch("http://localhost:8080/api/recommendations", {
          headers: {
            Authorization: `Bearer ${token || ""}`
          }
        });

        if (!res.ok) {
          const text = await res.text();
          throw new Error(text || "Failed to load recommendations");
        }

        const data = await res.json();

        setRecs(data || []);
        setFiltered(data || []);
      } catch (err) {
        console.error(err);
        setError(err.message || "Failed to load");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token]);

  // ===== FILTER + SORT =====
  useEffect(() => {
    let data = [...(recs || [])];

    if (schemeFilter !== "ALL") {
      data = data.filter(r => r.topScheme === schemeFilter);
    }

    data.sort((a, b) =>
      sortDesc
        ? (b.topScore || 0) - (a.topScore || 0)
        : (a.topScore || 0) - (b.topScore || 0)
    );

    setFiltered(data);
  }, [schemeFilter, sortDesc, recs]);

  // ===== LOADING =====
  if (loading) {
    return <p className="status-text">Loading recommendations...</p>;
  }

  // ===== ERROR =====
  if (error) {
    return <p className="status-text error">❌ {error}</p>;
  }

  return (
    <div className="rec-wrapper">

      <div className="rec-card">
        <h2>Recommendations</h2>

        {/* CONTROLS */}
        <div className="controls">

          <select
            value={schemeFilter}
            onChange={(e) => setSchemeFilter(e.target.value)}
          >
            <option value="ALL">All Schemes</option>
            <option value="SSA">SSA</option>
            <option value="MSSC">MSSC</option>
            <option value="SCSS">SCSS</option>
            <option value="PPF">PPF</option>
            <option value="PLI">PLI</option>
            <option value="RPLI">RPLI</option>
            <option value="RD_TD">RD/TD</option>
          </select>

          <button onClick={() => setSortDesc(!sortDesc)}>
            Sort: {sortDesc ? "High → Low" : "Low → High"}
          </button>

        </div>

        {/* TABLE */}
        <table className="rec-table">
          <thead>
            <tr>
              <th>Village</th>
              <th>Scheme</th>
              <th>Score</th>
            </tr>
          </thead>

          <tbody>
            {filtered.length > 0 ? (
              filtered.map(r => (
                <tr key={r.villageId}>

                  <td
                    className="village-link"
                    onClick={() =>
                      navigate(`/admin/villages/${r.villageId}`)
                    }
                  >
                    {r.villageName}
                  </td>

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
              ))
            ) : (
              <tr>
                <td colSpan="3">No recommendations found</td>
              </tr>
            )}
          </tbody>

        </table>

      </div>
    </div>
  );
}

// 🎨 Color mapping
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