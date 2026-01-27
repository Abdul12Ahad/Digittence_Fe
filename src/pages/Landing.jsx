import { useNavigate } from "react-router-dom";
import "../styles/landing.css";

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="landing-container">
      <header className="landing-header">
        <h2 className="logo">Digittence</h2>
      </header>

      <section className="hero">
        <h1>
          Simplifying Attendance, <br />
          <span>One Click at a Time</span>
        </h1>
        <p>
          A smart digital attendance management system designed for colleges and
          faculty.
        </p>
        <button onClick={() => navigate("/register")}>
          Get Started
        </button>
      </section>

      <section className="features">
        <h2>What Diggittence Offers</h2>
        <div className="feature-grid">
          <div className="feature-card">
            <h3>Class Management</h3>
            <p>Create and manage multiple classes effortlessly.</p>
          </div>
          <div className="feature-card">
            <h3>Flexible Attendance</h3>
            <p>Mark attendance with date and hour-based tracking.</p>
          </div>
          <div className="feature-card">
            <h3>Student Records</h3>
            <p>Add, update, and manage student lists easily.</p>
          </div>
          <div className="feature-card">
            <h3>Attendance Reports</h3>
            <p>Generate attendance reports for custom date ranges.</p>
          </div>
          <div className="feature-card">
            <h3>Excel Export</h3>
            <p>Download attendance reports in Excel format.</p>
          </div>
          <div className="feature-card">
            <h3>Secure Access</h3>
            <p>Faculty-only access with secure authentication.</p>
          </div>
        </div>
      </section>

      <footer className="footer">
        <h3>About</h3>
        <p>
          Digittence is a smart digital attendance management system designed to
          simplify class management, subject-wise attendance tracking, and academic
          reporting for colleges and faculty.
        </p>
      </footer>
    </div>
  );
};

export default Landing;
