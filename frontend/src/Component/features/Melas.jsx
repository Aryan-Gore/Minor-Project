import React, { useState, useEffect } from "react";
import "../CSS-file/Meals.css";

function Melas() {
  const [melas, setMelas] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form state for scheduling new mela
  const [villageId, setVillageId] = useState("");
  const [schemeCode, setSchemeCode] = useState("SSA");
  const [date, setDate] = useState("");
  const [venue, setVenue] = useState("");
  const [villages, setVillages] = useState([]);

  useEffect(() => {
    const token = window.__authToken; // ✅ fixed

    // Fetch melas list
    fetch("http://localhost:8080/api/melas", {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => setMelas(data))
      .catch(err => console.log(err))
      .finally(() => setLoading(false));

    // Fetch villages for dropdown
    fetch("http://localhost:8080/api/villages", {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => setVillages(data))
      .catch(err => console.log(err));
  }, []);

  const scheduleMela = () => {
    const token = window.__authToken; // ✅ fixed

    if (!villageId || !schemeCode || !date || !venue) {
      alert("Please fill all fields"); return;
    }

    fetch("http://localhost:8080/api/melas", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        villageId,
        schemeCode,
        scheduledDate: date,
        venue
      })
    })
      .then(res => res.json())
      .then(data => {
        alert("Mela Scheduled!");
        setMelas(prev => [...prev, data]); // add to list
        // clear form
        setVillageId(""); setDate(""); setVenue("");
      })
      .catch(() => alert("Failed to schedule mela"));
  };

  if (loading) return <p>Loading melas...</p>;

  return (
    <div className="mela-wrapper">
      <div className="mela-card">
        <h2>Melas</h2>

        {/* ✅ Schedule form */}
        <div style={{ marginBottom: 24, padding: 16,
                      border: "1px solid #ddd", borderRadius: 8 }}>
          <h3>Schedule New Mela</h3>

          <select value={villageId}
                  onChange={e => setVillageId(e.target.value)}
                  style={{ marginBottom: 8, display: "block" }}>
            <option value="">Select Village</option>
            {villages.map(v => (
              <option key={v.id} value={v.id}>{v.villageName}</option>
            ))}
          </select>

          <select value={schemeCode}
                  onChange={e => setSchemeCode(e.target.value)}
                  style={{ marginBottom: 8, display: "block" }}>
            <option value="SSA">SSA</option>
            <option value="MSSC">MSSC</option>
            <option value="SCSS">SCSS</option>
            <option value="PPF">PPF</option>
            <option value="PLI">PLI</option>
            <option value="RPLI">RPLI</option>
            <option value="RD_TD">RD/TD</option>
          </select>

          <input type="date" value={date}
                 onChange={e => setDate(e.target.value)}
                 style={{ marginBottom: 8, display: "block" }} />

          <input type="text" placeholder="Venue"
                 value={venue}
                 onChange={e => setVenue(e.target.value)}
                 style={{ marginBottom: 8, display: "block" }} />

          <button onClick={scheduleMela}>Schedule Mela</button>
        </div>

        {/* Melas list */}
        {melas.length === 0 ? (
          <p>No Melas Scheduled</p>
        ) : (
          <ul>
            {melas.map(m => (
              <li key={m.id}> {/* ✅ fixed — was m._id */}
                <strong>{m.villageName}</strong> — {m.schemeCode}<br />
                <span>📅 {m.scheduledDate}</span><br />
                <span>📍 {m.venue}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default Melas;