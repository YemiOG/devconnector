import express from "express";
import User from "../../models/User.js";
import gravatar from "gravatar";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const router = express.Router();

//tests users route - Public
router.get("/test", (req, res) => res.json({ msg: "Users Works" }));

// register users
router.post("/register", async (req, res) => {
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
  const newUser = new User({
    name: req.body.name,
    email: req.body.email,
    avatar: avatar,
    password: hashedPassword,
  });
});

//log in user/ jwt token

router.post("/login", async (req, res) => {
  try {
    const payload = { id: user.id, name: user.name, avatar: user.avatar };

    const token = jwt.sign(payload, process.env.TOKEN_SECRET, {
      expiresIn: 3600,
    });
    res.header("auth-token", token).send(token);

    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(404).json({ email: "User not found" });
    console.log(req.body.password, user.password);
    console.log(req.body);

    const validPass = await bcrypt.compare(req.body.password, user.password);
    if (!validPass) return res.status(400).send("Email or Password in Invalid");
  } catch (error) {
    return res.status(400).json({ msg: "No access" });
  }
});

export default router;
