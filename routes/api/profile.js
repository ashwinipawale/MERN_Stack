const express = require('express');
const router = express.Router();

// @route    GET    api/profile
// @access   Public
// @desc     Test route
router.get('/', (req, res) => {
    res.send("Profile routes")
})

module.exports = router