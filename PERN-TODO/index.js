const express = require("express");
const app = express();
const cors = require("cors");
const pool = require("./db");
const path = require("path");
const PORT = process.env.PORT || 5000;

// process.env.PORT
// process.env.NODE_ENV => production

// middleware
app.use(cors());
app.use(express.json());

if (process.env.NODE_ENV === "production") {
    // server static content
    // npm run build
    app.use(express.static(path.join(__dirname, "react/build")))
}

// routes //

// create
app.post("/todos", async(req, res) => {
    try {
       const {description}= req.body;
       const newTodo = await pool.query("INSERT INTO todo (description) VALUES ($1) RETURNING *",
       [description]
    );
    
    res.json(newTodo.rows[0]);
    } catch (err) {
        console.error(err.message);
    }
})

// get all
app.get("/todos", async(req, res) => {
    try {
       const allTodos = await pool.query("SELECT * FROM todo");
       res.json(allTodos.rows);
    } catch (err) {
        console.error(err.message);
    }
});

// get a todo
app.get("/todos/:id", async(req, res) => {
    try {
       const { id } = req.params;
       const todo = await pool.query("SELECT * FROM todo WHERE id = $1, [id]");
       res.json(todo.rows[0]);
    } catch (err) {
        console.error(err.message);
    }
});

// update
app.put("/todos/:id", async(req, res) => {
    try {
        const { id } = req.params;
        const { description } = req.body;
        const updateTodo = await pool.query("UPDATE todo SET description = $1 WHERE id = $2",
        [description, id]);
        res.json("Todo updated!");
     } catch (err) {
         console.error(err.message);
     }
});

// delete
app.delete("/todos/:id", async (req, res) => {
    try {
      const {id} = req.params;
      const deleteTodo = await pool.query("DELETE FROM todo WHERE id = $1", [id]);
      res.json("Todo was deleted!");  
    } catch (err) {
        console.log(err.message)
    }
});

// listener
app.listen(PORT, ()=>{
    console.log("server is live");
})