const catchAsync = require("../utils/catchAsync");
const Review = require("../model/reviewSchema");
const AppError = require("../utils/appError");
const APIFeatures = require("../utils/apiFeatures");
const User = require("../model/userSchema");
const Article = require("../model/articleSchema");

exports.getAllReviews = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(Review.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .pagginate();
  const reviews = await features.query;

  if (!reviews) {
    return next(new AppError(`No reviews found!`, 404));
  }
  res.status(200).json({
    status: "success",
    length: reviews.length,
    data: reviews,
  });
});

exports.createReview = catchAsync(async (req, res, next) => {
  const articleId = req.params.articleId;
  const userInputs = { ...req.body };
  userInputs.creator = req.user._id;

  const review = await Review.create(userInputs);

  if (!review) {
    return next(
      new AppError(
        `Something went wrong with creating review, Please try again later!`,
        404
      )
    );
  }

  await User.findByIdAndUpdate(req.user._id, {
    $push: { reviews: review._id },
  });
  await Article.findByIdAndUpdate(articleId, {
    $push: { reviews: review._id },
  });

  res.status(200).json({
    status: "success",
    message: "You have successfully left a review.",
    data: review,
  });
});

exports.deleteReview = catchAsync(async (req, res, next) => {
  const articleId = req.params.articleId;
  const reviewId = req.params.reviewId;
  const userId = req.user._id.toHexString();

  const review = await Review.findById(reviewId);
  if (!review) {
    return next(new AppError("There is no review with that ID!", 404));
  }

  console.log(review);

  const isCreator = review.creator.toHexString() === userId;

  if (
    (!isCreator && req.user.role !== "admin") ||
    (!isCreator && req.user.role !== "moderator")
  ) {
    return next(new AppError("You are not allowed to delete this post!", 401));
  }

  await Review.findByIdAndDelete(reviewId);
  await User.findByIdAndUpdate(review.creator, {
    $pull: { reviews: reviewId },
  });
  await Article.findByIdAndUpdate(articleId, { $pull: { reviews: reviewId } });

  res.status(200).json({
    status: "success",
    message: "You deleted review successfully!",
  });
});
