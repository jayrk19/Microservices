const express = require("express");
const router = express.Router();
const Content = require("../models/content");

router.post("/", async (req, res) => {
  try {
    const content = new Content(req.body);
    const newContent = await content.save();
    res.status(200).json(newContent);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
