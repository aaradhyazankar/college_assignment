let students = [];

function addStudent() {

    let name = document.getElementById("name").value;
    let physics = Number(document.getElementById("physics").value);
    let chemistry = Number(document.getElementById("chemistry").value);
    let maths = Number(document.getElementById("maths").value);

    if (name == "") {
        alert("Enter student name");
        return;
    }

    let total = physics + chemistry + maths;
    let percentage = (total / 300) * 100;

    let student = {
        name: name,
        physics: physics,
        chemistry: chemistry,
        maths: maths,
        total: total,
        percentage: percentage
    };

    students.push(student);

    displayStudents();
}

function displayStudents() {

    let table = document.getElementById("studentTable");

    table.innerHTML = "";

    for (let student of students) {

        let row = document.createElement("tr");

        row.innerHTML =
            "<td>" + student.name + "</td>" +
            "<td>" + student.physics + "</td>" +
            "<td>" + student.chemistry + "</td>" +
            "<td>" + student.maths + "</td>" +
            "<td>" + student.total + "</td>" +
            "<td>" + student.percentage.toFixed(2) + "%</td>";

        table.appendChild(row);
    }

    let topper = students[0];

    for (let student of students) {

        if (student.percentage > topper.percentage) {
            topper = student;
        }
    }

    document.getElementById("topper").innerHTML =
        "Topper: " + topper.name;
}