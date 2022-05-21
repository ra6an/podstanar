const catchAsync = require("../utils/catchAsync");
const Booking = require("../model/bookingSchema");

exports.getAllBookings = catchAsync(async (req, res, next) => {
  const bookings = await Booking.find();

  if (!bookings) return next(console.log("jebo ovo"));

  res.status(200).json({
    status: "success",
    length: bookings.length,
    data: bookings,
  });
});

exports.createBooking = catchAsync(async (req, res, next) => {
  const userInputs = { ...req.body };

  const booking = await Booking.create(userInputs);

  res.status(200).json({
    status: "success",
    message: "You successfully booked it!",
    data: booking,
  });
});
