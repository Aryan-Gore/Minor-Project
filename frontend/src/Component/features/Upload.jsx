import React, { useState } from "react";
import "../CSS-file/Upload.css";

function Upload() {
  const [fileType, setFileType] = useState("csv");
  const [selectedFile, setSelectedFile] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const uploadFile = () => {
    const token = window.__authToken; 

    if (!token) { alert("Please login first"); return; }
    if (!selectedFile) { alert("Please select a file"); return; }

    if (fileType === "csv" && !selectedFile.name.endsWith(".csv")) {
      alert("Please upload a CSV file"); return;
    }
    if (fileType === "excel" && !selectedFile.name.match(/\.(xlsx|xls)$/)) {
      alert("Please upload an Excel file"); return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile); // key must be "file"

    // ✅ fixed URL — /api/upload/csv or /api/upload/excel
    const endpoint = fileType === "csv"
      ? "http://localhost:8080/api/upload/csv"
      : "http://localhost:8080/api/upload/excel";

    setLoading(true);
    setResult(null);

    fetch(endpoint, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      // ✅ DO NOT set Content-Type — browser sets it for FormData
      body: formData
    })
      .then(res => {
        if (!res.ok) throw new Error("Upload failed");
        return res.json();
      })
      .then(data => {
        // data = { uploadId, totalRows, importedRows, failedRows, errors[] }
        setResult(data);
      })
      .catch(() => alert("Upload failed. Is Spring Boot running?"))
      .finally(() => setLoading(false));
  };

  return (
    <div className="card">
      <h2>Upload Village Data</h2>

      <select value={fileType} onChange={(e) => setFileType(e.target.value)}>
        <option value="csv">CSV File</option>
        <option value="excel">Excel File</option>
      </select>

      <br /><br />

      <input
        type="file"
        onChange={(e) => setSelectedFile(e.target.files[0])}
        accept=".csv,.xlsx,.xls"
      />

      <br /><br />

      <button onClick={uploadFile} disabled={loading}>
        {loading ? "Uploading..." : "Upload"}
      </button>

      {/* ✅ Show result after upload */}
      {result && (
        <div style={{ marginTop: 20, padding: 16,
                      border: "1px solid #ddd", borderRadius: 8 }}>
          <p>✅ Imported: <strong>{result.importedRows}</strong> of <strong>{result.totalRows}</strong> rows</p>
          {result.failedRows > 0 && (
            <>
              <p style={{ color: "red" }}>❌ Failed: {result.failedRows} rows</p>
              <ul style={{ color: "red" }}>
                {result.errors?.map((e, i) => <li key={i}>{e}</li>)}
              </ul>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default Upload;