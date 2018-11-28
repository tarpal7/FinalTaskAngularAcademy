const mongoose = require('mongoose')
const Schema = mongoose.Schema

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    imageUser: {
        type: String,
        default: ''
    },
    phone: {
        type: Number,
        default: ''
    },
    date: {
        type: Date,
        default: Date.now
    },
    username:{
        type: String,
        default: 'noname'
    }
})

module.exports = mongoose.model('users', userSchema)