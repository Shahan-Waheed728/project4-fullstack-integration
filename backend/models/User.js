const mongoose = require('mongoose')
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required!'],
        trim: true,
        length: [3, 'Name must be atleast 3 characters!']
    },
    email:{
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        trim: true,
        lowercase: true,
        match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Please provide a valid email!']
    },
    city:{
        type: String,
        required: [true, 'City is required!'],
        trim: true
    },
    createdAt:{
        type: Date,
        default: Date.now
    }
})
module.exports = mongoose.model('User',userSchema)