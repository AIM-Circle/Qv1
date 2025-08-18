import React from "react";

const LoadingScreen = ({ message }) => {
  return (
    <div className="page">
      <h1 className="page-title">AIM Circle</h1>
      <div className="loading-container">
      <div className="spinner"></div>
      <p className="loading-message">{message || "Loading..."}</p>
    </div>
    </div>
  );
};

export default LoadingScreen;
