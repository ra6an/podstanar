const express = require("express");
const passport = require("passport");
const reviewController = require("../controllers/reviewController");

const router = express.Router({ mergeParams: true });

router
  .route("/")
  .get(reviewController.getAllReviews)
  .post(
    passport.authenticate("jwt", { session: false }),
    reviewController.createReview
  );

router
  .route("/:reviewId")
  .all(passport.authenticate("jwt", { session: false }))
  .delete(reviewController.deleteReview);

module.exports = router;
