const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const { check, validationResult } = require("express-validator");
const request = require("request-promise");
const config = require("config");

const Profile = require("../../models/Profile");
const User = require("../../models/User");

// @route    GET    api/profile/me
// @access   Private
// @desc     Get current user's profile
router.get("/me", auth, (req, res) => {
  Profile.findOne({ user: req.user.id })
    .then(profile => {
      if (profile) {
        return res.json(profile);
      }
      //   console.log(profile);
      //   return res.status(400).json({ msg: 'There is no profile for the user' });
    })
    .catch(err => res.status(500).send("Server error"));
});

// @route    GET    api/profile
// @access   Public
// @desc     Get all profiles
router.get("/", (req, res) => {
  Profile.find()
    .populate("user", ["name", "email"])
    .then(profiles => {
      if (profiles) {
        return res.json(profiles);
      }
      return res.status(400).json({ msg: "No profiles found" });
    })
    .catch(err => res.status(500).send("Server error"));
});

// @route    GET    api/profile/user/:userid
// @access   Public
// @desc     Get profile by user ID
router.get("/user/:userid", auth, (req, res) => {
  console.log(req.param.id);
  Profile.findOne({ user: req.params.id })
    .populate("user", ["name", "email"])
    .then(profile => {
      if (profile) {
        return res.json(profile);
      } else {
        return res.status(400).json({ msg: "Profile not found" });
      }
    })
    .catch(err => {
      if (err.kind == "ObjectId") {
        return res.status(400).json({ msg: "Profile not found." });
      }
      res.status(500).send("Server error");
    });
});

// @route    POST    api/profile
// @access   Private
// @desc     Create/Update user profile
router.post(
  "/",
  [
    auth,
    [
      check("status", "Status is required")
        .not()
        .isEmpty(),
      check("skills", "Skills is required")
        .not()
        .isEmpty()
    ]
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      company,
      location,
      status,
      website,
      bio,
      githubusername,
      skills,
      youtube,
      facebook,
      linkedin,
      instagram,
      twitter
    } = req.body;

    // Build ProfileFields object
    const profileFields = {};
    profileFields.user = req.user.id;

    if (company) profileFields.company = company;
    if (website) profileFields.website = website;
    if (location) profileFields.location = location;
    if (bio) profileFields.bio = bio;
    if (githubusername) profileFields.githubusername = githubusername;
    if (status) profileFields.status = status;

    if (skills) {
      profileFields.skills = skills.split(",").map(skill => skill.trim());
    }

    // Build profileFields social object
    profileFields.social = {};
    if (youtube) profileFields.social.youtube = youtube;
    if (facebook) profileFields.social.facebook = facebook;
    if (twitter) profileFields.social.twitter = twitter;
    if (instagram) profileFields.social.instagram = instagram;
    if (linkedin) profileFields.social.linkedin = linkedin;

    Profile.findOne({ user: req.user.id })
      .then(profile => {
        // Update existing Profile
        if (profile) {
          Profile.findOneAndUpdate(
            { user: req.user.id },
            { $set: profileFields },
            { new: true }
          )
            .then(profile => {
              return res.json(profile);
            })
            .catch(err => {
              return res.status(500).json({ error: err });
            });
        }
        // Create new Profile
        else {
          profile = new Profile(profileFields);
          profile
            .save()
            .then(profile => {
              return res.json(profile);
            })
            .catch(err => {
              return res.status(500).json({ error: err });
            });
        }
      })
      .catch(err => {
        res.status(500).json({ error: err });
      });
  }
);

// @route    DELETE    api/profile
// @access   Private
// @desc     Delete profiles,users & posts
router.delete("/", auth, (req, res) => {
  // Remove users posts
  Profile.deleteMany({ user: req.user.id });
  // Remove Profile
  Profile.findOneAndRemove({ user: req.user.id })
    .then(_ => {
      // Remove user
      User.findOneAndRemove({ _id: req.user.id })
        .then(_ => {
          return res.json({ msg: "User deleted" });
        })
        .catch(err => res.status(500).send("Server error"));
    })
    .catch(err => res.status(500).send("Server error"));
});

// @route    PUT    api/profile/experience
// @access   Private
// @desc     Add Profile Experience
router.put(
  "/experience",
  [
    auth,
    [
      check("title", "Title is required")
        .not()
        .isEmpty(),
      check("company", "Company is required")
        .not()
        .isEmpty(),
      check("location", "Location is required")
        .not()
        .isEmpty(),
      check("from", "From Date is required")
        .not()
        .isEmpty(),
      check("current", "current  is required")
        .not()
        .isEmpty()
    ]
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(500).send("Server error");
    }

    const {
      title,
      company,
      location,
      from,
      current,
      description,
      to
    } = req.body;

    const newExperience = {
      title,
      company,
      location,
      current,
      from,
      description,
      to
    };

    Profile.findOne({ user: req.user.id })
      .then(profile => {
        profile.experience.unshift(newExperience);
        profile
          .save()
          .then(profile => {
            return res.json(profile);
          })
          .catch(err => {
            return res.status(500).send(err);
          });
      })
      .catch(err => {
        res.status(500).send("Server error");
      });
  }
);

// @route    DELETE    api/profile/experience/:exp_id
// @access   Private
// @desc     Delete experience from profile
router.delete("/experience/:exp_id", auth, (req, res) => {
  Profile.findOne({ user: req.user.id })
    .then(profile => {
      //Get removeIndex
      const removeIndex = profile.experience
        .map(item => item.id)
        .indexOf(req.params.exp_id);

      profile.experience.splice(removeIndex, 1);

      profile
        .save()
        .then(profile => {
          return res.json(profile);
        })
        .catch(err => {
          return res.status(500).send(err);
        });
    })
    .catch(err => res.status(500).send("Server error"));
});

// @route    PUT    api/profile/education
// @access   Private
// @desc     Add Profile Education
router.put(
  "/education",
  [
    auth,
    [
      check("school", "School is required")
        .not()
        .isEmpty(),
      check("degree", "Degree is required")
        .not()
        .isEmpty(),
      check("fieldofstudy", "Field of Study is required")
        .not()
        .isEmpty(),
      check("from", "From Date is required")
        .not()
        .isEmpty()
    ]
  ],
  (req, res) => {
    const errors = validationResult(req);
    console.log(errors);
    if (!errors.isEmpty()) {
      return res.status(500).send("Server error");
    }

    const {
      school,
      degree,
      fieldofstudy,
      from,
      current,
      description,
      to
    } = req.body;

    const newEducation = {
      school,
      degree,
      fieldofstudy,
      from,
      current,
      description,
      to
    };

    Profile.findOne({ user: req.user.id })
      .then(profile => {
        profile.education.unshift(newEducation);
        profile
          .save()
          .then(profile => {
            return res.json(profile);
          })
          .catch(err => {
            return res.status(500).send(err);
          });
      })
      .catch(err => {
        res.status(500).send("Server error");
      });
  }
);

// @route    DELETE    api/profile/education/:edu_id
// @access   Private
// @desc     Delete education from profile
router.delete("/education/:edu_id", auth, (req, res) => {
  Profile.findOne({ user: req.user.id })
    .then(profile => {
      //Get removeIndex
      const removeIndex = profile.education
        .map(item => item.id)
        .indexOf(req.params.edu_id);

      profile.education.splice(removeIndex, 1);

      profile
        .save()
        .then(profile => {
          return res.json(profile);
        })
        .catch(err => {
          return res.status(500).send(err);
        });
    })
    .catch(err => res.status(500).send("Server error"));
});

// @route    GET    api/profile/github/:username
// @access   Public
// @desc     Get user repos from github
router.get("/github/:username", (req, res) => {
  const options = {
    uri: `https://api.github.com/users/${
      req.params.username
    }/repos?per_page=5&sort=created:asc&client_id=${config.get(
      "githubclientID"
    )}&client_secret=${config.get("githubclientsecret")}`,
    method: "GET",
    headers: { "user-agent": "node.js" }
  };
  request(options)
    .then(body => {
      return res.json(JSON.parse(body));
    })
    .catch(err => {
      return res.status(500).send(err);
    });
});

module.exports = router;
