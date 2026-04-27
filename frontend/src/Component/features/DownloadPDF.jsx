import React from "react";

//  This component is now standalone — just pass district as prop
// Usage: <DownloadPDF district="North 24 Parganas" />
// Note: PDF download is also built into Reports.jsx directly
// Keep this file in case it is used elsewhere

function DownloadPDF({ district }) {

  const download = () => {
    const token = window.__authToken;

    if (!district) {
      alert("No district selected"); return;
    }

    fetch(`http://localhost:8080/api/reports/export/${district}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        if (!res.ok) throw new Error("Download failed");
        return res.blob();
      })
      .then(blob => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${district}-report.pdf`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      })
      .catch(() => alert("PDF download failed"));
  };

  return (
    <button onClick={download}>
      Download PDF Report
    </button>
  );
}

export default DownloadPDF;