import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../CSS-file/VillageManagement.css";
import { useAuth } from "../../context/Authcontext.jsx";

function VillageManagement() {
  const [villages, setVillages] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const { auth } = useAuth();
  const token = auth?.token;

  useEffect(() => {
    const fetchVillages = async () => {
      if (!token) {
        setError("You are not logged in. Please log in first.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");

        console.log("Fetching villages with token:", token ? "Token present" : "Token MISSING");

        const res = await fetch("http://localhost:8080/api/villages", {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (res.status === 403) {
          throw new Error("Access Denied: You do not have permission to view this page.");
        }

        if (!res.ok) throw new Error("Failed to fetch villages (" + res.status + ")");

        const data = await res.json();

        setVillages(data || []);
        setFiltered(data || []);
      } catch (err) {
        console.error("Fetch Error:", err);
        if (err instanceof TypeError && err.message === "Failed to fetch") {
          setError("Connection Refused: Is the Spring Boot backend (port 8080) running?");
        } else {
          setError("Unable to load villages: " + err.message);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchVillages();
  }, [token]);

  if (loading) {
    return <p className="status">Loading villages...</p>;
  }

  if (error) {
    return (
      <div className="status error">
        <p>❌ {error}</p>
        {error.includes("logged in") && (
          <button className="vm-login-btn" onClick={() => navigate("/")}>
            Go to Login Page
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="vm-wrapper">

      <h2>Village Management</h2>

      <table className="vm-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>District</th>
            <th>State</th>
            <th>Source</th>
          </tr>
        </thead>

        <tbody>
          {filtered.length === 0 ? (
            <tr>
              <td colSpan="4">No villages found</td>
            </tr>
          ) : (
            filtered.map(v => (
              <tr key={v.id}>
                <td
                  className="link"
                  onClick={() => navigate(`/admin/villages/${v.id}`)}
                >
                  {v.villageName}
                </td>
                <td>{v.district}</td>
                <td>{v.state}</td>
                <td>{v.source}</td>
              </tr>
            ))
          )}
        </tbody>

      </table>

    </div>
  );
}

export default VillageManagement;