import React, { useState } from "react";
import "../CSS-file/Upload.css";
import CreatableSelect from "react-select/creatable";
import { useForm, Controller } from "react-hook-form";

function Upload() {
  const [mode, setMode] = useState("manual");
  const [selectedFile, setSelectedFile] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const token = window.__authToken;

  // ================= FILE UPLOAD =================
  const uploadFile = (type) => {
    if (!selectedFile) return alert("Select file");

    const formData = new FormData();
    formData.append("file", selectedFile);

    const endpoint =
      type === "csv"
        ? "http://localhost:8080/api/upload/csv"
        : "http://localhost:8080/api/upload/excel";

    setLoading(true);
    setResult(null);

    fetch(endpoint, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    })
      .then((res) => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then((data) => setResult(data))
      .catch(() => alert("Upload failed"))
      .finally(() => setLoading(false));
  };

  // ================= MANUAL FORM =================
  const {
    register,
    handleSubmit,
    control,
    watch,
  } = useForm();

  const popTotal = watch("popTotal");
  const popMale = watch("popMale");
  const popFemale = watch("popFemale");

  const onSubmit = (data) => {
    if (Number(popMale) + Number(popFemale) > Number(popTotal)) {
      return alert("Male + Female cannot exceed Total Population");
    }

    fetch("http://localhost:8080/api/villages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        villageName: data.villageName,
        block: data.block,
        district: data.district,
        state: data.state,

        demographics: {
          popTotal: Number(data.popTotal),
          popMale: Number(data.popMale),
          popFemale: Number(data.popFemale),
          popChildUnder10: Number(data.popChildUnder10),
          popSenior60Plus: Number(data.popSenior60Plus),
          popFarmer: Number(data.popFarmer),
          popSalaried: Number(data.popSalaried),
          popBusiness: Number(data.popBusiness),
        },

        cropCycle: {
          type: data.cropType,
          harvestMonths: data.harvestMonths.map(Number),
        },

        source: "MANUAL",
      }),
    })
      .then((res) => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then(() => alert("Village added successfully ✅"))
      .catch(() => alert("Error adding village"));
  };

  const stateOptions = [
    { label: "Madhya Pradesh", value: "Madhya Pradesh" },
    { label: "Maharashtra", value: "Maharashtra" },
  ];

  const months = ["1","2","3","4","5","6","7","8","9","10","11","12"];

  return (
    <div className="upload-container">
      <h2>Upload Village Data</h2>

      {/* 🔽 Dropdown */}
      <select
        value={mode}
        onChange={(e) => setMode(e.target.value)}
        className="mode-select"
      >
        <option value="manual">Manual Entry</option>
        <option value="csv">CSV Upload</option>
        <option value="excel">Excel Upload</option>
      </select>

      {/* ================= MANUAL ================= */}
      {mode === "manual" && (
        <form className="form" onSubmit={handleSubmit(onSubmit)}>

          <input placeholder="Village Name" {...register("villageName", { required: true })} />
          <input placeholder="Block" {...register("block", { required: true })} />
          <input placeholder="District" {...register("district", { required: true })} />

          {/* Dropdown + typing */}
          <Controller
            name="state"
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <CreatableSelect
                {...field}
                options={stateOptions}
                onChange={(val) => field.onChange(val.value)}
                placeholder="Select or type state"
              />
            )}
          />

          <input type="number" placeholder="Total Population" {...register("popTotal", { required: true })} />
          <input type="number" placeholder="Male Population" {...register("popMale", { required: true })} />
          <input type="number" placeholder="Female Population" {...register("popFemale", { required: true })} />
          <input type="number" placeholder="Children under 10" {...register("popChildUnder10", { required: true })} />
          <input type="number" placeholder="Senior 60+" {...register("popSenior60Plus", { required: true })} />
          <input type="number" placeholder="Farmers" {...register("popFarmer", { required: true })} />
          <input type="number" placeholder="Salaried" {...register("popSalaried", { required: true })} />
          <input type="number" placeholder="Business" {...register("popBusiness", { required: true })} />

          <select {...register("cropType", { required: true })}>
            <option value="">Select Crop Type</option>
            <option value="Rabi">Rabi</option>
            <option value="Kharif">Kharif</option>
            <option value="Both">Both</option>
          </select>

          <label>Select Harvest Months:</label>
          <div className="months">
            {months.map((m) => (
              <label key={m}>
                <input
                  type="checkbox"
                  value={m}
                  {...register("harvestMonths", { required: true })}
                />
                {m}
              </label>
            ))}
          </div>

          <button type="submit">Submit</button>
        </form>
      )}

      {/* ================= CSV ================= */}
      {mode === "csv" && (
        <div className="upload-box">
          <input
            type="file"
            accept=".csv"
            onChange={(e) => setSelectedFile(e.target.files[0])}
          />
          <button onClick={() => uploadFile("csv")} disabled={loading}>
            {loading ? "Uploading..." : "Upload CSV"}
          </button>
        </div>
      )}

      {/* ================= EXCEL ================= */}
      {mode === "excel" && (
        <div className="upload-box">
          <input
            type="file"
            accept=".xlsx,.xls"
            onChange={(e) => setSelectedFile(e.target.files[0])}
          />
          <button onClick={() => uploadFile("excel")} disabled={loading}>
            {loading ? "Uploading..." : "Upload Excel"}
          </button>
        </div>
      )}

      {/* RESULT */}
      {result && (
        <div className="result">
          <p>
            ✅ Imported <b>{result.importedRows}</b> of{" "}
            <b>{result.totalRows}</b>
          </p>

          {result.failedRows > 0 && (
            <>
              <p className="error">❌ Failed: {result.failedRows}</p>
              <ul>
                {result.errors?.map((e, i) => (
                  <li key={i}>{e}</li>
                ))}
              </ul>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default Upload;