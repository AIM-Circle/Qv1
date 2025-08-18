import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const DashboardPage = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("");
  const [file, setFile] = useState(null);
  const generateRandomScore = () => {
    const random = Math.random();
    return random > 0.5 ? Math.floor(75 + random * 25) : Math.floor(1 + random * 74);
  };

  const lastUpload = {
    fileName: file?.fileName || "Physics Notes.pdf",
    quizScore: generateRandomScore(),
    uploadedAt: file?.createdAt || "April 26, 2025",
  };

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("aimcircle_user"));
    const uploadedFile = JSON.parse(localStorage.getItem("uploadedFile"));
    if (user) {
      setUserName(user.username);
      setFile(uploadedFile);
    } else {
      navigate("/signup");
    }
  }, [navigate]);

  return (
    <div className="page">
      <h1 className="page-title">AIM Circle</h1>
      <div className="upload-container">
      <h1 className="upload-title">Dashboard</h1>
      <p className="upload-subtitle">Welcome{userName ? `, ${userName}` : " back"}! Here's your recent activity:</p>

      <div 
        style={{
          backgroundColor: "#f0f4f8",
          padding: "20px",
          borderRadius: "12px",
          marginTop: "20px",
          width: "100%",
          maxWidth: "500px",
        }}
      >
        <h3 style={{ marginBottom: "10px", color: "#4f46e5" }}>📄 Last Upload:</h3>
        <p className="text"><strong>File:</strong> {lastUpload.fileName}</p>
        <p className="text"><strong>Score:</strong> {lastUpload.quizScore}%</p>
        <p className="text"><strong>Uploaded:</strong> {lastUpload.uploadedAt}</p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "20px", marginTop: "40px" }}>
       <button
        onClick={() => navigate("/upload")}
        className="upload-button"
        style={{ marginTop: "20px" }}
      >
        📄 Upload New Material
      </button>
      <button
        onClick={() => navigate("/quiz")}
        className="upload-button"
        style={{ marginTop: "10px", backgroundColor: "#4f46e5" }}
      >
        🎯 Retake Quiz
      </button>
      </div>
    </div>
    </div>
  );
};

export default DashboardPage;
