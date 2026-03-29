const express = require("express");
const Database = require("better-sqlite3");

const app = express();
app.use(express.urlencoded({ extended: true }));

// Database setup
const db = new Database("data.db");

// Create table
db.prepare(`
  CREATE TABLE IF NOT EXISTS items (
    id INTEGER PRIMARY KEY,
    name TEXT
  )
`).run();

// Home route
app.get("/", (req, res) => {
    const rows = db.prepare("SELECT * FROM items").all();

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

// Add route
app.post("/add", (req, res) => {
    db.prepare("INSERT INTO items(name) VALUES(?)").run(req.body.name);
    res.redirect("/");
});

// Start server
app.listen(3000, () => {
    console.log("Running on port 3000");
});