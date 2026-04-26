import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../CSS-file/AdminVillageDetail.css";

function AdminVillageDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [village, setVillage] = useState(null);
  const [recommendation, setRecommendation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const token = window.__authToken;

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError("");

        const headers = {
          Authorization: `Bearer ${token}`,
        };

        const [vRes, rRes] = await Promise.all([
          fetch(`http://localhost:8080/api/villages/${id}`, { headers }),
          fetch(`http://localhost:8080/api/recommendations/${id}`, { headers }),
        ]);

        // ❗ check API response properly
        if (!vRes.ok) throw new Error("Village API failed");
        if (!rRes.ok) throw new Error("Recommendation API failed");

        const vData = await vRes.json();
        const rData = await rRes.json();

        // ❗ safe check
        if (!vData || Object.keys(vData).length === 0) {
          throw new Error("Village not found");
        }

        setVillage(vData);
        setRecommendation(rData);
      } catch (err) {
        console.error(err);
        setError(err.message || "Failed to load village details");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchData();
  }, [id, token]);

  // ===== LOADING UI (IMPROVED) =====
  if (loading) {
    return (
      <div className="status-wrapper">
        <div className="loader"></div>
        <p>Loading village details...</p>
      </div>
    );
  }

  // ===== ERROR UI =====
  if (error) {
    return (
      <div className="status-wrapper error">
        <p>❌ {error}</p>
        <button onClick={() => navigate(-1)}>Go Back</button>
      </div>
    );
  }

  if (!village) {
    return <p className="status">Village not found</p>;
  }

  return (
    <div className="detail-wrapper">

      <div className="detail-header">
        <h2>{village.villageName}</h2>

        <button className="mela-btn" onClick={() => navigate("/mela")}>
          Schedule Mela
        </button>
      </div>

      <div className="card">
        <p><b>Block:</b> {village.block}</p>
        <p><b>District:</b> {village.district}</p>
        <p><b>State:</b> {village.state}</p>
        <p><b>Source:</b> {village.source}</p>
      </div>

      <div className="card">
        <h3>Demographics</h3>
        <div className="grid">
          <p>Total: {village.demographics?.popTotal}</p>
          <p>Male: {village.demographics?.popMale}</p>
          <p>Female: {village.demographics?.popFemale}</p>
          <p>Children: {village.demographics?.popChildUnder10}</p>
          <p>Seniors: {village.demographics?.popSenior60Plus}</p>
          <p>Farmers: {village.demographics?.popFarmer}</p>
          <p>Salaried: {village.demographics?.popSalaried}</p>
          <p>Business: {village.demographics?.popBusiness}</p>
        </div>
      </div>

      <div className="card">
        <h3>Crop Cycle</h3>
        <p>Type: {village.cropCycle?.type}</p>
        <p>Harvest Months: {village.cropCycle?.harvestMonths?.join(", ")}</p>
      </div>

      <div className="card">
        <h3>Top Schemes</h3>

        {recommendation?.schemes?.length ? (
          recommendation.schemes.map((s, index) => (
            <div key={s.code} className={`scheme-card ${index === 0 ? "top" : ""}`}>
              <b>#{index + 1} {s.code}</b>

              <div className="score-bar">
                <div
                  className="score-fill"
                  style={{ width: `${(s.score || 0) * 100}%` }}
                />
              </div>

              <p>{s.reason}</p>
            </div>
          ))
        ) : (
          <p>No recommendations available</p>
        )}
      </div>

    </div>
  );
}

export default AdminVillageDetail;