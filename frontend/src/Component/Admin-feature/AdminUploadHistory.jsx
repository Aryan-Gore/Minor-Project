import React, { useEffect, useState } from "react";
import "../CSS-file/UploadHistory.css";

function UploadHistory() {
  const [logs, setLogs] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [typeFilter, setTypeFilter] = useState("ALL");
  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const token = window.__authToken || "";

  useEffect(() => {
    let isMounted = true; // 👈 important (prevents flicker bug)

    const fetchLogs = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch("http://localhost:8080/api/uploads", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (!res.ok) {
          const text = await res.text();
          throw new Error(text || "Failed to load upload logs");
        }

        const data = await res.json();

        if (isMounted) {
          setLogs(data || []);
          setFiltered(data || []);
        }

      } catch (err) {
        console.error(err);

        if (isMounted) {
          setError(err.message);
        }

      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchLogs();

    return () => {
      isMounted = false;
    };
  }, [token]);

  // filter logic
  useEffect(() => {
    let data = [...(logs || [])];

    if (typeFilter !== "ALL") {
      data = data.filter(l => l.source === typeFilter);
    }

    if (search) {
      data = data.filter(l =>
        String(l.id).includes(search)
      );
    }

    data.sort((a, b) => (b.id || "").localeCompare(a.id || ""));

    setFiltered(data);
  }, [logs, typeFilter, search]);

  // ===== UI RULE FIX =====

  if (loading) {
    return <p className="status">Loading upload logs...</p>;
  }

  if (error && !loading) {
    return <p className="status error">❌ {error}</p>;
  }

  return (
    <div className="log-wrapper">

      <h2>Upload History</h2>

      <div className="controls">
        <input
          placeholder="Search by Upload ID"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
        >
          <option value="ALL">All Types</option>
          <option value="CSV">CSV</option>
          <option value="EXCEL">Excel</option>
        </select>
      </div>

      <table className="log-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Type</th>
            <th>Total</th>
            <th>Failed</th>
            <th>Errors</th>
          </tr>
        </thead>

        <tbody>
          {filtered.length > 0 ? (
            filtered.map(log => (
              <tr key={log.id}>

                <td title={log.id}>{log.id?.substring(0,8)}...</td>

                <td>
                  <span className={`badge ${log.source?.toLowerCase()}`}>
                    {log.source}
                  </span>
                </td>

                <td>{log.totalRows}</td>
                <td>{log.failedRows}</td>

                <td>
                  {log.errors?.length ? (
                    <details>
                      <summary>View</summary>
                      <ul>
                        {log.errors.map((e, i) => (
                          <li key={i}>{e}</li>
                        ))}
                      </ul>
                    </details>
                  ) : "—"}
                </td>

              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5">No logs found</td>
            </tr>
          )}
        </tbody>

      </table>

    </div>
  );
}

export default UploadHistory;