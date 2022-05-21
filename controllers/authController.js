const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const User = require("../model/userSchema");
const catchAsync = require("../utils/catchAsync");

const signToken = (userId) => {
  const expiresIn = process.env.JWT_EXPIRES_IN;
  const token = jwt.sign({ id: userId }, process.env.JWT_SECRET_KEY, {
    expiresIn: `${expiresIn}d`,
  });

  return { token, expiresIn };
};

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);

  const cookieOptions = {
    expires: new Date(Date.now() + token.expiresIn * 24 * 60 * 60 * 1000),
    secure: true,
    httpOnly: true,
  };

  if (process.env.NODE_ENV === "development") {
    cookieOptions.secure = false;
  }

  res.cookie("jwt", token.token, cookieOptions);

  res.status(statusCode).json({
    status: "success",
    data: user,
    token,
  });
};

exports.signup = catchAsync(async (req, res, next) => {
  userInputs = { ...req.body };

  const user = await User.create(userInputs);

  createSendToken(user, 201, res);
});

exports.login = catchAsync(async (req, res, next) => {
  const userInputs = { ...req.body };
  console.log(req.body);

  const user = await User.findOne({ username: userInputs.username }).select(
    "+password"
  );

  const comparePass = await user.comparePasswords(
    userInputs.password,
    user.password
  );

  if (!comparePass) {
    return next(new Error("You entered wrong username or password!"));
  }

  createSendToken(user, 200, res);
});

exports.logout = catchAsync(async (req, res, next) => {
  res.cookie("jwt", "loggedout", {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });

  res.status(200).json({
    status: "success",
  });
});
