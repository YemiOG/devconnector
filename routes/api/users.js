import express from "express";
// load User model
import User from "../../models/User.js";
import gravatar from "gravatar";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import passport from "passport";

const router = express.Router();

//tests users route - Public
router.get("/test", (req, res) => res.json({ msg: "Users Works" }));

// @desc register new user
// @route GET api/users/register
// @access Public
router.post("/register", async (req, res) => {
  try {
    const emailExist = await User.findOne({ email: req.body.email });

    if (emailExist) {
      return res.status(400).json({ email: "Email already exixts" });
    }
    const avatar = gravatar.url(req.body.email, {
      s: "200",
      r: "pg",
      d: "404",
    });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    const newUser = await User.create({
      name: req.body.name,
      email: req.body.email,
      avatar: avatar,
      password: hashedPassword,
    });
    console.log("It went");
  } catch (error) {
    return res.status(400).json({ msg: "No Acess" });
  }
  return res.status(200).json({ msg: "User created Successfully!" });
});

// @desc log in user / returning jwt token
// @route: GET api/users/login
// @access Public

router.post("/login", async (req, res, next) => {
  // Find user by email
  const user = await User.findOne({ email: req.body.email });
  // check for user
  if (!user) return res.status(404).json({ email: "User not found" });
  console.log(req.body.password, user.password);
  console.log(req.body);
  // check password
  const validPass = await bcrypt.compare(req.body.password, user.password);
  if (!validPass) return res.status(400).send("Email or Password in Invalid");

  const payload = { id: user._id }; // creating JWT payload
  // sign token
  const token = jwt.sign(payload, `${process.env.TOKEN_SECRET}`, {
    expiresIn: 3600,
  });

  return res.status(200).json({ msg: "Log in Successfully", token });
});

// @desc   return current user
// @route  GET api/users/currnt
// @access Private

router.get(
  "/current",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    res.json({ msg: "Success" });
  }
);

export default router;
