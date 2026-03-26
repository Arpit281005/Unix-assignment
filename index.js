const express = require("express");
const sqlite3 = require("sqlite3").verbose();

const app = express();
app.use(express.urlencoded({ extended: true }));

// Connect DB
const db = new sqlite3.Database("data.db");

// Create table
db.run("CREATE TABLE IF NOT EXISTS items (id INTEGER PRIMARY KEY, name TEXT)");

// Home route
app.get("/", (req, res) => {
    db.all("SELECT * FROM items", [], (err, rows) => {
        let html = `
        <h2>My Todo App</h2>
        <form method="POST" action="/add">
            <input name="name" placeholder="Enter task here"/>
            <button>Add</button>
        </form>
        <ul>
        `;
        rows.forEach(r => {
            html += `<li>${r.name}</li>`;
        });
        html += "</ul>";
        res.send(html);
    });
});

app.post("/add", (req, res) => {
    db.run("INSERT INTO items(name) VALUES(?)", [req.body.name]);
    res.redirect("/");
});

app.listen(3000, () => console.log("Running on port 3000"));