import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

const SignupPage = () => {
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            alert("Passwords do not match!");
            return;
        }
        if (!username || !email || !password) {
            alert("Please fill in all fields!");
            return;
        }
        // Simulate Signup API call by Storing data in localStorage
        const user = { username, email};
        localStorage.setItem("aimcircle_user", JSON.stringify(user));
        alert("Successfully signed up!");
        navigate("/login"); 

    };

  return (
    <div className="auth-container">
      <h1 className="auth-title">Create your AIM Circle Account</h1>
      <form className="auth-form" onSubmit={handleSubmit}>
        <input 
        type="text" 
        placeholder="Enter your username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        required 
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <input 
        type="password" 
        placeholder="Confirm your password" 
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        required 
        />
        <button type="submit" className="auth-button">Sign Up</button>
      </form>
      <p className="auth-switch">
        Already have an account? <Link to="/login" className="auth-link">Login</Link>
      </p>
    </div>
  );
};

export default SignupPage;
