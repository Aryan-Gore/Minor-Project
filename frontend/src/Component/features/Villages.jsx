import React, { useEffect, useState } from "react";
import "../CSS-file/Village.css"
function UserPage() {
  const [villages, setVillages] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetch("http://localhost:8080/api/villages", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(res => res.json())
      .then(data => setVillages(data))
      .catch(err => console.log(err));
  }, []);

  return (
    <div className="villages-wrapper">

  <div className="villages-card">

    <h1>Villages</h1>

    <table className="villages-table">
      <thead>
        <tr>
          <th>Village</th>
          <th>Block</th>
          <th>District</th>
          <th>State</th>
          <th>Top Scheme</th>
        </tr>
      </thead>

      <tbody>
        {villages.map(v => (
          <tr key={v._id}>
            <td>{v.villageName}</td>
            <td>{v.block}</td>
            <td>{v.district}</td>
            <td>{v.state}</td>
            <td>{v.topScheme || "..."}</td>
          </tr>
        ))}
      </tbody>
    </table>

  </div>

</div>
  );
}

export default UserPage;