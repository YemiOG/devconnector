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
  async (req, res, _next) => {
    const { errors, isValid } = validatePostInput(req.body);
    // check validation
    if (!isValid) {
      res.status(400).json(errors);
    }

    const newPost = await new Post({
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

router.get("/", async (req, res, _next) => {
  await Post.find()
    .sort({ date: -1 })
    .then((posts) => res.json(posts))
    .catch((err) => res.status(404).json({ nopostsfound: "No posts found" }));
});
// @route GET api/posts/:id
// @desc  Get post by id
// @access Public

router.get("/:id ", async (req, res, _next) => {
  await Post.findById(req.params.id)
    .then((posts) => res.json(posts))
    .catch((err) =>
      res.status(404).json({ nopostfound: "No post found with that ID" })
    );
});

// @route DELETE api/posts/:id
// @desc  Delete
// @access Private
router.delete(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  async (req, res, _next) => {
    await Profile.findOne({ user: req.user.id }).then((profile) => {
      Post.findById(req.params.id)
        .then((post) => {
          //check for post owner
          if (post.user.toString() !== req.user.id) {
            return res
              .status(401)
              .json({ notauhorized: "User not authorized" });
          }
          //Delete
          post.remove().then(() => res.json({ success: true }));
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
  async (req, res, _next) => {
    await Profile.findOne({ user: req.user.id }).then((profile) => {
      Post.findById(req.params.id)
        .then((post) => {
          if (
            post.likes.filter((like) => like.user.toString() === req.user.id)
              .length > 0
          ) {
            return res
              .status(400)
              .json({ alreadyliked: "User already liked this post" });
          }

          //Add user id to likes array
          post.likes.unshift({ user: req.user.id });
          //Save
          post.save().then((post) => res.json(post));
        })
        .catch((err) =>
          res.status(404).json({ postnotfound: "No Post found" })
        );
    });
  }
);

// @route POST api/posts/unlike/:id
// @desc  Unlike post
// @access Private
router.post(
  "/unlike/:id",
  passport.authenticate("jwt", { session: false }),
  async (req, res, _next) => {
    await Profile.findOne({ user: req.user.id }).then((profile) => {
      Post.findById(req.params.id)
        .then((post) => {
          if (
            post.likes.filter((like) => like.user.toString() === req.user.id)
              .length === 0
          ) {
            return res
              .status(400)
              .json({ notliked: "You haven't liked this post" });
          }

          //Get remove index
          const removeIndex = post.likes
            .map((item) => item.user.toString())
            .indexOf(req.user.id);
          // Splice out array
          post.likes.splice(removeIndex, 1);
          //
          post.save().then((post) => res.json(post));
        })
        .catch((err) =>
          res.status(404).json({ postnotfound: "No Post found" })
        );
    });
  }
);

// @route POST api/posts/comment/:id
// @desc  Add comment to post
// @access Private

router.post(
  "/comment/:id",
  passport.authenticate("jwt", { session: false }),
  async (req, res, _next) => {
    const { errors, isValid } = validatePostInput(req.body);
    //Check Validation
    if (!isValid) {
      return res.status(400).json(errors);
    }
    await Post.findById(req.params.id)
      .then((post) => {
        const newComment = {
          text: req.body.text,
          name: req.body.name,
          avatar: req.body.avatar,
          user: req.user.id,
        };
        //Add to comments array
        post.comments.unshift(newComment);
        //Save
        post.save().then((post) => res.json(post));
      })
      .catch((err) =>
        res.status(404).json({ postnotfound: "Posts not found" })
      );
  }
);
// @route POST api/posts/comment/:id/:comment_id
// @desc  remove comment from post
// @access Private

router.delete(
  "/comment/:id/:comment_id",
  passport.authenticate("jwt", { session: false }),
  async (req, res, _next) => {
    await Post.findById(req.params.id)
      .then((post) => {
        // Check to see if comment exists
        if (
          post.comments.filter(
            (comment) => comment._id.toString() === req.params.comment._id
          ).length === 0
        ) {
          return res.status(404).json({ nocomment: "Comment doesn't exist" });
        }
        // Get remove index
        const removeIndex = post.comment
          .map((item) => item._id.toString())
          .indexOf(req.params.comment_id);

        //Splice comment out of array
        post.comments.splice(removeIndex, 1);
        post.save().then((post) => res.json(post));
      })
      .catch((err) =>
        res.status(404).json({ postnotfound: "Posts not found" })
      );
  }
);
export default router;
