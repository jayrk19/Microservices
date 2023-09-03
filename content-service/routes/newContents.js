const express = require("express");
const router = express.Router();
const Content = require("../models/content");

router.get("/", async (req, res) => {
  try {
    const contents = await Content.find().sort({ publishedDate: -1 });
    res.status(200).json(contents);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
