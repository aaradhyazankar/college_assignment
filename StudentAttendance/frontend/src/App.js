
import React, { useEffect, useState } from "react";
import "./App.css";

const STUDENTS_API = "http://localhost:5000/api/students";
const ATTENDANCE_API = "http://localhost:5000/api/attendance";
const REPORTS_API = "http://localhost:5000/api/reports";

function App() {
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState({});
  const [reports, setReports] = useState([]);
  const [date, setDate] = useState(new Date().toLocaleDateString("en-CA"));
  const [name, setName] = useState("");
  const [rollNumber, setRollNumber] = useState("");
  const [className, setClassName] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function fetchStudents() {
    try {
      const response = await fetch(STUDENTS_API);
      if (!response.ok) throw new Error();
      setStudents(await response.json());
    } catch {
      setMessage("Cannot connect to the backend.");
    }
  }

  async function fetchAttendance(selectedDate) {
    try {
      const response = await fetch(
        `${ATTENDANCE_API}?date=${encodeURIComponent(selectedDate)}`
      );
      if (!response.ok) throw new Error();

      const records = await response.json();
      const map = {};
      records.forEach((record) => {
        map[record.studentId] = record.status;
      });
      setAttendance(map);
    } catch {
      setMessage("Unable to load attendance records.");
    }
  }

  async function fetchReports() {
    try {
      const response = await fetch(REPORTS_API);
      if (!response.ok) throw new Error();
      setReports(await response.json());
    } catch {
      setMessage("Unable to load attendance reports.");
    }
  }

  useEffect(() => {
    fetchStudents();
    fetchReports();
  }, []);

  useEffect(() => {
    fetchAttendance(date);
  }, [date]);

  async function addStudent(event) {
    event.preventDefault();
    setMessage("");

    try {
      const response = await fetch(STUDENTS_API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, rollNumber, className }),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "Unable to add student.");
        return;
      }

      setMessage("Student added successfully!");
      setName("");
      setRollNumber("");
      setClassName("");
      await fetchStudents();
      await fetchReports();
    } catch {
      setMessage("Cannot connect to the backend.");
    }
  }

  async function markAttendance(student, status) {
    setLoading(true);
    setMessage("");

    try {
      const response = await fetch(ATTENDANCE_API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentId: student._id,
          rollNumber: student.rollNumber,
          date,
          status,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "Unable to save attendance.");
        return;
      }

      setAttendance((previous) => ({
        ...previous,
        [student._id]: status,
      }));

      await fetchReports();
      setMessage(`Attendance saved for ${student.name}.`);
    } catch {
      setMessage("Cannot connect to the backend.");
    } finally {
      setLoading(false);
    }
  }

  const presentCount = students.filter(
    (student) => attendance[student._id] === "Present"
  ).length;

  const absentCount = students.filter(
    (student) => attendance[student._id] === "Absent"
  ).length;

  return (
    <div className="app">
      <header className="header">
        <div>
          <h1>AttendEase</h1>
          <p>Student Attendance Management System</p>
        </div>
      </header>

      <main className="container">
        <section className="welcome">
          <h2>Dashboard</h2>
          <p>Manage students and track daily attendance.</p>
        </section>

        <section className="stats">
          <div className="stat-card">
            <span>Total Students</span>
            <h2>{students.length}</h2>
          </div>
          <div className="stat-card">
            <span>Present Today</span>
            <h2 className="present-text">{presentCount}</h2>
          </div>
          <div className="stat-card">
            <span>Absent Today</span>
            <h2 className="absent-text">{absentCount}</h2>
          </div>
        </section>

        <section className="panel">
          <h2>Add New Student</h2>
          <form onSubmit={addStudent}>
            <label>Student Name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter student name"
              required
            />

            <label>Roll Number</label>
            <input
              value={rollNumber}
              onChange={(e) => setRollNumber(e.target.value)}
              placeholder="Enter roll number"
              required
            />

            <label>Class / Division</label>
            <input
              value={className}
              onChange={(e) => setClassName(e.target.value)}
              placeholder="e.g. TY IT B"
              required
            />

            <button type="submit">Add Student</button>
          </form>
        </section>

        <section className="panel">
          <div className="section-heading">
            <div>
              <h2>Mark Attendance</h2>
              <p>Select a date, then mark each student.</p>
            </div>
            <input
              className="date-input"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>

          {students.length === 0 ? (
            <p>Add a student before marking attendance.</p>
          ) : (
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Roll Number</th>
                    <th>Class</th>
                    <th>Status</th>
                    <th>Mark Attendance</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((student) => (
                    <tr key={student._id}>
                      <td>{student.name}</td>
                      <td>{student.rollNumber}</td>
                      <td>{student.className}</td>
                      <td>
                        <span
                          className={`status ${
                            attendance[student._id] === "Present"
                              ? "status-present"
                              : attendance[student._id] === "Absent"
                              ? "status-absent"
                              : "status-pending"
                          }`}
                        >
                          {attendance[student._id] || "Not marked"}
                        </span>
                      </td>
                      <td>
                        <div className="attendance-buttons">
                          <button
                            type="button"
                            className="present-button"
                            disabled={loading}
                            onClick={() => markAttendance(student, "Present")}
                          >
                            Present
                          </button>
                          <button
                            type="button"
                            className="absent-button"
                            disabled={loading}
                            onClick={() => markAttendance(student, "Absent")}
                          >
                            Absent
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <section className="panel">
          <h2>Student List</h2>
          {students.length === 0 ? (
            <p>No students added yet.</p>
          ) : (
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Roll Number</th>
                    <th>Class / Division</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((student) => (
                    <tr key={student._id}>
                      <td>{student.name}</td>
                      <td>{student.rollNumber}</td>
                      <td>{student.className}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <section className="panel">
          <h2>Attendance Reports</h2>
          <p>Attendance summary for all recorded dates.</p>

          {reports.length === 0 ? (
            <p>No attendance records available yet.</p>
          ) : (
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Roll Number</th>
                    <th>Total Marked Days</th>
                    <th>Present Days</th>
                    <th>Absent Days</th>
                    <th>Attendance %</th>
                  </tr>
                </thead>
                <tbody>
                  {reports.map((report) => (
                    <tr key={report.rollNumber}>
                      <td>{report.name}</td>
                      <td>{report.rollNumber}</td>
                      <td>{report.totalDays}</td>
                      <td>{report.presentDays}</td>
                      <td>{report.absentDays}</td>
                      <td>
                        <strong>{report.percentage}%</strong>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {message && <p className="message">{message}</p>}
      </main>
    </div>
  );
}

export default App;
