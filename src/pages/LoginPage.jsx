import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

const LoginPage = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        // Simulate Login API call by checking localStorage
        const user = JSON.parse(localStorage.getItem("aimcircle_user"));
        console.log(user);
        if (user && user.email === email) {
            alert("Successfully logged in!");
            navigate("/dashboard"); 
        } else {
            alert("Invalid email or password!");
        }
    }

  return (
    <div className="auth-container">
      <h1 className="auth-title">Login to AIM Circle</h1>
      <form className="auth-form" onSubmit={handleSubmit}>
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
        <button type="submit" className="auth-button">Login</button>
      </form>
      <p className="auth-switch">
        Don't have an account? <Link to="/signup" className="auth-link">Sign up</Link>
      </p>
    </div>
  );
};

export default LoginPage;
