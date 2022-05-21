const JWTStrategy = require("passport-jwt").Strategy;
const ExtractJWT = require("passport-jwt").ExtractJwt;
const User = require("../model/userSchema");

console.log(process.env.JWT_SECRET_KEY);

let options = {};
options.jwtFromRequest = ExtractJWT.fromAuthHeaderAsBearerToken();
options.secretOrKey = process.env.JWT_SECRET_KEY;

const strategy = new JWTStrategy(options, (payload, done) => {
  User.findById(payload.id)
    .then((user) => {
      if (user) {
        return done(null, user);
      } else {
        return done(null, false);
      }
    })
    .catch((err) => done(err, false));
});

module.exports = (passport) => {
  passport.use(strategy);
};
