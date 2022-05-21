const express = require("express");
const authController = require("../controllers/authController");
const messageRouter = require("../routes/messageRouter");

const router = express.Router();

router.use("/:userId/messages", messageRouter);

// router
//   .route("/test")
//   .get(passport.authenticate("jwt", { session: false }), (req, res) => {
//     console.log(req.user);
//     res.status(200).json({ status: "ok", message: "radi hehe" });
//   });
router.route("/signup").post(authController.signup);
router.route("/login").post(authController.login);
router.route("/logout").get(authController.logout);

module.exports = router;
