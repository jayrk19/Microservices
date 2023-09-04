const express = require("express");
const router = express.Router();
const UserInteraction = require("../models/userInteraction");
const axios = require("axios");
require('dotenv').config()

const validateRequest = async (userInteraction) => {
  let isValid;
  await axios
    .get(`http://${process.env.USER_SERVICE_DOMAIN}:${process.env.USER_SERVICE_PORT}/users/${userInteraction.userId}`)
    .then(() => {
      isValid = true;
    })
    .catch(() => {
      isValid = false;
    });
  if (isValid === false) return false;

  await axios
    .get(`http://${process.env.CONTENT_SERVICE_DOMAIN}:${process.env.CONTENT_SERVICE_PORT}/contents/${userInteraction.contentId}`)
    .then(() => {
      isValid = true;
    })
    .catch(() => {
      isValid = false;
    });

  return isValid;
};

const readContentService = async (contentId) => {
  await axios.patch(`http://${process.env.CONTENT_SERVICE_DOMAIN}:${process.env.CONTENT_SERVICE_PORT}/contents/${contentId}/read`);
};
const likeContentService = async (contentId) => {
  await axios.patch(`http://${process.env.CONTENT_SERVICE_DOMAIN}:${process.env.CONTENT_SERVICE_PORT}/contents/${contentId}/like`);
};
const unlikeContentService = async (contentId) => {
  await axios.patch(`http://${process.env.CONTENT_SERVICE_DOMAIN}:${process.env.CONTENT_SERVICE_PORT}/contents/${contentId}/unlike`);
};

router.get("/", async (req, res) => {
  try {
    const userInteractions = await UserInteraction.find();
    res.status(200).json(userInteractions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const userInteraction = await UserInteraction.findById(req.params.id);
    if (userInteraction == null) {
      return res
        .status(400)
        .json({ message: "No userInteraction found with the given id" });
    }
    res.status(200).json(userInteraction);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/", async (req, res) => {
  const userInteraction = new UserInteraction({
    userId: req.body.userId,
    contentId: req.body.contentId,
    read: req.body.read,
    like: req.body.like,
  });
  try {
    let isValid = await validateRequest(userInteraction);
    if (isValid === false) {
      return res.status(400).json({ message: "Invalid user/content provided" });
    }
    await readContentService(userInteraction.contentId);
    if (userInteraction.like === true)
      await likeContentService(userInteraction.contentId);
    const newUserInteraction = await userInteraction.save();
    res.status(201).json(newUserInteraction);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.patch("/:id", async (req, res) => {
  try {
    const userInteraction = await UserInteraction.findById(req.params.id);
    if (userInteraction === null) {
      return res
        .status(400)
        .send("No userInteraction found with id " + req.params.id);
    }

    if (
      req.body.like !== null &&
      req.body.like === true &&
      userInteraction.like === false
    ) {
      userInteraction.like = true;
      await likeContentService(userInteraction.contentId);
    } else if (
      req.body.like !== null &&
      req.body.like === false &&
      userInteraction.like === true
    ) {
      userInteraction.like = false;
      await unlikeContentService(userInteraction.contentId);
    }
    const newUserInteraction = await userInteraction.save();
    res.status(200).json(newUserInteraction);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
