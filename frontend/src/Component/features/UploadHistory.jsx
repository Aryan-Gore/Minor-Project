import React, { useState, useEffect } from "react";
import "../CSS-file/UploadHistory.css";
function UploadHistory() {
  const [history, setHistory] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetch("http://localhost:8080/api/uploads", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setHistory(data));
  }, []);

  return (
    <div className="history-wrapper">
      <div className="history-card">
        <h2>Upload History</h2>

        <ul>
          {history.map((h) => (
            <li key={h.uploadId}>
              {h.uploadId} - {h.importedRows} imported
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default UploadHistory;
