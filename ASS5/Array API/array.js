const express = require("express")

const app = express();

app.use(express.json());

let students = [
    { id: 1, name: "Aaradhya", marks: 90 },
    { id: 2, name: "Gaurav", marks: 96 },
    { id: 3, name: "Harshal", marks: 95 },
];

app.get("/abc", (req, res) => {
    res.send(students);
});

app.post("/students", (req,res) => {
    students.push(req.body);
     res.send("Record added successfully");
});

app.delete("/students/:id", (req, res) => {
    const id = Number(req.params.id);
    
    students = students.filter(s=> s.id !== id);

    res.send("Students Deleted");
});

app.put("/students/:id", (req, res) => {
    const id = Number(req.params.id);

    const student = students.find(s => s.id === id);

    if (student) {
        student.name = req.body.name;
        student.marks = req.body.marks;

        res.send("Students updated successfully");
    } else {
        res.send("Student not found");
    }
});


app.listen(3000, () => {
    console.log("Server running on port 3000");
});