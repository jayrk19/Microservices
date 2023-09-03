const express = require("express");
const mongoose = require("mongoose");
const UserInteraction = require("./routes/userInteractions");

require("dotenv").config();
const PORT = 3001;

const app = express();
app.use(express.json());

mongoose.connect(process.env.DATABASE_URI);

const db = mongoose.connection;
db.on("error", (error) => console.error(error));
db.once("open", () => console.log("Connected to database"));

app.use("/userInteractions", UserInteraction);

app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);
