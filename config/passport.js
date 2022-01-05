import { Strategy as JwtStrategy } from "passport-jwt";
import { ExtractJwt as ExtractJwt } from "passport-jwt";
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
const User = mongoose.model("users");

const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: `${process.env.TOKEN_SECRET}`,
};
const passportConfig = (passport) => {
  passport.use(
    new JwtStrategy(jwtOptions, (jwt_payload, done) => {
      User.findById(jwt_payload.id)
        .then((user) => {
          if (user) {
            return done(null, user);
          }
          return done(null, false);
        })
        .catch((err) => console.log(err));
    })
  );
};

export default passportConfig;
