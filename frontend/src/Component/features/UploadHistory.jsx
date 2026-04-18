import React, { useState, useEffect } from "react";
import "../CSS-file/UploadHistory.css";

function UploadHistory() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = window.__authToken; // ✅ fixed

    fetch("http://localhost:8080/api/uploads", {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => setHistory(data))
      .catch(err => console.log(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Loading history...</p>;

  return (
    <div className="history-wrapper">
      <div className="history-card">
        <h2>Upload History</h2>

        {history.length === 0 ? (
          <p>No uploads yet</p>
        ) : (
          <ul>
            {history.map((h) => (
              <li key={h.id}> {/* ✅ fixed — was h.uploadId */}
                <strong>{h.filename}</strong> — uploaded by {h.uploadedByName}<br />
                <span>{h.source} | {h.importedRows} imported</span>
                {h.failedRows > 0 && (
                  <span style={{ color: "red" }}> | {h.failedRows} failed</span>
                )}
                <br />
                <small>{h.uploadedAt}</small>

                {/* Show errors if any */}
                {h.errors?.length > 0 && (
                  <ul style={{ color: "red", fontSize: 12 }}>
                    {h.errors.map((e, i) => <li key={i}>{e}</li>)}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default UploadHistory;