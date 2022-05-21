const express = require("express");
const bookingController = require("../controllers/bookingController");
const { post } = require("./userRouter");

const router = express.Router();

router
  .route("/")
  .get(bookingController.getAllBookings)
  .post(bookingController.createBooking);

module.exports = router;
