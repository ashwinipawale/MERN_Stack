const express = require('express');
const router = express.Router();

// @route    GET    api/auth
// @access   Public
// @desc     Test route
router.get('/', (req, res) => {
    res.send("Auth routes")
})

module.exports = router