const express = require("express");
const mongoose = require("mongoose");
const Ingest = require("./routes/ingest");
const Contents = require("./routes/contents");
const NewContents = require("./routes/newContents");
const TopContents = require("./routes/topContents");

require("dotenv").config();

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

app.listen(process.env.CONTENT_SERVICE_PORT, () =>
  console.log(`Server running on http://${process.env.CONTENT_SERVICE_DOMAIN}:${process.env.CONTENT_SERVICE_PORT}`)
);
