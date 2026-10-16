
const express = require("express");
const cors = require("cors");
const { MongoClient } = require("mongodb");

const app = express();
const PORT = 5000;

const client = new MongoClient("mongodb://127.0.0.1:27017");

app.use(cors());
app.use(express.json());

async function startServer() {
  try {
    await client.connect();

    const database = client.db("student_attendance");

    const studentsCollection = database.collection("students");
    const attendanceCollection = database.collection("attendance");

    console.log("MongoDB connected successfully!");

    // Home route
    app.get("/", (req, res) => {
      res.send("Student Attendance Management API is running!");
    });

    // Get all students
    app.get("/api/students", async (req, res) => {
      try {
        const students = await studentsCollection.find({}).toArray();
        res.json(students);
      } catch (error) {
        console.error(error);
        res.status(500).json({
          message: "Failed to fetch students"
        });
      }
    });

    // Add a new student
    app.post("/api/students", async (req, res) => {
      try {
        const { name, rollNumber, className } = req.body;

        if (!name || !rollNumber || !className) {
          return res.status(400).json({
            message: "Please enter all student details"
          });
        }

        const existingStudent = await studentsCollection.findOne({
          rollNumber: rollNumber
        });

        if (existingStudent) {
          return res.status(409).json({
            message: "Roll number already exists"
          });
        }

        const student = {
          name: name,
          rollNumber: rollNumber,
          className: className
        };

        const result = await studentsCollection.insertOne(student);

        res.status(201).json({
          message: "Student added successfully",
          studentId: result.insertedId
        });
      } catch (error) {
        console.error(error);
        res.status(500).json({
          message: "Failed to add student"
        });
      }
    });

    // Get attendance records for a selected date
    app.get("/api/attendance", async (req, res) => {
      try {
        const { date } = req.query;

        if (!date) {
          return res.status(400).json({
            message: "Date is required"
          });
        }

        const records = await attendanceCollection
          .find({ date: date })
          .toArray();

        res.json(records);
      } catch (error) {
        console.error(error);
        res.status(500).json({
          message: "Failed to fetch attendance"
        });
      }
    });

    // Mark or update attendance
    app.post("/api/attendance", async (req, res) => {
      try {
        const { studentId, rollNumber, date, status } = req.body;

        if (
          !studentId ||
          !rollNumber ||
          !date ||
          !["Present", "Absent"].includes(status)
        ) {
          return res.status(400).json({
            message: "Valid student, date, and status are required"
          });
        }

        await attendanceCollection.updateOne(
          {
            studentId: studentId,
            date: date
          },
          {
            $set: {
              studentId: studentId,
              rollNumber: rollNumber,
              date: date,
              status: status
            }
          },
          {
            upsert: true
          }
        );

        res.json({
          message: "Attendance saved successfully"
        });
      } catch (error) {
        console.error(error);
        res.status(500).json({
          message: "Failed to save attendance"
        });
      }
    });

    // Get attendance report for all students
    app.get("/api/reports", async (req, res) => {
      try {
        const students = await studentsCollection.find({}).toArray();
        const records = await attendanceCollection.find({}).toArray();

        const reports = students.map((student) => {
          const studentRecords = records.filter(
            (record) => record.studentId === student._id.toString()
          );

          const totalDays = studentRecords.length;
          const presentDays = studentRecords.filter(
            (record) => record.status === "Present"
          ).length;
          const absentDays = studentRecords.filter(
            (record) => record.status === "Absent"
          ).length;

          const percentage =
            totalDays === 0
              ? 0
              : Math.round((presentDays / totalDays) * 100);

          return {
            name: student.name,
            rollNumber: student.rollNumber,
            className: student.className,
            totalDays,
            presentDays,
            absentDays,
            percentage
          };
        });

        res.json(reports);
      } catch (error) {
        console.error(error);
        res.status(500).json({
          message: "Failed to generate attendance reports"
        });
      }
    });

    // Start the server
    app.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}`);
    });

  } catch (error) {
    console.error("Failed to connect to MongoDB:", error);
  }
}

startServer();
