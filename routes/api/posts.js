const express = require('express');
const router = express.Router();

// @route    GET    api/posts
// @access   Public
// @desc     Test route
router.get('/', (req, res) => {
    res.send("Posts routes")
})

module.exports = router