import express from "express";
import { PrismaClient } from "@prisma/client";
var cors = require("cors");
const jwt = require("jsonwebtoken");
const prisma = new PrismaClient();
const app = express();
app.use(express.json());
app.use(cors({ origin: true, credentials: true }));
app.get("/users", async (req, res) => {
  try {
    const users = await prisma.therapist.findMany({});
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: "Error fetching users" });
  }
});

app.get("/user", async (req, res) => {
  try {
    const id = req.query.id;
    const user = await prisma.therapist.findUnique({
      where: {
        id: String(id),
      },
    });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: "Error fetching user" });
  }
});

app.post("/user", async (req, res) => {
  const name = req.body.name;
  const password = req.body.password;
  const email = req.body.email;
  const phoneNumber = req.body.phoneNumber;

  try {
    const user = await prisma.user.findFirst({
      where: {
        email: email.toLowerCase(),
      },
    });
    if (user) {
      res
        .json({
          error: "User already exists, try logging in",
        })
        .status(500);
    }
    if (!user) {
      try {
        const user = await prisma.user.create({
          data: {
            name,
            email : email.toLowerCase(),
            phoneNumber,
            password,
          },
        });
        if (user) {
          console.log("User created");
          res
            .json({
              message: "user created",
              userId: user.id,
            })
            .status(201);
        } else {
          res
            .json({
              error: "Error creating user",
            })
            .status(500);
        }
      } catch (err) {
        console.log(err);
        res
          .json({
            error: "Error creating user",
          })
          .status(500);
      }
    }
  } catch (err) {
    console.error(err);
    res
      .json({
        error: "Error checking user",
      })
      .status(500);
  }
});

const JWT_SECRET = process.env.JWT_SECRET || "secret";

app.post("/user/login", async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  try {
    const user = await prisma.user.findFirst({
      where: {
        email: email.toLowerCase(),
      },
    });
    if (user && user.password === password) {
      console.log("Login successful");
      const token = jwt.sign({ userId: user.id }, JWT_SECRET, {
        expiresIn: "1h",
      });
      res.json({
        message: "Login successful",
        token: token,
        userId: user.id,
      });
    } else {
      console.log("Incorrect password");
      res.json({
        message: "Incorrect password",
      });
    }
  } catch (err) {
    console.error(err);

    res.json({
      message: "User not found",
    });
  }
});
app.get("/user/validate", async (req, res): Promise<any> => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ valid: false, message: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userID: string };
    const user = await prisma.user.findFirst({
      where: {
        id: decoded.userID,
      },
    });

    if (!user) {
      console.log("Invalid token not user found");
      return res.status(401).json({ valid: false, message: "Invalid token" });
    } else {
      return res.json({ valid: true, userId: user.id });
    }
  } catch (err) {
    console.log("Invalid token");
    console.log(err);
    return res.status(401).json({ valid: false, message: "Invalid token" });
  }
});

app.get("/user/name", async (req, res) => {
  const id = req.query.id;
  try {
    const user = await prisma.user.findFirst({
      where: {
        id: String(id),
      },
    });
    if (user) {
      res.json({
        name: user.name,
      });
    } else {
      res.status(404).json({ error: "User not found" });
    }
  } catch (err) {
    res.status(500).json({ error: "Error fetching user" });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});