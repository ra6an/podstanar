const mongoose = require("mongoose");

const reviewSchema = mongoose.Schema({
  review: {
    type: String,
    minLength: [1, "Review must contain at least 1 character!"],
    maxLength: [400, "Review can contain at most 400 characters!"],
  },
  rating: {
    type: Number,
    default: 5,
    min: [1, "Lowest rating must be at least 1!"],
    max: [5, "Highest rating can be at most 5!"],
  },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  article: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Article",
  },
  createdAt: Date,
});

reviewSchema.pre("save", function (next) {
  this.createdAt = new Date(Date.now());
  next();
});

const Review = mongoose.model("Review", reviewSchema);

module.exports = Review;
