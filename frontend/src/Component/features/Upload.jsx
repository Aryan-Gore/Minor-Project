import React, { useState } from "react";
import "../CSS-file/Upload.css";

function Upload() {

  const token = localStorage.getItem("token");

  const [fileType, setFileType] = useState("csv");
  const [selectedFile, setSelectedFile] = useState(null);

  const uploadFile = () => {

    if (!token) {
      alert("Please login first");
      return;
    }

    if (!selectedFile) {
      alert("Please select a file");
      return;
    }

    // validation
    if (fileType === "csv" && !selectedFile.name.endsWith(".csv")) {
      alert("Upload CSV file only");
      return;
    }

    if (fileType === "excel" && !selectedFile.name.match(/\.(xlsx|xls)$/)) {
      alert("Upload Excel file only");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);

    fetch(`http://localhost:8080/api/upload/${fileType}`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: formData
    })
      .then(res => {
        if (!res.ok) throw new Error("Upload failed");
        return res.json();
      })
      .then(() => alert("Uploaded Successfully!"))
      .catch(() => alert("Upload failed"));
  };

  return (
    <div className="card">

      <h2>Upload Village Data</h2>

      <select 
        value={fileType} 
        onChange={(e) => setFileType(e.target.value)}
      >
        <option value="csv">CSV File</option>
        <option value="excel">Excel File</option>
      </select>

      <br /><br />

      <input 
        type="file"
        onChange={(e) => setSelectedFile(e.target.files[0])}
        accept=".csv, .xlsx, .xls"
      />

      <br /><br />

      <button onClick={uploadFile}>Upload</button>

    </div>
  );
}

export default Upload;