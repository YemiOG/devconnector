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
      console.log(jwt_payload);
    })
  );
};

export default passportConfig;
