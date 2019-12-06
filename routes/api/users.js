const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const config = require('config');

const User = require('../../models/User');

// @route    POST    api/users
// @access   Public
// @desc     Register user
router.post(
  '/',
  [
    check('name', 'Name is required')
      .not()
      .isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check(
      'password',
      'Please enter a password with min 4 characters'
    ).isLength({ min: 4 })
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password } = req.body;

    //See if the user exists
    User.find({ email })
      .exec()
      .then(user => {
        if (user.length >= 1) {
          return res
            .status(409)
            .json({ errors: [{ msg: 'User already exists' }] });
        } else {
          // Encrypt the password
          bcrypt.hash(password, 10, (err, hash) => {
            if (err) {
              console.error(err);
              return res.status(500).json({ error: err });
            } else {
              const user = new User({
                _id: new mongoose.Types.ObjectId(),
                name: name,
                email: email,
                password: hash
              });
              user
                .save()
                .then(result => {
                  const payload = {
                    user: {
                      id: user._id
                    }
                  };

                  jwt.sign(
                    payload,
                    config.get('jwtSecret'),
                    { expiresIn: 360000 },
                    (err, token) => {
                      if (err) {
                        console.error(err);
                        return res.status(500).json({ error: err });
                      }
                      return res.json({ token });
                    }
                  );
                })
                .catch(err => {
                  console.error(err);
                  return res.status(500).json({ error: err });
                });
            }
          });
        }
      })
      .catch(err => {
        console.error(err);
        res.status(500).send('Server error');
      });
  }
);

module.exports = router;
