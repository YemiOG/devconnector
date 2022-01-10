import express from "express";
import passport from "passport";

// load Profile Model
import Profile from "../../models/Profile.js";

//load user profile
import User from "../../models/User.js";

//load validation
import validateProfileInput from "../../validation/profile.js";
import validateExperienceInput from "../../validation/experience.js";
import validateEducationInput from "../../validation/education.js";

const router = express.Router();
//tests profile route - Public
router.get("/test", (req, res, _next) => res.json({ msg: "Profile Works" }));

// @route GET api/profile
// @desc Get current users profile
// @access Private
router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res, _next) => {
    const errors = {};
    Profile.findOne({ user: req.user._id })
      .then((profile) => {
        if (!profile) {
          errors.noprofile = "There is no profile for this User";
          return res.status(404).json(errors);
        }
        res.json(profile);
      })
      .catch((err) => res.status(404).json(err));
  }
);

// @route GET api/profile/all
// @desc get all profiles
// @access Public
router.get("/all", (req, res, _next) => {
  const errors = {};

  Profile.find({ handle: req.params.handle })
    .populate("user", ["name", "avatar"])
    .then((profiles) => {
      if (!profiles) {
        errors.noprofile = "There are no profiles";
        res.status(404).json(errors);
      }
      res.json(profiles);
    })
    .catch((err) => res.status(404).json({ profile: "There are no profiles" }));
});

// @route GET api/profile/handle/:handle
// @desc get profile by handle
// @access Public
router.get("/handle/:handle", (req, res, _next) => {
  const errors = {};

  Profile.findOne({ handle: req.params.handle })
    .populate("user", ["name", "avatar"])
    .then((profile) => {
      if (!profile) {
        errors.noprofile = "There is no profile for this user";
        res.status(404).json(errors);
      }
      res.json(profile);
    })
    .catch((err) => res.status(400).json(err));
});

// @route GET api/profile/user/:user_id
// @desc get profile by user ID
// @access Public
router.get("/user/:user_id", (req, res, _next) => {
  const errors = {};

  Profile.findOne({ handle: req.params.user._id })
    .populate("user", ["name", "avatar"])
    .then((profile) => {
      if (!profile) {
        errors.noprofile = "There is no profile for this user";
        res.status(404).json(errors);
      }
      res.json(profile);
    })
    .catch((err) =>
      res.status(400).json({ msg: "There is no profile for this user" })
    );
});

router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res, _next) => {
    const { errors, isValid } = validateProfileInput(req.body);

    //check validation
    if (!isValid) {
      return res.status(400).json(errors);
    }

    //get fields
    const profileFields = {};
    profileFields.user = req.user._id;
    if (req.body.handle) profileFields.handle = req.body.handle;
    if (req.body.company) profileFields.company = req.body.company;
    if (req.body.location) profileFields.location = req.body.location;
    if (req.body.status) profileFields.status = req.body.status;
    if (req.body.website) profileFields.website = req.body.website;
    //skills - split into array
    if (typeof req.body.skills !== "undefined")
      profileFields.skills = req.body.skills.split(",");
    if (req.body.bio) profileFields.bio = req.body.bio;
    if (req.body.githubusername)
      profileFields.githubusername = req.body.githubusername;

    //social
    profileFields.social = {};
    if (req.body.youtube) profileFields.youtube = req.body.youtube;
    if (req.body.twitter) profileFields.twitter = req.body.twitter;
    if (req.body.facebook) profileFields.facebook = req.body.facebook;
    if (req.body.instagram) profileFields.instagram = req.body.instagram;
    if (req.body.linkedin) profileFields.linkedin = req.body.linkedin;

    Profile.findOne({ user: req.user._id }).then((profile) => {
      console.log({ user: req.user });
      //update profile
      if (profile) {
        Profile.findByIdAndUpdate(
          { user: req.user._id },
          { $set: profileFields },
          { new: true }
        ).then((profile) => res.json(profile));
      } else {
        // create profile

        // check if handle exists
        Profile.findOne({ handle: profileFields.handle })
          .populate("user", ["name", "avatar"])
          .then((profile) => {
            if (profile) {
              errors.handle = "The handle already exists";
              res.status(400).json(errors);
            }
            // save profile
            new Profile(profileFields)
              .save()
              .then((profile) => res.json(profile));
          });
      }
    });
  }
);
// @route POST api/profile/experience
// @desc add experience to profile
// @access Private

router.post(
  "/experience",
  passport.authenticate("jwt", { session: false }),
  (req, res, _next) => {
    const { errors, isValid } = validateExperienceInput(req.body);

    // check validation
    if (!isValid) {
      //return errror
      res.status(400).json(errors);
    }

    Profile.findOne({ user: req.user._id }).then((profile) => {
      //new experience
      const newExp = {
        title: req.body.title,
        company: req.body.company,
        location: req.body.location,
        from: req.body.from,
        to: req.body.to,
        current: req.body.current,
        description: req.body.description,
      };

      // add to experience array
      profile.experience.unshift(newExp);
      profile.save().then((profile) => res.json(profile));
    });
  }
);

// @route POST api/profile/education
// @desc add experience to profile
// @access Private

router.post(
  "/education",
  passport.authenticate("jwt", { session: false }),
  (req, res, _next) => {
    const { errors, isValid } = validateEducationInput(req.body);
    if (!isValid) {
      //return errror
      res.status(400).json(errors);
    }

    Profile.findOne({ user: req.user._id }).then((profile) => {
      //new experience
      const newEdu = {
        school: req.body.school,
        degree: req.body.degree,
        fieldofstudy: req.body.fieldofstudy,
        from: req.body.from,
        to: req.body.to,
        current: req.body.current,
        description: req.body.description,
      };

      // add to experience array
      profile.education.unshift(newEdu);
      profile.save().then((profile) => res.json(profile));
    });
  }
);

export default router;
