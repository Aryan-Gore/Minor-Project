import React, { useState, useEffect } from "react";
import "../CSS-file/Report.css";

function Reports() {
  const [district, setDistrict] = useState("");
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);

  // ✅ Fetch when district is selected
  useEffect(() => {
    if (!district) return;

    const token = window.__authToken; // ✅ fixed
    setLoading(true);
    setReport(null);

    fetch(`http://localhost:8080/api/reports/district/${district}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => setReport(data))
      .catch(err => console.log(err))
      .finally(() => setLoading(false));

  }, [district]);

  // ✅ PDF download
  const downloadPDF = () => {
    const token = window.__authToken;

    fetch(`http://localhost:8080/api/reports/export/${district}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.blob())
      .then(blob => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${district}-report.pdf`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      })
      .catch(() => alert("PDF download failed"));
  };

  return (
    <div className="report-wrapper">
      <div className="report-card">
        <h2>District Report</h2>

        {/* ✅ District input — type and press Enter or click button */}
        <div style={{ marginBottom: 20 }}>
          <input
            type="text"
            placeholder="Enter district name e.g. North 24 Parganas"
            value={district}
            onChange={e => setDistrict(e.target.value)}
            style={{ padding: 8, width: 300, marginRight: 8 }}
          />
        </div>

        {loading && <p>Loading report...</p>}

        {!district && !loading && (
          <p>Enter a district name above to see the report</p>
        )}

        {report && (
          <>
            <h3>{report.district}</h3>
            <p>Total Villages: {report.totalVillages}</p>

            {report.schemes?.map((s, i) => (
              <div className="report-item" key={i}>
                <p><strong>{s.code}</strong></p>
                <p>Villages: {s.villageCount}</p>
                <p>Avg Score: {s.avgScore}</p>
              </div>
            ))}

            {/* ✅ PDF download button — only shows when report is loaded */}
            <button
              onClick={downloadPDF}
              style={{ marginTop: 16 }}
            >
              Download PDF
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default Reports;