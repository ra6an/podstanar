const mongoose = require("mongoose");

const messageSchema = mongoose.Schema({
  messages: [
    {
      text: {
        type: String,
        required: true,
        minLength: [1, "Message must contain at least 1 character!"],
        maxLength: [250, "Message can contain at most 250 characters!"],
      },
      creator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      recipient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      seen: {
        type: Boolean,
        default: false,
      },
      createdAt: { type: Date, default: new Date(Date.now()) },
    },
  ],
});

// messageSchema.pre("save", function (next) {
//   this.messages[0].createdAt = new Date();
//   next();
// });

const Message = mongoose.model("Message", messageSchema);

module.exports = Message;
