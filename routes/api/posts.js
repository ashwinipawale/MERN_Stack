const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const auth = require("../../middleware/auth");

const Post = require("../../models/Post");
const User = require("../../models/User");

// @route    POST    api/posts
// @access   Private
// @desc     Create a post
router.post(
  "/",
  [
    auth,
    [
      check("text", "Text is required")
        .not()
        .isEmpty()
    ]
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).send({ errors: errors.array() });
    }
    User.findById(req.user.id)
      .select("-password")
      .then(user => {
        const newPost = {
          text: req.body.text,
          name: req.body.name,
          user: req.user.id,
          avatar: user.avatar
        };
        const post = new Post(newPost);
        post
          .save()
          .then(post => {
            return res.json(post);
          })
          .catch(err => {
            return res.status(500).send("Server error");
          });
      })
      .catch(err => {
        res.status(500).send(err.message);
      });
  }
);

// @route    GET    api/posts
// @access   Private
// @desc     Get all posts
router.get("/", auth, (req, res) => {
  Post.find()
    .sort({ date: -1 })
    .then(posts => {
      res.json(posts);
    })
    .catch(err => {
      res.status(500).send(err.message);
    });
});

// @route    GET    api/posts/:id
// @access   Private
// @desc     Get post by id
router.get("/:id", auth, (req, res) => {
  Post.findById(req.params.id)
    .then(post => {
      if (post) {
        return res.json(post);
      } else {
        return res.status(404).json({ msg: "Post not found" });
      }
    })
    .catch(err => {
      res.status(500).send(err.message);
    });
});

// @route    DELETE    api/posts/:id
// @access   Private
// @desc     Delete a post
router.delete("/:id", auth, (req, res) => {
  Post.findById(req.params.id)
    .then(post => {
      if (post) {
        //Check the user
        if (post.user.toString() !== req.user.id) {
          return res.status(401).json({ msg: "User not authorized" });
        } else {
          post
            .remove()
            .then(post => {
              return res.json({ msg: "Post removed" });
            })
            .catch(err => {
              res.status(500).send(err.message);
            });
        }
      } else {
        return res.status(404).json({ msg: "Post not found" });
      }
    })
    .catch(err => {
      res.status(500).send(err.message);
    });
});

// @route    PUT    api/posts/like/:id
// @access   Private
// @desc     Like a post
router.put("/like/:id", auth, (req, res) => {
  Post.findById(req.params.id)
    .then(post => {
      if (post) {
        //Check if the post has already been liked
        if (
          post.likes.filter(like => like.user.toString() == req.user.id)
            .length > 0
        ) {
          return res.status(400).json({ msg: "Post already liked" });
        } else {
          post.likes.unshift({ user: req.user.id });
          post
            .save()
            .then(post => {
              return res.json(post.likes);
            })
            .catch(err => {
              res.status(500).send(err.message);
            });
        }
      } else {
        return res.status(404).json({ msg: "Post not found" });
      }
    })
    .catch(err => {
      res.status(500).send(err.message);
    });
});

// @route    DELETE    api/posts/unlike/:id
// @access   Private
// @desc     Unlike a post
router.delete("/unlike/:id", auth, (req, res) => {
  Post.findById(req.params.id)
    .then(post => {
      if (post) {
        //Check if the post has already been liked
        if (
          post.likes.filter(like => like.user.toString() == req.user.id)
            .length == 0
        ) {
          return res.status(400).json({ msg: "Post has not yet been liked" });
        } else {
          //Get the remove index
          const removeIndex = post.likes
            .map(like => like.user.toString())
            .indexOf(req.user.id);

          post.likes.splice(removeIndex, 1);
          post
            .save()
            .then(post => {
              return res.json(post.likes);
            })
            .catch(err => {
              res.status(500).send(err.message);
            });
        }
      } else {
        return res.status(404).json({ msg: "Post not found" });
      }
    })
    .catch(err => {
      res.status(500).send(err.message);
    });
});

// @route    POST    api/posts/comment/:post_id
// @access   Private
// @desc     Comment on a post
router.post(
  "/comment/:post_id",
  [
    auth,
    [
      check("text", "Text is required")
        .not()
        .isEmpty()
    ]
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    User.findById(req.user.id)
      .select("-password")
      .then(user => {
        if (user) {
          Post.findById(req.params.post_id)
            .then(post => {
              if (post) {
                const newComment = {
                  text: req.body.text,
                  name: user.name,
                  user: user.id,
                  avatar: user.avatar
                };

                post.comments.unshift(newComment);
                post
                  .save()
                  .then(post => {
                    return res.json(post.comments);
                  })
                  .catch(err => {
                    res.status(500).send(err.message);
                  });
              } else {
                return res.status(404).json({ msg: "Post not found" });
              }
            })
            .catch(err => {
              return res.status(500).send(err.message);
            });
        } else {
          return res.status(404).json({ msg: "User not found" });
        }
      })
      .catch(err => {
        res.status(500).send(err.message);
      });
  }
);

// @route    DELETE    api/posts/comment/:post_id/:comment_id
// @access   Private
// @desc     Delete a comment
router.delete("/comment/:post_id/:comment_id", auth, (req, res) => {
  Post.findById(req.params.post_id)
    .then(post => {
      if (post) {
        // Pull out comment
        const comment = post.comments.find(
          comment => comment.id === req.params.comment_id
        );

        // Make sure comment exists
        if (!comment) {
          return res.status(404).json({ msg: "Comment does not exist" });
        }

        //Check User
        else {
          if (comment.user.toString() !== req.user.id) {
            return res.status(401).json({ msg: "User not authorized" });
          } else {
            // Get remove index
            const removeIndex = post.comments
              .map(comment => comment.user.toString())
              .indexOf(req.user.comment_id);
            post.comments.splice(removeIndex);
            post
              .save()
              .then(post => {
                return res.json(post.comments);
              })
              .catch(err => {
                return res.status(500).send(err.message);
              });
          }
        }
      } else {
        return res.status(404).json({ msg: "Post not found" });
      }
    })
    .catch(err => {
      res.status(500).send(err.message);
    });
});

module.exports = router;
