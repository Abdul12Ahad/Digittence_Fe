import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/api";
import "../styles/class.css";

const Reports = () => {
  const { classId } = useParams();

  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState("");
  const [startDate, setStartDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [endDate, setEndDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchSubjects();
  }, []);

  const fetchSubjects = async () => {
    try {
      const res = await api.get(`/subjects/${classId}`);
      setSubjects(res.data);
    } catch (err) {
      console.error("Failed to fetch subjects:", err);
    }
  };

  const downloadReport = async () => {
    if (!startDate || !endDate) {
      alert("Please select start and end date");
      return;
    }

    setLoading(true);
    try {
      const res = await api.post(
        "/report", 
        {
          classId,
          start: startDate,
          end: endDate,
          subject: selectedSubject || undefined, 
        },
        { responseType: "blob" } 
      );

      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      const fileName = selectedSubject
        ? `Attendance_${selectedSubject}_${classId}.xlsx`
        : `Attendance_All_${classId}.xlsx`;
      link.setAttribute("download", fileName);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error("Download failed:", err);
      alert("Failed to download report");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="class-content">
      <h2 style={{ marginBottom: "25px" }}>Generate Attendance Report</h2>

      <div className="attendance-controls-card" style={{ flexWrap: "wrap", gap: "20px" }}>
        <div>
          <label>Start Date</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>

        <div>
          <label>End Date</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>

        <div className="subject-select">
          <label>Subject (optional)</label>
          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
          >
            <option value="">All Subjects</option>
            {subjects.map((s) => (
              <option key={s._id} value={s.name}>
                {s.name}
              </option>
            ))}
          </select>
        </div>

        <button
          className="save-btn"
          onClick={downloadReport}
          disabled={loading}
          style={{ alignSelf: "flex-end", marginTop: "24px" }}
        >
          {loading ? "Generating..." : "Download Report"}
        </button>
      </div>

      <p style={{ marginTop: "15px", fontStyle: "italic", color: "#555" }}>
        The report will download as an Excel file containing total attendance per student between the selected dates.
      </p>
    </div>
  );
};

export default Reports;
