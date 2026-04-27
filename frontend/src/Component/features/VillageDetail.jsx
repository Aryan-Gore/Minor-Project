import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../CSS-file/Village.css";

function VillageDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [village, setVillage] = useState(null);
  const [recommendation, setRecommendation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = window.__authToken; //  fixed — no more localStorage

    if (!token) {
      navigate("/");
      return;
    }

    // Fetch village + recommendations at the same time
    Promise.all([
      fetch(`http://localhost:8080/api/villages/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      }).then(r => r.json()),

      fetch(`http://localhost:8080/api/recommendations/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      }).then(r => r.json())
    ])
    .then(([villageData, recData]) => {
      setVillage(villageData);
      setRecommendation(recData);
    })
    .catch(err => {
      console.log(err);
      setError("Failed to load village details.");
    })
    .finally(() => setLoading(false));

  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (error)   return <p style={{ color: "red" }}>{error}</p>;
  if (!village) return <p>Village not found.</p>;

  return (
    <div>

      {/* ── Village Info ── */}
      <h2>{village.villageName}</h2>
      <p>Block: {village.block}</p>
      <p>District: {village.district}</p>
      <p>State: {village.state}</p>
      <p>Source: {village.source}</p>

      {/* ── Demographics ── */}
      <h3>Demographics</h3>
      <p>Total Population: {village.demographics?.popTotal}</p>
      <p>Male: {village.demographics?.popMale}</p>
      <p>Female: {village.demographics?.popFemale}</p>
      <p>Children under 10: {village.demographics?.popChildUnder10}</p>
      <p>Seniors 60+: {village.demographics?.popSenior60Plus}</p>
      <p>Farmers: {village.demographics?.popFarmer}</p>
      <p>Salaried: {village.demographics?.popSalaried}</p>
      <p>Business: {village.demographics?.popBusiness}</p>

      {/* ── Crop Cycle ── */}
      <h3>Crop Cycle</h3>
      <p>Type: {village.cropCycle?.type}</p>
      <p>Harvest Months: {village.cropCycle?.harvestMonths?.join(", ")}</p>

      {/* ── Recommendations ── */}
      <h3>Scheme Recommendations</h3>
      {recommendation?.schemes?.map((scheme, index) => (
        <div
          key={scheme.code}
          style={{
            border: index === 0 ? "2px solid gold" : "1px solid #ddd",
            borderRadius: 8,
            padding: 12,
            marginBottom: 8,
            background: index === 0 ? "#fffbea" : "#fff"
          }}
        >
          <strong>#{index + 1} — {scheme.code}</strong>
          <p>Score: {Math.round(scheme.score * 100)}%</p>
          <p>{scheme.reason}</p>
        </div>
      ))}

    </div>
  );
}

export default VillageDetail;