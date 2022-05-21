const mongoose = require("mongoose");
const slugify = require("slugify");
const validator = require("validator");

const articleSchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
    minLength: [5, "Article must contain 5 or more characters!"],
    maxLength: [80, "Article can contain at most 80 characters!"],
  },
  description: {
    description: {
      type: String,
      maxLength: [
        1000,
        "Article description can contain at most 1000 characters!",
      ],
    },
    address: {
      location: {
        type: String,
        default: "Point",
        enum: ["Point"],
      },
      coordinates: [Number],
      city: { type: String, required: true },
      street: { type: String, required: true },
    },
    area: Number,
  },
  availible: {
    isAvailible: {
      type: Boolean,
      default: true,
    },
    rentedAt: Date,
    availibleAt: Date,
  },
  price: {
    type: Number,
    required: true,
  },
  images: [
    {
      type: String,
      default: "default.jpeg",
    },
  ],
  status: {
    type: String,
    enum: ["standard", "promoted", "premium"],
    default: "standard",
  },
  reviews: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  active: {
    type: Boolean,
    default: true,
  },
  slug: String,
  createdAt: Date,
});

articleSchema.pre("save", function (next) {
  this.slug = slugify(this.title, { lower: true });
  this.createdAt = new Date(Date.now());
  next();
});

const Article = mongoose.model("Article", articleSchema);

module.exports = Article;
