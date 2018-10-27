const mongoose = require("mongoose");

const Result = mongoose.model("Result", {
  _creator: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  submittedAt: {
    type: Number,
    default: Date.now()
  },
  winner: {
    type: String,
    required: true
  },
  loser: {
    type: String,
    required: true
  },
  confirmed: {
    type: Boolean,
    default: false
  }
});

module.exports = { Result };
