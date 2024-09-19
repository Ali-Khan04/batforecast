import express from "express";
import mongoose from "mongoose";
import User from "./models/User.js";
import path from "path";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import bcrypt from "bcrypt";
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

const handleSignup = async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    res.status(400).send("Please provide username and password");
  }
  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.redirect("/signup?message=Username already exists");
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      username,
      password: hashedPassword,
    });
    await newUser.save();
    res.redirect("/?message=Signup successful! Please log in.");
  } catch (err) {
    res.status(500).send("Internal Server Error");
  }
};

app.post("/login", async function (req, res) {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.redirect("/?message=Invalid username or password");
    }

    res.sendFile(path.join(__dirname, "public", "weatherDesign.html"));
  } catch (err) {
    res.send("Error during login");
  }
});
app.post("/signup", handleSignup);

app.get("/weatherDesign", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "weatherDesign.html"));
});

app.listen(3000, function () {
  console.log(`Server is running`);
});
