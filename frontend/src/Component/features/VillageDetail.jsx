import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function VillageDetail() {
  const { id } = useParams();
  const [village, setVillage] = useState(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetch(`http://localhost:8080/api/villages/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => setVillage(data));
  }, [id]);

  return village && (
    <div>
      <h2>{village.villageName}</h2>
      <p>District: {village.district}</p>
      <p>State: {village.state}</p>
      <h3>Demographics</h3>
      <p>Total Population: {village.demographics.popTotal}</p>
      <p>Farmers: {village.demographics.popFarmer}</p>
      {/* and so on */}
    </div>
  );
}

export default VillageDetail;