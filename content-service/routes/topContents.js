const express = require("express");
const router = express.Router();
const Content = require("../models/content");

router.get("/", async (req, res) => {
  try {
    const data = await Content.aggregate([
      { $addFields: { sort_order: { $add: ["$like", "$read"] } } },
      { $sort: { sort_order: -1 } },
      { $project: { sort_order: 0 } },
    ]);

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
