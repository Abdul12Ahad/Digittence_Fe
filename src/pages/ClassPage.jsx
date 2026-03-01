import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/api";
import Reports from "./Reports";
import "../styles/class.css";

const ClassPage = () => {
  const { classId } = useParams();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("attendance");

  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState({});
  const [loading, setLoading] = useState(true);

  const [isOwner, setIsOwner] = useState(false);

  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [hours, setHours] = useState(1);

  const [subjects, setSubjects] = useState([]);
  const [subject, setSubject] = useState("");
  const [showAddSubject, setShowAddSubject] = useState(false);
  const [newSubject, setNewSubject] = useState("");

  const [showAddStudent, setShowAddStudent] = useState(false);
  const [studentName, setStudentName] = useState("");
  const [rollNo, setRollNo] = useState("");

  const [editStudent, setEditStudent] = useState(null);
  const [file, setFile] = useState(null);

  useEffect(() => {
    fetchStudents();
    fetchClass();
    fetchSubjects();
  }, []);

  const fetchClass = async () => {
    const res = await api.get("/classes");
    const cls = res.data.find((c) => c._id === classId);
    if (!cls) return;

    const facultyId =
      typeof cls.faculty === "object" ? cls.faculty._id : cls.faculty;

    setIsOwner(facultyId === localStorage.getItem("facultyId"));
  };

  const fetchStudents = async () => {
    const res = await api.get(`/students/${classId}`);
    setStudents(res.data);

    const initial = {};
    res.data.forEach((s) => (initial[s._id] = "P"));
    setAttendance(initial);
    setLoading(false);
  };

const addStudent = async () => {
  try {
    await api.post("/students", {
      name: studentName,
      rollNo,
      class: classId
    });

    setShowAddStudent(false);
    fetchStudents();
  } catch (err) {
    if (err.response?.status === 409) {
      alert("Roll number already exists in this class");
    } else {
      alert("Failed to add student");
    }
  }
};


  const updateStudent = async () => {
    await api.put(`/students/${editStudent._id}`, {
      name: studentName,
      rollNo
    });
    setEditStudent(null);
    fetchStudents();
  };

  const deleteStudent = async (id) => {
    await api.delete(`/students/${id}`);
    fetchStudents();
  };

  const fetchSubjects = async () => {
    const res = await api.get(`/subjects/${classId}`);
    setSubjects(res.data);
  };

  const addSubject = async () => {
    await api.post("/subjects", { name: newSubject, class: classId });
    setShowAddSubject(false);
    fetchSubjects();
  };

  const formData = new FormData();
  formData.append("file", file);
  formData.append("classId", classId);

  try {
    await api.post("/students/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" }
    });

    alert("Students uploaded successfully");
    fetchStudents();
  } catch (err) {
    alert("Upload failed");
  }
};

  const saveAttendance = async () => {
  if (!subject) {
    alert("Select subject");
    return;
  }

  const records = students.map((s) => ({
    faculty: localStorage.getItem("facultyId"),
    student: s._id,
    class: classId,
    subject,
    date,
    hours,
    status: attendance[s._id]
  }));

  try {
    await api.post("/attendance", { records });
    alert("Attendance saved successfully");
  } catch (err) {
    if (err.response?.status === 409) {
      alert("Attendance already marked for this subject and date");
    } else {
      alert("Failed to save attendance");
    }
  }
};

  return (
    <div className="class-page">
      <header className="class-header">
        <h1 onClick={() => navigate("/dashboard")}>Digittence</h1>
        <button className="back-btn" onClick={() => navigate("/dashboard")}>
          ← Back
        </button>
      </header>

      <div className="class-tabs">
        <button
          className={activeTab === "attendance" ? "active" : ""}
          onClick={() => setActiveTab("attendance")}
        >
          Mark Attendance
        </button>
        <button
          className={activeTab === "reports" ? "active" : ""}
          onClick={() => setActiveTab("reports")}
        >
          Reports
        </button>
      </div>

      {activeTab === "attendance" && (
        <div className="class-content">
          <div className="attendance-controls-card">
            <div>
              <label>Date</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>

            <div>
              <label>Hours</label>
              <input
                type="number"
                min="1"
                value={hours}
                onChange={(e) => setHours(+e.target.value)}
              />
            </div>

            <div className="subject-row">
              <div className="subject-select">
                <label>Subject</label>
                <select
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                >
                  <option value="">Select Subject</option>
                  {subjects.map((s) => (
                    <option key={s._id} value={s.name}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>

              {isOwner && (
                <div className="subject-buttons">
                    <button
                      className="add-subject-btn"
                      onClick={() => setShowAddSubject(true)}
                    >
                      + Add
                    </button>

                    <label className="add-subject-btn">
                      Upload
                      <input
                        type="file"
                        accept=".xlsx,.csv"
                        hidden
                        onChange={async (e) => {
                          const selectedFile = e.target.files[0];
                          if (!selectedFile) return;

                          const formData = new FormData();
                          formData.append("file", selectedFile);
                          formData.append("classId", classId);

                          try {
                            await api.post("/students/upload", formData, {
                              headers: { "Content-Type": "multipart/form-data" }
                            });

                            alert("Students uploaded successfully");
                            fetchStudents();
                          } catch (err) {
                            alert("Upload failed");
                          }

                          e.target.value = null; 
                        }}
                      />
                    </label>
                </div>
              )}
            </div>
          </div>

          {!loading && (
            <>
              <table className="attendance-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Roll No</th>
                    <th>Status</th>
                    {isOwner && <th>Actions</th>}
                  </tr>
                </thead>
                <tbody>
                  {students.map((s) => (
                    <tr key={s._id}>
                      <td>{s.name}</td>
                      <td>{s.rollNo}</td>
                      <td>
                        <div className="status-toggle">
                          <button
                            className={`status-btn present ${
                              attendance[s._id] === "P" ? "active" : ""
                            }`}
                            onClick={() =>
                              setAttendance({ ...attendance, [s._id]: "P" })
                            }
                          >
                            P
                          </button>
                          <button
                            className={`status-btn absent ${
                              attendance[s._id] === "A" ? "active" : ""
                            }`}
                            onClick={() =>
                              setAttendance({ ...attendance, [s._id]: "A" })
                            }
                          >
                            A
                          </button>
                        </div>
                      </td>

                      {isOwner && (
                        <td className="student-actions">
                          <button
                            className="action-text edit"
                            onClick={() => {
                              setEditStudent(s);
                              setStudentName(s.name);
                              setRollNo(s.rollNo);
                            }}
                          >
                            Edit
                          </button>
                          <button
                            className="action-text delete"
                            onClick={() => deleteStudent(s._id)}
                          >
                            Delete
                          </button>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>

              {isOwner && (
                <button
                  className="add-student-btn"
                  onClick={() => setShowAddStudent(true)}
                >
                  + Add Student
                </button>
              )}
            </>
          )}

          <button className="save-btn" onClick={saveAttendance}>
            Save Attendance
          </button>
        </div>
      )}
      {activeTab === "reports" && <Reports />}

      {(showAddStudent || editStudent) && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>{editStudent ? "Edit Student" : "Add Student"}</h3>
            <input
              value={studentName}
              onChange={(e) => setStudentName(e.target.value)}
            />
            <input
              value={rollNo}
              onChange={(e) => setRollNo(e.target.value)}
            />

            <div className="modal-actions">
              <button
                className="modal-btn secondary"
                onClick={() => {
                  setShowAddStudent(false);
                  setEditStudent(null);
                }}
              >
                Cancel
              </button>
              <button
                className="modal-btn primary"
                onClick={editStudent ? updateStudent : addStudent}
              >
                {editStudent ? "Update" : "Add"}
              </button>
            </div>
          </div>
        </div>
      )}

      {showAddSubject && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Add Subject</h3>
            <input
              value={newSubject}
              onChange={(e) => setNewSubject(e.target.value)}
            />
            <div className="modal-actions">
              <button
                className="modal-btn secondary"
                onClick={() => setShowAddSubject(false)}
              >
                Cancel
              </button>
              <button className="modal-btn primary" onClick={addSubject}>
                Add
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClassPage;
