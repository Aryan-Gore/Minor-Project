import React, { useState, useEffect } from "react";
import "../CSS-file/Meals.css"
function Melas() {
  const [melas,setMelas]=useState([]);
  const token = localStorage.getItem("token");

  useEffect(()=>{
    fetch("http://localhost:8080/api/melas", {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res=>res.json())
      .then(data=>setMelas(data))
  }, []);

  const scheduleMela = (villageId, schemeCode, date, venue) => {
    fetch("http://localhost:8080/api/melas", {
      method:"POST",
      headers:{
        Authorization:`Bearer ${token}`,
        "Content-Type":"application/json"
      },
      body: JSON.stringify({ villageId, schemeCode, scheduledDate: date, venue })
    })
      .then(res=>res.json())
      .then(data=>alert("Scheduled!"))
  }

  return (
   <div className="mela-wrapper">

  <div className="mela-card">

    <h2>Melas</h2>

    {melas.length === 0 ? (
      <p>No Melas Scheduled</p>
    ) : (
      <ul>
        {melas.map(m => (
          <li key={m._id}>
            <strong>{m.villageId}</strong> - {m.schemeCode} <br />
            <span>{m.scheduledDate}</span>
          </li>
        ))}
      </ul>
    )}

  </div>

</div>
  );
}

export default Melas;