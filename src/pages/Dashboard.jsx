import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";
import "../styles/dashboard.css";

const Dashboard = () => {
  const navigate = useNavigate();
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showCreate, setShowCreate] = useState(false);
  const [className, setClassName] = useState("");

  const [editClass, setEditClass] = useState(null);
  const [deleteClass, setDeleteClass] = useState(null);

  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    try {
      const res = await api.get("/classes");
      setClasses(res.data);
    } catch {
      alert("Failed to load classes");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateClass = async (e) => {
    e.preventDefault();
    if (!className.trim()) return;

    const res = await api.post("/classes", { className });
    setClasses([res.data, ...classes]);
    setClassName("");
    setShowCreate(false);
  };

  const handleUpdateClass = async () => {
    await api.put(`/classes/${editClass._id}`, { className });
    setEditClass(null);
    setClassName("");
    fetchClasses();
  };

  const handleDeleteClass = async () => {
    await api.delete(`/classes/${deleteClass._id}`);
    setClasses(classes.filter((c) => c._id !== deleteClass._id));
    setDeleteClass(null);
  };

  const handleLogout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("facultyId");
  navigate("/login");
  };


  return (
    <div className="dashboard-page">
      <header className="dashboard-header dashboard-header-flex">
        <h1 className="dashboard-logo">Digittence</h1>
        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </header>

      <main className="dashboard-content">
        <div className="dashboard-title">
          <h2>My Classes</h2>
          <p>Select a class to manage attendance and reports</p>
        </div>

        <button
          className="create-class-btn"
          onClick={() => setShowCreate(!showCreate)}
        >
          Create Class
        </button>

        {showCreate && (
          <form className="create-class-form" onSubmit={handleCreateClass}>
            <input
              value={className}
              onChange={(e) => setClassName(e.target.value)}
              placeholder="Enter class name"
            />
            <button type="submit">Create</button>
          </form>
        )}

        {loading ? (
          <p>Loading classes...</p>
        ) : classes.length === 0 ? (
          <div className="empty-state">
            <p>No classes created yet.</p>
            <span>Your classes will appear here once added.</span>
          </div>
        ) : (
          <div className="class-grid">
            {classes.map((cls) => (
              <div key={cls._id} className="class-card">
                <h3>{cls.className}</h3>

                <div className="class-actions">
                  <button
                    className="open-btn"
                    onClick={() => navigate(`/class/${cls._id}`)}
                  >
                    Open
                  </button>

                  <button
                    className="edit-btn"
                    onClick={() => {
                      setEditClass(cls);
                      setClassName(cls.className);
                    }}
                  >
                    Edit
                  </button>

                  <button
                    className="delete-btn"
                    onClick={() => setDeleteClass(cls)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {editClass && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Edit Class</h3>
            <input
              value={className}
              onChange={(e) => setClassName(e.target.value)}
            />
            <div className="modal-actions">
  <button className="modal-btn secondary" onClick={() => setEditClass(null)}>
    Cancel
  </button>
  <button className="modal-btn primary" onClick={handleUpdateClass}>
    Save
  </button>
</div>
          </div>
        </div>
      )}

      {deleteClass && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Delete Class</h3>
            <p>
              Are you sure you want to delete{" "}
              <strong>{deleteClass.className}</strong>?
            </p>
            <div className="modal-actions">
  <button className="modal-btn secondary" onClick={() => setDeleteClass(null)}>
    Cancel
  </button>
  <button className="modal-btn danger" onClick={handleDeleteClass}>
    Delete
  </button>
</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
