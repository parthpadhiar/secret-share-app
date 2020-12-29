const mongoose = require("mongoose");
const autoIncrement = require("mongoose-auto-increment");
const log = require("../constants/bunyan.constant");

const secretSchema = mongoose.Schema({
  user_id: Number,
  secret_id: Number,
  secret: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

autoIncrement.initialize(mongoose.connection);
secretSchema.plugin(autoIncrement.plugin, {
  model: "Secret",
  field: "secret_id",
  startAt: 1,
  incrementBy: 1,
});

module.exports = mongoose.model("Secret", secretSchema);
