import React from "react";
function DownloadPDF({ district }) {
  const token = localStorage.getItem("token");

  const download = () => {
    fetch(`http://localhost:8080/api/reports/export/${district}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.blob())
      .then(blob => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${district}-report.pdf`;
        a.click();
      });
  };

  return <button onClick={download}>Download PDF</button>;
}

// 🔥 Export the right component
export default DownloadPDF;