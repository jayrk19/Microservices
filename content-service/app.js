const express = require("express");
const mongoose = require("mongoose");
const Ingest = require("./routes/ingest");
const Contents = require("./routes/contents");
const NewContents = require("./routes/newContents");
const TopContents = require("./routes/topContents");

require("dotenv").config();
const PORT = 3000;

const app = express();
app.use(express.json());

mongoose.connect(process.env.DATABASE_URI);

const db = mongoose.connection;
db.on("error", (error) => console.error(error));
db.once("open", () => console.log("Connected to database"));

app.use("/contents", Contents);
app.use("/ingest", Ingest);
app.use("/newContents", NewContents);
app.use("/topContents", TopContents);

app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);
