import { useState } from "react";
import api from "../api/api";
import "../styles/auth.css";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/auth/forgot-password", { email });
      alert("Reset link sent to your email");
    } catch (err) {
      alert("Something went wrong");
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-header">
        <h1>Digittence</h1>
      </div>

      <div className="auth-card">
        <h2>Forgot Password</h2>
        <p className="auth-subtitle">
          Enter your registered email
        </p>

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email address"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button type="submit">Send Reset Link</button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
