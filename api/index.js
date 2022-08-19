import express from "express";
import pkg from "@prisma/client";
import morgan from "morgan";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(morgan("dev"));

const { PrismaClient } = pkg;
const prisma = new PrismaClient();

// GET: list of all blogss
app.get("/blogs", async (req, res) => {
  const blogs = await prisma.blogItem.findMany();
  res.status(200).json(blogs);
});

// POST: creates new blog
app.post("/blogs", async (req, res) => {
  const { title, content } = req.body;
  const newBlog = await prisma.blogItem.create({
    data: {
      title,
      content,
    },
  });
  if (newBlog) {
    res.status(201).json(newBlog);
  } else {
    res.status(404).send(`Create Failed`);
  }
});

// DELETE: delete blog with :id
app.delete("/blog/:id", async (req, res) => {
  const id = Number(req.params.id);
  const deleteItem = await prisma.blogItem.delete({
    where: {
      id: id,
    },
  });
  if (deleteItem) {
    res.status(200).json(deleteItem);
  } else {
    res.status(404).send(`Blog id ${req.params.id} not found`);
  }
});

// GET: return blog with :id
app.get("/blog/:id", async (req, res) => {
  const id = Number(req.params.id);
  const blog = await prisma.blogItem.findUnique({
    where: {
      id: id,
    },
  });
  if (blog) {
    res.status(200).json(blog);
  } else {
    res.status(404).send(`Blog id ${req.params.id} not found`);
  }
});

// PUT: updates blog with :id
app.put("/blog/:id", async (req, res) => {
  const { title, content } = req.body;
  const id = Number(req.params.id);
  const updateItem = await prisma.blogItem.update({
    where: {
      id: id,
    },
    data: {
      title,
      content,
    },
  });
  if (updateItem) {
    res.status(200).json(updateItem);
  } else {
    res.status(404).send(`Blog id ${req.params.id} not found`);
  }
});

// Starts HTTP Server
app.listen(8000, () => {
  console.log("Server running on http://localhost:8000 🎉 🚀");
});
