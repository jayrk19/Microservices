const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  contentId: {
    type: String,
    required: true,
  },
  read: {
    type: Boolean,
    required: true,
    default: false,
  },
  like: {
    type: Boolean,
    required: true,
    default: false,
  },
});

module.exports = mongoose.model("UserInteraction", userSchema);
