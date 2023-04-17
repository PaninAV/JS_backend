const express = require("express");
const { initDB } = require("./db");
const ToDo = require("./db/models/ToDo model");
const app = express();
const port = 3100;
const cors = require("cors");

app.use(express.json());
app.use(cors());

app.listen(port, () => {
  console.log("Application listening on port " + port);
});

app.get("/sum", (req, res) => {
  const a = req.body.a;
  const b = req.body.b;

  if (a === String(a) || b === String(b)) {
    res.json({ message: "ERROR" });
  } else {
    const sum = a + b;
    res.json({ sum: sum });
  }
});

app.post("/reverse-case", (req, res) => {
  const text_str = req.body.text;
  let new_str = "";
  for (let i = 0; i < text_str.length - 1; i++) {
    let ch = text_str.charAt(i);
    if (ch === ch.toUpperCase()) {
      ch = ch.toLowerCase();
    } else {
      ch = ch.toUpperCase();
    }
    new_str += ch;
  }
  res.json({ new_str: new_str });
});

app.put("/obj-to-array", (req, res) => {
  const x = req.body.x;
  const massKeys = Object.keys(x);
  const massValues = Object.values(x);
  console.log(massKeys, massValues);
  let mass = [];
  for (let i = 0; i < massKeys.length; i++) {
    mass.push({
      key: massKeys[i],
      Value: massValues[i],
    });
  }
  res.json({ mass: mass });
});

app.patch("/reverse-array", (req, res) => {
  const arr = req.body.arr;
  let reverse_arr = [];
  let n = 0;
  for (let i = arr.length - 1; i >= 0; i--) {
    reverse_arr[n] = arr[i];
    n += 1;
  }
  res.json({ reverse_arr: reverse_arr });
});

app.delete("/delete", (req, res) => {
  mass = req.body.mass;
  const result = Array.from(new Set(mass));
  res.json({ newmass: result });
});

initDB();

app.get("/api/todo", async (req, res) => {
  try {
    const list = await ToDo.findAll();
    res.json({ todoList: list });
  } catch (error) {
    res.status(500).json({ message: "ERROR", error });
  }
});

app.get("/api/todo/:id", async (req, res) => {
  try {
    //как сократить запись
    const single_todo = await ToDo.findOne({
      where: {
        id: req.params.id,
      },
    });
    if (single_todo === null) {
      res.status(404).json({ message: "ToDo not found" });
    } else {
      res.json({ todo: single_todo });
    }
  } catch (error) {
    res.status(500).json({ message: "ERROR" });
  }
});

app.post("/api/todo", async (req, res) => {
  try {
    const todo = await ToDo.create({
      title: req.body.title,
      description: req.body.description,
    });
    res.json({ todo: todo });
  } catch (error) {
    res.status(500).json({ message: "ERROR" });
  }
});

app.patch("/api/todo/:id", async (req, res) => {
  try {
    if (
      (await ToDo.findOne({
        where: {
          id: req.params.id,
        },
      })) == null
    ) {
      res.status(404).json({ message: "ToDo not found" });
    } else {
      await ToDo.update(
        {
          title: req.body.title,
          description: req.body.description,
        },
        {
          where: {
            id: req.params.id,
          },
        }
      );
      res.json({ message: "complete" });
    }
  } catch (error) {
    res.status(500).json({ message: "ERROR" });
  }
});

app.delete("/api/todo/:id", async (req, res) => {
  try {
    if (
      (await ToDo.findOne({
        where: {
          id: req.params.id,
        },
      })) == null
    ) {
      res.status(404).json({ message: "ToDo not found" });
    } else {
      await ToDo.destroy({
        where: {
          id: req.params.id,
        },
      });
      res.json({ message: "Complete" });
    }
  } catch (error) {
    res.status(500).json({ message: "ERROR" });
  }
});

app.delete("/api/todo", async (req, res) => {
  try {
    await ToDo.destroy({ where: {} });
    res.json({ message: "Complete" });
  } catch (error) {
    res.status(500).json({ message: "ERROR" });
  }
});
