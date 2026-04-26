import React, { useEffect, useState } from "react";
import "../CSS-file/MelaScheduling.css";

function MelaScheduling() {
  const [villages, setVillages] = useState([]);
  const [selectedVillage, setSelectedVillage] = useState("");
  const [scheme, setScheme] = useState("");
  const [date, setDate] = useState("");
  const [loading, setLoading] = useState(false);

  const token = window.__authToken;

  // 📥 Fetch villages
  useEffect(() => {
    fetch("http://localhost:8080/api/villages", {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => setVillages(data))
      .catch(() => alert("Failed to load villages"));
  }, []);

  // 📤 Schedule mela
  const handleSubmit = () => {
    if (!selectedVillage || !scheme || !date) {
      return alert("Please fill all fields");
    }

    setLoading(true);

    fetch("http://localhost:8080/api/melas", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        villageId: selectedVillage,
        schemeCode: scheme,
        date: date
      })
    })
      .then(res => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then(() => {
        alert("Mela scheduled successfully ✅");
        setSelectedVillage("");
        setScheme("");
        setDate("");
      })
      .catch(() => alert("Failed to schedule mela"))
      .finally(() => setLoading(false));
  };

  return (
    <div className="mela-wrapper">

      <div className="mela-card">
        <h2>Schedule Scheme Mela</h2>

        {/* Village Select */}
        <label>Select Village</label>
        <select
          value={selectedVillage}
          onChange={(e) => setSelectedVillage(e.target.value)}
        >
          <option value="">-- Select Village --</option>
          {villages.map(v => (
            <option key={v.id} value={v.id}>
              {v.villageName}
            </option>
          ))}
        </select>

        {/* Scheme Select */}
        <label>Select Scheme</label>
        <select
          value={scheme}
          onChange={(e) => setScheme(e.target.value)}
        >
          <option value="">-- Select Scheme --</option>
          <option value="SSA">SSA</option>
          <option value="MSSC">MSSC</option>
          <option value="SCSS">SCSS</option>
          <option value="PPF">PPF</option>
          <option value="PLI">PLI</option>
          <option value="RPLI">RPLI</option>
          <option value="RD_TD">RD/TD</option>
        </select>

        {/* Date */}
        <label>Select Date</label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />

        {/* Submit */}
        <button onClick={handleSubmit} disabled={loading}>
          {loading ? "Scheduling..." : "Schedule Mela"}
        </button>
      </div>

    </div>
  );
}

export default MelaScheduling;