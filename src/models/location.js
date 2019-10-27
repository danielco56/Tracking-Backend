const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const LocationSchema = new Schema({
  longitude: {
    type: String,
    required: true
  },
  latitude: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    required: true
  },
  userId: {
    type: Schema.Types.ObjectId,
    required: true
  }
});

module.exports = mongoose.model("Location", LocationSchema);
