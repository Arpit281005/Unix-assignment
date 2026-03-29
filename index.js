const express = require("express");
const Database = require("better-sqlite3");

const app = express();
app.use(express.urlencoded({ extended: true }));

// Database setup
const db = new Database("data.db");

// Create table with completed column
db.prepare(`
  CREATE TABLE IF NOT EXISTS items (
    id INTEGER PRIMARY KEY,
    name TEXT,
    completed INTEGER DEFAULT 0
  )
`).run();

// HOME
app.get("/", (req, res) => {
    const rows = db.prepare("SELECT * FROM items").all();

    let html = `
    <html>
    <head>
        <title>Todo App</title>
        <style>
            body {
                font-family: Arial;
                background: #f4f4f4;
                text-align: center;
                padding: 40px;
            }
            h2 {
                color: #333;
            }
            form {
                margin-bottom: 20px;
            }
            input {
                padding: 10px;
                width: 220px;
                border-radius: 5px;
                border: 1px solid #ccc;
            }
            button {
                padding: 8px 12px;
                border: none;
                border-radius: 5px;
                cursor: pointer;
                margin-left: 5px;
            }
            .add-btn { background: #28a745; color: white; }
            .delete-btn { background: #dc3545; color: white; }
            .done-btn { background: #007bff; color: white; }

            ul {
                list-style: none;
                padding: 0;
            }
            li {
                background: white;
                margin: 10px auto;
                padding: 10px;
                width: 350px;
                border-radius: 5px;
                box-shadow: 0 0 5px rgba(0,0,0,0.1);
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
            .completed {
                text-decoration: line-through;
                color: gray;
            }
        </style>
    </head>
    <body>
        <h2>My Todo App 🚀</h2>

        <form method="POST" action="/add">
            <input name="name" placeholder="Enter task..." required />
            <button class="add-btn">Add</button>
        </form>

        <ul>
    `;

    rows.forEach(r => {
        html += `
        <li>
            <span class="${r.completed ? "completed" : ""}">
                ${r.name}
            </span>
            <div>
                <form style="display:inline;" method="POST" action="/toggle/${r.id}">
                    <button class="done-btn">✔</button>
                </form>
                <form style="display:inline;" method="POST" action="/delete/${r.id}">
                    <button class="delete-btn">✖</button>
                </form>
            </div>
        </li>
        `;
    });

    html += `
        </ul>
    </body>
    </html>
    `;

    res.send(html);
});

// ADD
app.post("/add", (req, res) => {
    db.prepare("INSERT INTO items(name) VALUES(?)").run(req.body.name);
    res.redirect("/");
});

// DELETE
app.post("/delete/:id", (req, res) => {
    db.prepare("DELETE FROM items WHERE id = ?").run(req.params.id);
    res.redirect("/");
});

// TOGGLE COMPLETE
app.post("/toggle/:id", (req, res) => {
    const item = db.prepare("SELECT completed FROM items WHERE id = ?").get(req.params.id);

    if (!item) {
        return res.redirect("/");
    }

    const newStatus = item.completed ? 0 : 1;

    db.prepare("UPDATE items SET completed = ? WHERE id = ?")
      .run(newStatus, req.params.id);

    res.redirect("/");
});
// START SERVER
app.listen(3000, () => {
    console.log("Running on port 3000");
});