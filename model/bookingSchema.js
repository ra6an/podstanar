const mongoose = require("mongoose");

const bookingSchema = mongoose.Schema(
  {
    article: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Article",
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    startingDate: {
      type: Date,
    },
    endingDate: {
      type: Date,
    },
    message: {
      type: String,
      required: true,
      minLength: [1, "You need to provide descriptive message!"],
      maxLength: [500, "You cant have message with more than 500 characters!"],
    },
    status: {
      type: String,
      default: "PENDING",
      enum: ["PENDING", "APPROVED", "REJECTED"],
    },
    createdAt: Date,
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// bookingSchema.virtual('durationDays').get(function() {})

bookingSchema.pre("save", function (next) {
  this.createdAt = new Date(Date.now());
  next();
});

const Booking = mongoose.model("Booking", bookingSchema);

module.exports = Booking;
