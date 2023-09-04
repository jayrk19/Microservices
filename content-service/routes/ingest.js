const express = require("express");
const router = express.Router();
const multer = require("multer");
const axios = require("axios");
const fs = require("fs");
const upload = multer({
  dest: "./uploads",
});
const csv = require("fast-csv");
const Content = require("../models/content");

const validateUserId = async (userId) => {
  let isValid;
  await axios
    .get(`http://${process.env.USER_SERVICE_DOMAIN}:${process.env.USER_SERVICE_PORT}/users/${userId}`)
    .then(() => {
      isValid = true;
    })
    .catch(() => {
      isValid = false;
    });

  return isValid;
};
router.post("/", upload.single("file"), async (req, res) => {
  try {
    const file = req.file;
    let records = [];
    fs.createReadStream(file.path)
      .pipe(csv.parse({ headers: true }))
      .on("data", async (data) => {
        records.push({
          title: data.title,
          story: data.story,
          userId: data.userId,
        });
      })
      .on("error", (err) => {
        res.status(500).json({
          message:
            "Unable to parse the file, please ensure the file uploaded is CSV : " +
            err.message,
        });
      })
      .on("end", async () => {
        try {
          let check = true;
          records.every((content) => {
            check = validateUserId(content.userId);
            if (check === false) {
              return false;
            }
          });
          if (check === false) {
            res
              .status(500)
              .json({ message: "Bad Request, please provide valid details" });
          } else {
            const newContents = await Content.insertMany(records);
            res.status(201).json({ message: "Successfully ingested records from csv file", newContents });
          }
        } catch (error) {
          res.status(500).json({ message: error.message });
        }
      });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
