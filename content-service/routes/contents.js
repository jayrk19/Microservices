const express = require("express");
const router = express.Router();
const Content = require("../models/content");

router.get("/", async (req, res) => {
  try {
    const contents = await Content.find();
    res.status(200).json(contents);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const content = await Content.findById(req.params.id);
    if (content == null) {
      return res
        .status(400)
        .json({ message: "No content found with the given id" });
    }
    res.status(200).json(content);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/", async (req, res) => {
  const content = new Content({
    title: req.body.title,
    story: req.body.story,
    userId: req.body.userId,
  });
  try {
    const existingContent = await Content.find({
      title: content.title,
      userId: content.userId,
    });
    if (existingContent.length != 0) {
      return res.status(400).json({
        message:
          "Content already exists with content id " + existingContent[0]._id,
      });
    }
    const newContent = await content.save();
    res.status(201).json(newContent);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.patch("/:id", async (req, res) => {
  try {
    const content = await Content.findById(req.params.id);
    if (content == null) {
      return res.status(400).send("No content found with id " + req.params.id);
    }
    if (req.body.title != null) content.title = req.body.title;
    if (req.body.story != null) content.story = req.body.story;

    const newContent = await content.save();
    res.status(200).json(newContent);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
router.patch("/:id/read", async (req, res) => {
  try {
    const content = await Content.findById(req.params.id);
    if (content == null) {
      return res.status(400).send("No content found with id " + req.params.id);
    }
    content.read++;
    const newContent = await content.save();
    res.status(200).send(newContent);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
router.patch("/:id/like", async (req, res) => {
  try {
    const content = await Content.findById(req.params.id);
    if (content === null) {
      return res.status(400).send("No content found with id " + req.params.id);
    }
    content.like++;
    const newContent = await content.save();
    res.status(200).send(newContent);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
router.patch("/:id/unlike", async (req, res) => {
  try {
    const content = await Content.findById(req.params.id);
    if (content == null) {
      return res.status(400).send("No content found with id " + req.params.id);
    }
    if (content.like == 0) {
      return res
        .status(400)
        .send("No likes found for content with id " + req.params.id);
    }
    content.like--;
    const newContent = await content.save();
    res.status(200).send(newContent);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const content = await Content.findById(req.params.id);
    if (content == null) {
      return res.status(400).send("No content found with id " + req.params.id);
    }

    await content.deleteOne();

    res.status(200).json({ message: "Successfully removed the content" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
