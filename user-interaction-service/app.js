const express = require("express");
const mongoose = require("mongoose");
const UserInteraction = require("./routes/userInteractions");

require("dotenv").config();

const app = express();
app.use(express.json());

mongoose.connect(process.env.DATABASE_URI);

const db = mongoose.connection;
db.on("error", (error) => console.error(error));
db.once("open", () => console.log("Connected to database"));

app.use("/userInteractions", UserInteraction);

app.listen(process.env.USER_INTERACTION_SERVICE_PORT, () =>
  console.log(`Server running on http://${process.env.USER_INTERACTION_SERVICE_DOMAIN}:${process.env.USER_INTERACTION_SERVICE_PORT}`)
);
