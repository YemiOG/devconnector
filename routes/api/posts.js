import express from "express";
import Post from "../../models/Post.js";
import mongoose from "module";
import passport from "passport";

// Import post validator
import validatePostInput from "../../validation/post.js";

//Import Profile
import Profile from "../../models/Profile.js";

const router = express.Router();
//tests posts route - Public
router.get("/test", (req, res, _next) => res.json({ msg: "Posts Works" }));

// @route POST api/posts
// @desc  Create new posts
// @access Private

router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res, _next) => {
    const { errors, isValid } = validatePostInput(req.body);
    // check validation
    if (!isValid) {
      res.status(400).json(errors);
    }

    const newPost = new Post({
      text: req.body.text,
      name: req.body.name,
      avatar: req.body.avatar,
      user: req.user.id,
    });

    newPost.save().then((post) => res.json(post));
  }
);

// @route GET api/posts
// @desc  Get posts
// @access Public

router.get("/", (req, res, _next) => {
  Post.find()
    .sort({ date: -1 })
    .then((posts) => res.json(posts))
    .catch((err) => res.status(404))
    .json({ nopostsfound: "No posts available" });
});
// @route GET api/posts/:id
// @desc  Get post by id
// @access Public

router.get("/:id ", (req, res, _next) => {
  Post.findById(req.params.id)
    .then((posts) => res.json(posts))
    .catch((err) => res.status(404))
    .json({ nopostfound: "No post found with that ID" });
});

// @route DELETE api/posts/:id
// @desc  Delete
// @access Private
router.delete(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res, _next) => {
    Profile.findOne({ user: req.user.id }).then((profile) => {
      Post.findById(req.params.id)
        .then((post) => {
          //check for post owner
          if (post.user.toString() !== req.user.id) {
            return res
              .status(401)
              .json({ notauhorized: "User not authorized" });
          }
          //Delete
          post.remove().then(() => res.json({ sucess: true }));
        })
        .catch((err) =>
          res.status(404).json({ postnotfound: "No post found" })
        );
    });
  }
);

// @route POST api/posts/like/:id
// @desc  Like post
// @access Private
router.post(
  "/like/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res, _next) => {
    Profile.findOne({ user: req.user.id }).then((profile) => {
      Post.findById(req.params.id)
        .then((post) => {
          if (
            post.likes.filter((like) => like.user.toString() === req.user.id)
              .length > 0
          ) {
            return res
              .status(400)
              .json({ alreadyliked: "User already like this post" });
          }

          //Add user id to likes array
          post.likes.unshift({ user: req.user.id });
          post.save().then();
        })
        .catch((err) =>
          res.status(404).json({ postnotfound: "No Post found" })
        );
    });
  }
);

export default router;
