const express = require('express');
const router = express.Router();
const  { check, validationResult } = require('express-validator');
const gravatar = require('gravatar');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose')

const User = require('./../../models/User')

// @route    POST    api/users
// @access   Public
// @desc     Register user
router.post('/', [
        check('name', 'Name is required').not().isEmpty(),
        check('email', 'Please include a valid email').isEmail(),
        check('password', 'Please enter a password with min 6 characters').isLength({ min : 6 })
    ], 
     (req, res) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { name, email, password } = req.body;

        // See if the user exists
        User.find({ email: email }).exec()
            .then(user => {
                if (user.length >= 1){
                    return res.status(409).json({ errors : [{ 'msg' : 'User already exists' }]})
                }
                else{
                    // Get users gravatar
                    // const avatar = gravatar.url(email, {
                    //     s: '200',
                    //     r: 'pg',
                    //     d: 'mm'
                    // })

                    // Encrypt the password
                   bcrypt.hash(password, 10, (err, hash) => {
                       if (err){
                           console.error(err)
                           return res.status(500).json({ error: err})
                       }else{
                            const user = new User({
                                _id: new mongoose.Types.ObjectId(),
                                name: name,
                                email: email,
                                password: hash,
                            // avatar: avatar
                            })
                            user
                            .save()
                            .then((result) => {
                                console.log(result)
                                res.status(201).send('User created')
                            })
                            .catch((err) => {
                                console.error(err)
                                res.status(500).json({ error : err})
                            })
                       }
                   })
                    // Return jsonwebtoken
                    
                }
            })
            
}) 

module.exports = router