import { Strategy as JwtStrategy } from "passport-jwt";
import { ExtractJwt as ExtractJwt } from "passport-jwt";
import mongoose from "mongoose";
const User = mongoose.model("users");
const keys = process.env;

const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.process.env.TOKEN_SECRET = process.env.TOKEN_SECRET;

const passport = passport.use(
  new JwtStrategy(opts, (jwt_paylod, done) => {
    console.log(jwt_paylod);
  })
);

export default passport;
