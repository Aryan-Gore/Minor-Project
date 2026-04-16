import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "../CSS-file/Report.css";

function ReportDistrict() {

  const { district } = useParams(); // 🔥 yaha se milega
  const [report, setReport] = useState(null);
  const token = localStorage.getItem("token");

  useEffect(() => {

    if (!district) return;

    fetch(`http://localhost:8080/api/reports/district/${district}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => setReport(data))
      .catch(err => console.log(err));

  }, [district]);

  return (
    <div className="report-wrapper">
      <div className="report-card">

        {!district ? (
          <p>Please select a district</p>
        ) : !report ? (
          <p>No data available</p>
        ) : (
          <>
            <h2>{report.district}</h2>

            {report.schemes.map((s, i) => (
              <div className="report-item" key={i}>
                <p><strong>{s.code}</strong></p>
                <p>Villages: {s.villageCount}</p>
                <p>Score: {s.avgScore}</p>
              </div>
            ))}
          </>
        )}

      </div>
    </div>
  );
}

export default ReportDistrict;