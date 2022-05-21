const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");

const userSchema = mongoose.Schema({
  username: {
    type: String,
    unique: true,
    required: true,
    minLength: [3, "Username need to contain at least 3 characters!"],
    maxLength: [20, "Username can contain at most 20 characters!"],
  },
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
    validate: [
      validator.isEmail,
      "This is not a valid email address, please enter a valid one!",
    ],
  },
  role: {
    type: String,
    default: "user",
    enum: ["user", "admin", "moderator"],
  },
  password: {
    type: String,
    required: true,
    minLength: [6, "Password need to contain at least 6 characters"],
    maxLength: [30, "Password need to contain at least 30 characters"],
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: true,
    validate: {
      validator: function (input) {
        return this.password === input;
      },
      message: "Your Confirm Password must match with Password!",
    },
  },
  reputation: {
    type: Number,
    min: [0],
    max: [5],
  },
  active: {
    type: Boolean,
    default: true,
  },
  messages: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
    },
  ],
  rentedRealEstate: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Article",
    },
  ],
  bookedRealEstate: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Article",
    },
  ],
  reviews: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
  createdAt: Date,
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
});

userSchema.pre("save", function (next) {
  this.createdAt = new Date(Date.now());
  next();
});

userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    const hashedPassword = await bcrypt.hash(this.password, 12);
    this.password = hashedPassword;
    this.passwordConfirm = undefined;
  }
  next();
});

userSchema.pre(/^find/, function (next) {
  this.find({ active: { $ne: false } });
  next();
});

userSchema.methods.comparePasswords = function (
  inputedPassword,
  hashedPassword
) {
  const compare = bcrypt.compare(inputedPassword, hashedPassword);

  return compare;
};

const User = mongoose.model("User", userSchema);

module.exports = User;
