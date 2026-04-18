import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../CSS-file/Village.css";

function Villages() {
  const [villages, setVillages] = useState([]);
  const [recommendations, setRecommendations] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = window.__authToken;  // ✅ read from window, not localStorage

    if (!token) {
      navigate("/");  // no token = go back to login
      return;
    }

    // Fetch villages and recommendations in parallel
    Promise.all([
      fetch("http://localhost:8080/api/villages", {
        headers: { Authorization: `Bearer ${token}` }
      }).then(r => r.json()),

      fetch("http://localhost:8080/api/recommendations", {
        headers: { Authorization: `Bearer ${token}` }
      }).then(r => r.json())
    ])
    .then(([villageData, recData]) => {
      setVillages(villageData);

      // Build a map: villageId → topScheme
      const map = {};
      recData.forEach(r => { map[r.villageId] = r.topScheme; });
      setRecommendations(map);
    })
    .catch(err => {
      console.log(err);
      setError("Failed to load villages. Is Spring Boot running?");
    })
    .finally(() => setLoading(false));

  }, []);

  if (loading) return <p>Loading villages...</p>;
  if (error)   return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div className="villages-wrapper">
      <div className="villages-card">
        <h1>Villages</h1>
        <table className="villages-table">
          <thead>
            <tr>
              <th>Village</th>
              <th>Block</th>
              <th>District</th>
              <th>State</th>
              <th>Top Scheme</th>
            </tr>
          </thead>
          <tbody>
            {villages.map(v => (
              <tr
                key={v.id}
                style={{ cursor: "pointer" }}
                onClick={() => navigate(`/user/villages/${v.id}`)}
              >
                <td>{v.villageName}</td>
                <td>{v.block}</td>
                <td>{v.district}</td>
                <td>{v.state}</td>
                <td>{recommendations[v.id] || "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Villages;