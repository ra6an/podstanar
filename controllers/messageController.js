const mongoose = require("mongoose");
const Message = require("../model/messageSchema");
const User = require("../model/userSchema");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

exports.getAllMessages = catchAsync(async (req, res, next) => {
  const userId = req.params.userId;

  const user = await User.findById(userId).populate("messages");

  if (!user) {
    return next(new AppError("User not found!", 404));
  }

  const allMessages = user.messages;

  res.status(200).json({
    status: "success",
    data: allMessages,
  });
});

exports.getMessages = catchAsync(async (req, res, next) => {
  const messagesId = req.params.messagesId;

  const messages = await Message.findById(messagesId);

  if (!messages) {
    return next(new AppError("There is no messages with that ID!", 404));
  }

  let creator, recipient;
  creator = messages.messages[0].creator.toHexString();
  recipient = messages.messages[0].recipient.toHexString();

  if (
    !(creator === req.user._id.toHexString()) &&
    !(recipient === req.user._id.toHexString())
  ) {
    return next(new AppError("You are not allowed to see messages!", 404));
  }

  res.status(200).json({
    status: "success",
    data: messages,
  });
});

exports.createMessage = catchAsync(async (req, res, next) => {
  const userInputs = {};
  userInputs.text = req.body.text;
  userInputs.creator = req.user._id;
  userInputs.recipient = req.body.recipient;
  const messagesId = req.params.messagesId;

  let messages, user;
  if (messagesId === "null") {
    messages = await Message.create({ messages: userInputs });
    user = await User.findByIdAndUpdate(req.params.userId, {
      $push: { messages: messages._id },
    });
    await User.findByIdAndUpdate(req.body.recipient, {
      $push: { messages: messages._id },
    });
  }
  messages = await Message.findByIdAndUpdate(
    messagesId,
    { $push: { messages: userInputs } },
    {
      new: true,
    }
  );

  res.status(200).json({
    status: "success",
    message: "You sent message successfully",
    data: { messages, user },
  });
});

exports.haveSeenMessage = catchAsync(async (req, res, next) => {
  const messagesId = req.params.messagesId;
  const messageId = req.params.messageId;

  let message = await Message.findById(messagesId);
  message.messages.forEach((msg) => {
    msg._id.toHexString() === messageId
      ? (msg.seen = true)
      : (msg.seen = msg.seen);
  });

  await message.save();

  res.status(200).json({
    status: "success",
  });
});
