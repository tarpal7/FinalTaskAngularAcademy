const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const User = require('../models/User')
const keys = require('../config/keys')
const errorHandler = require('../utils/errorHandler')

module.exports.login = async function(req, res) {
    const candidate = await User.findOne({email: req.body.email})

    if (candidate) {
        // Password check, user exists
        const passwordResult = bcrypt.compareSync(req.body.password, candidate.password)
        if (passwordResult) {
            // Token generation, passwords matched
            const token = jwt.sign({
                email: candidate.email,
                userId: candidate._id
            }, keys.jwt, {expiresIn: 60 * 60})

            const username = candidate.username
            res.status(200).json({
                token: `Bearer ${token}`,
                name: username
            })
        } else {
            // Passwords do not match
            res.status(401).json({
                message: 'Passwords do not match. Try again.'
            })
        }
    } else {
        // No user, error
        res.status(404).json({
            message: 'User with this email was not found.'
        })
    }
}

module.exports.register = async function(req, res){
    // email password
    const candidate = await User.findOne({email: req.body.email})

    if (candidate) {
        // user exists
        res.status(409).json({
            message: 'This email is already taken. Try another.'
        })
    } else {
        // Need to create a user
        const salt = bcrypt.genSaltSync(10)
        const password = req.body.password
        const user = new User({
            email: req.body.email,
            password: bcrypt.hashSync(password, salt),
            username: req.body.username,
            imageUser: req.file ? req.file.path : ''
        })

        try {
            await user.save()
            res.status(201).json(user)
        } catch(e) {
            errorHandler(res, e)
        }
    }
}