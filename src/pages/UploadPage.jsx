import { useState } from "react";
import { useNavigate } from "react-router-dom";
import UploadBox from "../components/uploadBox";
import LoadingScreen from "../components/LoadingScreen";

const UploadPage = () => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null); // New state for error handling
  const navigate = useNavigate();


  const handleFileSelect = (file) => {
    setFile(file);
  }

  const handleUpload = () => {
    if (!file) {
      alert("No file selected!");
      return;
    }
    setUploading(true);
    setUploadError(null); // Clear any previous errors
    console.log(file);
    const allowedFileTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "image/jpeg",
      "image/png"
    ];
    if (!allowedFileTypes.includes(file.type)) {
      setUploading(false);
      setUploadError("Invalid file type. Please upload a PDF, Document or Image file.");
      return;
    }

    // TODO: Integrate with backend API later
    // Simulate file upload by storing it in localStorage
    const fileName = file.name;
    const fileSize = file.size; 
    const createdAt = file.lastModifiedDate.toLocaleDateString('en-UK', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
    const fileDetails = { fileName, fileSize, createdAt };
    localStorage.setItem("uploadedFile", JSON.stringify(fileDetails));

    // Simulate upload delay and potential error
    setTimeout(() => {
      const isSuccess = Math.random() > 0.2; // Simulate 80% success rate
      setUploading(false);
      if (isSuccess) {
        navigate("/quiz");
      } else {
        setUploadError("Failed to upload the file. Please try again.");
      }
    }, 3000);
  };

  if (uploading) {
    return <LoadingScreen message="Generating your quiz... 🧠" />;
  }

  return (
    <div className="page">
      <h1 className="page-title">AIM Circle</h1>
      <div className="upload-container">
      
      <h2 className="upload-title">Upload your Study Material</h2>
      <p className="upload-subtitle">Please note, test begins immediately after a successful upload</p>

      <UploadBox onFileSelect={handleFileSelect} />

      {uploadError && (
        <p style={{ color: "red", marginTop: "10px" }}>{uploadError}</p>
      )}

      <button
        onClick={handleUpload}
        className="upload-button"
        disabled={uploading} // Disable button while uploading
        style={{
          backgroundColor: uploading ? "#ccc" : "#007bff",
          cursor: uploading ? "not-allowed" : "pointer",
        }}
      >
        {uploading ? "Uploading..." : "Upload"}
      </button>
     </div>
    </div>
  );
};

export default UploadPage;
