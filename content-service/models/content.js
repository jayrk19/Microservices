const mongoose = require("mongoose");

const contentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  story: {
    type: String,
    required: true,
  },
  publishedDate: {
    type: Date,
    required: true,
    default: Date.now,
  },
  userId: {
    type: String,
    required: true,
  },
  read: {
    type: Number,
    required: true,
    default: 0,
  },
  like: {
    type: Number,
    required: true,
    default: 0,
  },
});

module.exports = mongoose.model("Content", contentSchema);
