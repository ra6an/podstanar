const express = require("express");
const passport = require("passport");
const articleController = require("../controllers/articleController");
const reviewRoutes = require("./reviewRouter");
const bookingRoutes = require("./bookingRouter");

const router = express.Router();

router.use("/:articleId/reviews", reviewRoutes);
router.use("/:articleId/bookings", bookingRoutes);

router
  .route("/")
  .get(articleController.getAllArticles)
  .post(articleController.createArticle);

router
  .route("/:articleId")
  .all(passport.authenticate("jwt", { session: false }))
  .patch(articleController.updateArticle)
  .delete(articleController.deleteArticle);

module.exports = router;
