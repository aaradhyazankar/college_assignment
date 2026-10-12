const express = require("express");
const { MongoClient } = require("mongodb");

const app = express();
app.use(express.json());

const client = new MongoClient("mongodb://127.0.0.1:27017");

async function main() {
    await client.connect();

    const db = client.db("studentsDB");
    const students = db.collection("students");

    app.get("/students", async (req, res) => {
        res.json(await students.find().toArray());
    });

    app.post("/students", async (req, res) => {
        await students.insertOne(req.body);
        res.send("Student added");
    });

    app.put("/students/:name", async (req, res) => {
        await students.updateOne(
            { name: req.params.name },
            { $set: req.body }
        );
        res.send("Student updated");
    });

    app.delete("/students/:name", async (req, res) => {
        await students.deleteOne({ name: req.params.name });
        res.send("Student deleted");
    });

    app.listen(3000, () => {
        console.log("Server running on port 3000");
    });
}

main();