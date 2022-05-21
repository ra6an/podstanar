const User = require("../model/userSchema");
const catchAsync = require("../utils/catchAsync");
const Article = require("../model/articleSchema");
const APIFeatures = require("../utils/apiFeatures");
const AppError = require("../utils/appError");

exports.getAllArticles = catchAsync(async (req, res, next) => {
  console.log(req.query);
  const features = new APIFeatures(Article.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .pagginate();

  const articles = await features.query;

  res.status(200).json({
    status: "success",
    length: articles.length,
    data: articles,
  });
});

exports.createArticle = catchAsync(async (req, res, next) => {
  const userId = req.user._id;
  const userInputs = { ...req.body };

  const article = await Article.create(userInputs);

  if (!article) {
    return next(new Error("Something went wrong uh oh uh oh!!!"));
  }

  await User.findByIdAndUpdate(userId, { $push: { articles: article._id } });

  res.status(200).json({
    status: "success",
    message: "You successfully created a new article.",
    data: article,
  });
});

exports.updateArticle = catchAsync(async (req, res, next) => {
  const articleId = req.params.articleId;
  const userId = req.user._id;
  const userInputs = req.body;

  let article = await Article.findById(articleId);

  if (!article) {
    return next(new AppError("There is no article with that ID!", 404));
  }

  const isOwner = article.owner.toHexString() === userId;

  if (
    (!isOwner && req.user.role === "admin") ||
    (!isOwner && req.user.role === "moderator")
  ) {
    return next(
      new AppError("You are not allowed to update this article.", 401)
    );
  }

  article = await Article.findByIdAndUpdate(articleId, userInputs, {
    new: true,
  });

  res.status(200).json({
    status: "success",
    message: "You update your article successfully!",
    data: article,
  });
});

exports.deleteArticle = catchAsync(async (req, res, next) => {
  const userId = req.user.user._id;
  const articleId = req.params.articleId;

  const article = await Article.findById(articleId);

  if (!article) {
    return next(new AppError("There is no article with that ID!", 404));
  }

  const isCreator = userId === article.creator.toHexString();

  if (
    (!isCreator && req.user.role !== "admin") ||
    (!isCreator && req.user.role !== "moderator")
  ) {
    return next(
      new AppError("You are not allowed to delete this article!", 401)
    );
  }

  await Article.findByIdAndDelete(articleId);
  await User.findByIdAndUpdate(userId, { $pull: { articles: articleId } });

  res.status(200).json({
    status: "success",
    message: "You deleted article successfully!",
  });
});
