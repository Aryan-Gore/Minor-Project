import React, { useState, useEffect } from "react";
import "../CSS-file/Recommendation.css"
function Recommendations() {
  const [recs, setRecs] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetch("http://localhost:8080/api/recommendations", {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => setRecs(data));
  }, []);

  return (
    <div className="rec-wrapper">

  <div className="rec-card">

    <h2>Recommendations</h2>

    <table className="rec-table">
      <thead>
        <tr>
          <th>Village</th>
          <th>Top Scheme</th>
          <th>Top Score</th>
        </tr>
      </thead>

      <tbody>
        {recs.map(r => (
          <tr key={r.villageId}>
            <td>{r.villageName}</td>
            <td>{r.topScheme}</td>
            <td>{r.topScore}</td>
          </tr>
        ))}
      </tbody>
    </table>

  </div>

</div>
  );
}

export default Recommendations;