const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
const userRoutes = require("./routes/users");
app.use("/users", userRoutes);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.log(err));

app.get("/", (req, res) => {
  res.send("MongoDB CRUD API Running");
});

const PORT = process.env.PORT || 3000;
console.log("PORT VALUE:", process.env.PORT);

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});