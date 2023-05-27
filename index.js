const express = require("express");
const { initDB } = require("./db");
const ToDo = require("./db/models/ToDo.model");
const User = require("./db/models/User.model");
const Token = require("./db/models/Token.model");
const app = express();
const port = 3100;
const cors = require("cors");
const { nanoid } = require("nanoid");

app.use(express.json());
app.use(cors());

app.listen(port, () => {
  console.log("Application listening on port " + port);
});

initDB();

app.post("/registration", async (req, res) => {
  try {
    if ((await User.findOne({ where: { mail: req.body.mail } })) == null) {
      const single_user = await User.create({
        password: req.body.password,
        mail: req.body.mail,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
      });
      res.json({ user: single_user });
    } else {
      res.status(400).json({ message: "EMail уже существует" });
    }
  } catch (error) {
    res.status(500).json({ message: "ERROR", error });
  }
});

app.post("/auth", async (req, res) => {
  try {
    const tokenValue = nanoid(64);
    const user = await User.findOne({
      where: { mail: req.body.mail, password: req.body.password },
    });
    if (user != null) {
      const token = await Token.create({
        value: tokenValue,
        userId: user.id,
      });
      res.json({ token: token });
    } else {
      res.status(400).json({ message: "НЕПРАВИЛЬНЫЕ ДАННЫЕ" });
    }
  } catch (error) {
    res.status(500).json({ message: "ERROR", error });
  }
});

app.use(async (req, res, next) => {
  if (req.headers.value === null) {
    return res.status(400).json({ message: "troken not provided" });
  }
  const token = await Token.findOne({
    where: { value: req.headers.value },
  }); 
  if (token === null) {
    return res.status(400).json({ message: "troken not found" });
  }
  req.userId = token.userId;
  next();
});

app.get("/api/todos", async (req, res) => {
  try {
    console.log("get", req.headers);
    const list = await ToDo.findAll({
      where: {
        userId: req.userId,
      },
    });
    res.json({ todoList: list });
  } catch (error) {
    res.status(500).json({ message: "ERROR", error });
  }
});

// app.get("/api/todo/:id", async (req, res) => {
//   try {
//     const single_todo = await ToDo.findOne({
//       where: {
//         id: req.params.id,
//       },
//     });
//     if (single_todo === null) {
//       res.status(404).json({ message: "ToDo not found" });
//     } else {
//       res.json({ todo: single_todo });
//     }
//   } catch (error) {
//     res.status(500).json({ message: "ERROR" });
//   }
// });

app.post("/api/todos", async (req, res) => {
  try {
    const todo = await ToDo.create({
      title: req.body.title,
      description: req.body.description,
      userId: req.userId,
    });
    res.json({ todo: todo });
  } catch (error) {
    res.status(500).json({ message: "ERROR" });
  }
});

app.patch("/api/todos/:id", async (req, res) => {
  try {
    if (
      (await ToDo.findOne({
        where: {
          id: req.params.id,
          userId: req.userId,
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
            userId: req.userId,
          },
        }
      );
      res.json({ message: "complete" });
    }
  } catch (error) {
    res.status(500).json({ message: "ERROR" });
  }
});

app.delete("/api/todos/:id", async (req, res) => {
  try {
    if (
      (await ToDo.findOne({
        where: {
          id: req.params.id,
          userId: req.userId,
        },
      })) == null
    ) {
      res.status(404).json({ message: "ToDo not found" });
    } else {
      await ToDo.destroy({
        where: {
          id: req.params.id,
          userId: req.userId
        },
      });
      res.json({ message: "Complete" });
    }
  } catch (error) {
    res.status(500).json({ message: "ERROR" });
  }
});

app.delete("/api/todos", async (req, res) => {
  try {
    await ToDo.destroy({ where: { userId: req.userId } });
    res.json({ message: "Complete" });
  } catch (error) {
    res.status(500).json({ message: "ERROR" });
  }
});

app.delete("/logout/", async (req, res) => {
  try {
    await Token.destroy({ where: { userId: req.userId } });
    res.json({ message: "Complete" });
  } catch (error) {
    res.status(500).json({ message: "ERROR" });
  }
});

// app.get("/getTokens", async(req, res) => {
//   try {
//     const list = await Token.findAll();
//     res.json({ tokenList: list });
//   } catch (error) {
//     res.status(500).json({ message: "ERROR", error });
//   }
// })

// app.get("/getUsers", async(req, res) => {
//   try {
//     const list = await User.findAll();
//     res.json({ UserList: list });
//   } catch (error) {
//     res.status(500).json({ message: "ERROR", error });
//   }
// })
