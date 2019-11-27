const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const { check, validationResult } = require('express-validator');
const config = require('config');
const jwt = require('jsonwebtoken');

const auth = require('../../middleware/auth');
const User = require('../../models/User');

// @route    GET    api/auth
// @access   Public
// @desc     Get user info by authenticating token in request
router.get('/', auth, (req, res) => {
  User.findById(req.user.id)
    .select('-password')
    .then(user => res.json(user))
    .catch(err => res.status(500).send('Server error'));
});

// @route    POST    api/auth
// @access   Public
// @desc     Authenticate user & get token
router.post(
  '/',
  [
    check('email', 'Please enter a valid email').isEmail(),
    check('password', 'Password is required').exists()
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    //See if the user is valid
    User.findOne({ email })
      .exec()
      .then(user => {
        if (user) {
          bcrypt.compare(password, user.password, (err, isMatch) => {
            if (!isMatch) {
              return res
                .status(500)
                .json({ errors: [{ msg: 'Invalid credentials' }] });
            } else {
              const payload = {
                user: {
                  id: user.id
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
            }
          });
        } else {
          return res
            .status(500)
            .json({ errors: [{ msg: 'Invalid credentials' }] });
        }
      })
      .catch(err => {
        console.error(err);
        res.status(500).send('Server error');
      });
  }
);
module.exports = router;
