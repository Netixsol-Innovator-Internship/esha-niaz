import express from "express"; //express web-framework that handles http request (get,post,del,put)
import type { Request, Response } from "express"; //type from express for better ttypescipt type safety
import cors from "cors"; //cors → Middleware that allows cross-origin requests
import type { Task } from "./types.js";
import { v4 as uuidv4 } from "uuid"; // function to generate unique ids

const app = express();
app.use(cors());
app.use(express.json()); //Parses incoming JSON request bodies automatically,

let tasks: Task[] = []; //in memory array to store task .no db used

// GET /api/tasks
app.get("/", (_req: Request, res: Response) => {
  res.send("🚀 Task API is running. Use /api/tasks");
});

app.get("/api/tasks", (_req: Request, res: Response) => {
  res.json(tasks);
});

// POST /api/tasks
app.post("/api/tasks", (req: Request, res: Response) => {
  const { title } = req.body;
  if (!title || !title.trim()) return res.status(400).json({ error: "Task title required" });
  const newTask: Task = { id: uuidv4(), title, completed: false };
  tasks.push(newTask);
  res.status(201).json(newTask);
});

// PUT /api/tasks/:id
app.put("/api/tasks/:id", (req: Request, res: Response) => {
  const { id } = req.params;
  const task = tasks.find(t => t.id === id);
  if (!task) return res.status(404).json({ error: "Task not found" });
  task.completed = !task.completed;
  res.json(task);
});

// DELETE /api/tasks/:id
app.delete("/api/tasks/:id", (req: Request, res: Response) => {
  const { id } = req.params;
  tasks = tasks.filter(t => t.id !== id);
  res.status(204).send();
});

app.listen(5000, () => console.log("Server running on http://localhost:5000")); //start a server 
