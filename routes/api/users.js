const express = require('express');
const router = express.Router();

const User = require('./../../models/User')

// @route    GET    api/users
// @access   Public
// @desc     Test route
router.get('/', (req, res) => {
    res.send("User routes")
})

module.exports = router