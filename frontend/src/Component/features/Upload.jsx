import React, { useState } from "react";
import "../CSS-file/Upload.css";
import CreatableSelect from "react-select/creatable";
import { useForm, Controller } from "react-hook-form";
import { 
  FileText, 
  Upload as UploadIcon, 
  Table, 
  MapPin, 
  Users, 
  Sprout, 
  X, 
  CheckCircle, 
  AlertCircle,
  Loader2,
  FileSpreadsheet
} from "lucide-react";

function Upload() {
  const [mode, setMode] = useState("manual");
  const [selectedFile, setSelectedFile] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const token = window.__authToken;

  // ================= FILE UPLOAD =================
  const uploadFile = (type) => {
    if (!selectedFile) return;

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
      .then((data) => {
        setResult({ ...data, type: "success" });
        setSelectedFile(null);
      })
      .catch(() => setResult({ type: "error", message: "Upload failed. Please check your file format." }))
      .finally(() => setLoading(false));
  };

  // ================= MANUAL FORM =================
  const {
    register,
    handleSubmit,
    control,
    watch,
    reset,
  } = useForm();

  const popTotal = watch("popTotal");
  const popMale = watch("popMale");
  const popFemale = watch("popFemale");

  const onSubmit = (data) => {
    if (Number(popMale) + Number(popFemale) > Number(popTotal)) {
      return alert("Male + Female cannot exceed Total Population");
    }

    setLoading(true);
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
      .then(() => {
        setResult({ type: "success", message: "Village added successfully ✅" });
        reset();
      })
      .catch(() => setResult({ type: "error", message: "Error adding village. Please try again." }))
      .finally(() => setLoading(false));
  };

  const stateOptions = [
    { label: "Madhya Pradesh", value: "Madhya Pradesh" },
    { label: "Maharashtra", value: "Maharashtra" },
    { label: "Uttar Pradesh", value: "Uttar Pradesh" },
    { label: "Rajasthan", value: "Rajasthan" },
    { label: "Gujarat", value: "Gujarat" },
  ];

  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  return (
    <div className="upload-wrapper">
      <div className="upload-header">
        <h1>Village Data Entry</h1>
        <p>Choose your preferred method to import data into the system</p>
      </div>

      {/* 🔽 TABS NAVIGATION */}
      <div className="upload-tabs">
        <button 
          className={mode === "manual" ? "tab-active" : ""} 
          onClick={() => { setMode("manual"); setResult(null); }}
        >
          <FileText size={18} /> Manual Form
        </button>
        <button 
          className={mode === "csv" ? "tab-active" : ""} 
          onClick={() => { setMode("csv"); setResult(null); }}
        >
          <Table size={18} /> CSV Upload
        </button>
        <button 
          className={mode === "excel" ? "tab-active" : ""} 
          onClick={() => { setMode("excel"); setResult(null); }}
        >
          <FileSpreadsheet size={18} /> Excel Upload
        </button>
      </div>

      <div className="upload-card">
        {/* ================= MANUAL ================= */}
        {mode === "manual" && (
          <form className="manual-form" onSubmit={handleSubmit(onSubmit)}>
            
            <div className="form-section">
              <h3><MapPin size={18} /> Location Details</h3>
              <div className="form-grid">
                <div className="input-group">
                  <label>Village Name</label>
                  <input placeholder="Ex: Rampur" {...register("villageName", { required: true })} />
                </div>
                <div className="input-group">
                  <label>Block</label>
                  <input placeholder="Ex: Central" {...register("block", { required: true })} />
                </div>
                <div className="input-group">
                  <label>District</label>
                  <input placeholder="Ex: Bhopal" {...register("district", { required: true })} />
                </div>
                <div className="input-group">
                  <label>State</label>
                  <Controller
                    name="state"
                    control={control}
                    rules={{ required: true }}
                    render={({ field }) => (
                      <CreatableSelect
                        {...field}
                        options={stateOptions}
                        onChange={(val) => field.onChange(val.value)}
                        placeholder="Select state"
                        classNamePrefix="custom-select"
                      />
                    )}
                  />
                </div>
              </div>
            </div>

            <div className="form-section">
              <h3><Users size={18} /> Demographics</h3>
              <div className="form-grid">
                <div className="input-group">
                  <label>Total Population</label>
                  <input type="number" {...register("popTotal", { required: true })} />
                </div>
                <div className="input-group">
                  <label>Male Population</label>
                  <input type="number" {...register("popMale", { required: true })} />
                </div>
                <div className="input-group">
                  <label>Female Population</label>
                  <input type="number" {...register("popFemale", { required: true })} />
                </div>
                <div className="input-group">
                  <label>Children Under 10</label>
                  <input type="number" {...register("popChildUnder10", { required: true })} />
                </div>
                <div className="input-group">
                  <label>Senior 60+</label>
                  <input type="number" {...register("popSenior60Plus", { required: true })} />
                </div>
                <div className="input-group">
                  <label>Total Farmers</label>
                  <input type="number" {...register("popFarmer", { required: true })} />
                </div>
                <div className="input-group">
                  <label>Salaried Persons</label>
                  <input type="number" {...register("popSalaried", { required: true })} />
                </div>
                <div className="input-group">
                  <label>Business Owners</label>
                  <input type="number" {...register("popBusiness", { required: true })} />
                </div>
              </div>
            </div>

            <div className="form-section">
              <h3><Sprout size={18} /> Agriculture & Harvest</h3>
              <div className="form-grid">
                <div className="input-group full-width">
                  <label>Crop Cycle Type</label>
                  <select {...register("cropType", { required: true })}>
                    <option value="">Select cycle</option>
                    <option value="Rabi">Rabi</option>
                    <option value="Kharif">Kharif</option>
                    <option value="Both">Both</option>
                  </select>
                </div>
                
                <div className="input-group full-width">
                  <label>Select Harvest Months</label>
                  <div className="months-grid">
                    {months.map((m, idx) => (
                      <label key={m} className="month-chip">
                        <input
                          type="checkbox"
                          value={idx + 1}
                          {...register("harvestMonths", { required: true })}
                        />
                        <span>{m}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? <><Loader2 className="spinner" size={18} /> Submitting...</> : "Add Village Record"}
            </button>
          </form>
        )}

        {/* ================= BULK UPLOAD ================= */}
        {(mode === "csv" || mode === "excel") && (
          <div className="bulk-upload">
            <div className={`drop-zone ${selectedFile ? "file-selected" : ""}`}>
              <UploadIcon size={48} className="upload-icon" />
              <h3>Upload {mode.toUpperCase()} File</h3>
              <p>Drag and drop your file here or click to browse</p>
              <input
                type="file"
                accept={mode === "csv" ? ".csv" : ".xlsx,.xls"}
                onChange={(e) => setSelectedFile(e.target.files[0])}
                id="fileInput"
              />
              <label htmlFor="fileInput" className="browse-btn">
                Select {mode.toUpperCase()}
              </label>

              {selectedFile && (
                <div className="file-info-card">
                  <div className="file-details">
                    <Table size={20} />
                    <span>{selectedFile.name}</span>
                    <small>({(selectedFile.size / 1024).toFixed(2)} KB)</small>
                  </div>
                  <button onClick={() => setSelectedFile(null)} className="clear-btn">
                    <X size={16} />
                  </button>
                </div>
              )}
            </div>

            <div className="upload-actions">
              <button 
                onClick={() => uploadFile(mode)} 
                disabled={!selectedFile || loading}
                className="upload-btn"
              >
                {loading ? <><Loader2 className="spinner" size={18} /> Uploading...</> : `Process ${mode.toUpperCase()} Data`}
              </button>
            </div>
            
            <div className="upload-tips">
              <h4>Tips for successful upload:</h4>
              <ul>
                <li>Ensure the column headers match the required format.</li>
                <li>Make sure there are no empty rows in the data.</li>
                <li>Check that population numbers are valid integers.</li>
              </ul>
            </div>
          </div>
        )}

        {/* ================= RESULT AREA ================= */}
        {result && (
          <div className={`status-box ${result.type}`}>
            <div className="status-header">
              {result.type === "success" ? <CheckCircle size={24} /> : <AlertCircle size={24} />}
              <h4>{result.type === "success" ? "Success!" : "Action Required"}</h4>
            </div>
            
            {result.importedRows !== undefined ? (
              <div className="import-summary">
                <p>Imported <strong>{result.importedRows}</strong> villages out of <strong>{result.totalRows}</strong>.</p>
                {result.failedRows > 0 && (
                  <div className="error-list">
                    <p className="fail-count">Failed Records: {result.failedRows}</p>
                    <ul>
                      {result.errors?.slice(0, 5).map((e, i) => (
                        <li key={i}>{e}</li>
                      ))}
                      {result.errors?.length > 5 && <li>...and {result.errors.length - 5} more</li>}
                    </ul>
                  </div>
                )}
              </div>
            ) : (
              <p>{result.message}</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Upload;