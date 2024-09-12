import express from "express";
import mongoose from "mongoose";
import User from "./models/User.js";
import path from "path";
import dotenv from "dotenv";
import { fileURLToPath } from "url";

// Load environment variables from confidential.env file
dotenv.config({ path: "./confidential.env" });

const app = express();

// Use environment variable for MongoDB URI
mongoose.connect(process.env.MONGO_URI);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.get("/", function (req, res) {
  const message = req.query.message || "";
  res.sendFile(path.join(__dirname, "public", "login.html"));
});

app.get("/signup", (req, res) => {
  const message = req.query.message || "";
  res.sendFile(path.join(__dirname, "public", "signup.html"));
});

app.post("/signup", async function (req, res) {
  const { username, password } = req.body;

  try {
    const newUser = new User({
      username,
      password,
    });

    await newUser.save();
    res.redirect("/?message=Signup successful! Please log in.");
  } catch (err) {
    res.redirect("/signup?message=Error saving user. Please try again.");
  }
});

app.post("/login", async function (req, res) {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });

    if (!user || user.password !== password) {
      return res.redirect("/?message=Invalid username or password");
    }

    res.sendFile(path.join(__dirname, "public", "weatherDesign.html"));
  } catch (err) {
    res.send("Error during login");
  }
});

app.get("/weatherDesign", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "weatherDesign.html"));
});

app.listen(3000, function () {
  console.log(`Server is running`);
});
