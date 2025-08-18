import React, { useState } from "react";

const UploadBox = ({ onFileSelect }) => {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const file = e.dataTransfer.files[0];
    if (file) {
      setSelectedFile(file);
      onFileSelect(file);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      onFileSelect(file);
    }
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`upload-box ${dragActive ? "active" : ""}`}
    >
      <div>
        <div style={{ fontSize: "30px", marginBottom: "10px" }}>📄</div>
        <p className="text" style={{textAlign: "center"}}>Drag & Drop your file here</p>
        <p style={{ marginTop: "10px", color: "#555" }}>or</p>

        <label htmlFor="file-upload" className="upload-label">
          Select a file
        </label>
        <input
          id="file-upload"
          type="file"
          accept=".pdf,.doc,.docx,.jpg,.png"
          onChange={handleFileChange}
          style={{ display: "none" }}
        />
      </div>

      {selectedFile && (
        <div style={{ marginTop: "20px", color: "#333" }}>
          <p className="text" style={{textAlign: "center"}}><strong>Selected:</strong> {selectedFile.name}</p>
        </div>
      )}
    </div>
  );
};

export default UploadBox;
