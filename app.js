const express = require("express");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const passport = require("passport");
const passportConfig = require("./utils/passport");

const userRoutes = require("./routes/userRouter");
const articleRoutes = require("./routes/articleRouter");
// const reviewRoutes = require("./routes/reviewRouter");
// const bookingRoutes = require("./routes/bookingRouter");
// const messageRoutes = require("./routes/messageRouter");

const app = express();

// app.use(function (req, res, next) {
//   res.setHeader("Content-Type", "application/json;charset=UTF-8");
//   res.setHeader("Access-Control-Allow-Credentials", true);
//   res.setHeader("Access-Control-Allow-Origin", "*");
//   res.setHeader(
//     "Access-Control-Allow-Headers",
//     "Origin, X-Requested-With, Content-Type, Accept, Authorization"
//   );
//   res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE");
//   next();
// });

app.use(cors());

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

passportConfig(passport);
app.use(passport.initialize());

app.use(express.json());
app.use(express.urlencoded({ extended: true, limit: "10kb" }));
app.use(cookieParser());

// MAIN ROUTES
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/articles", articleRoutes);
// app.use("/api/v1/reviews", reviewRoutes);
// app.use("/api/v1/bookings", bookingRoutes);
// app.use("/api/v1/messages", messageRoutes);
// app.use(globalErrorHandler);

module.exports = app;
