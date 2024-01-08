const mongoose = require("mongoose");

const NotificationSchema = new mongoose.Schema(
  {
    description: {
      type: String,
    },
    id_owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    id_receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    is_checked: {
      type: Boolean,
      default: false,
    },

  },
  { timestamps: true }
);

module.exports = mongoose.model("Notification", NotificationSchema);