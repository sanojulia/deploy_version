const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const addressSchema = new mongoose.Schema({
    addressLine1: {
        type: String,
        default: ""
    },
    addressLine2: {
        type: String,
        default: ""
    },
    city: {
        type: String,
        default: ""
    },
    postcode: {
        type: String,
        default: ""
    },
    country: {
        type: String,
        default: ""
    }
});

const cardSchema = new mongoose.Schema({
    cardNumber: {
        type: String,
        default: "",
        trim: true
    },
    expireMonth: {
        type: Number,
        default: null
    },
    expireYear: {
        type: Number,
        default: null
    },
    nameOnCard: {
        type: String,
        default: ""
    }
});

const userSchema = new mongoose.Schema({
    firstName: { 
        type: String,
        required: true
    },
    lastName: { 
        type: String,
        required: true
    },
    email: { type: String,
        required: true,
        unique: true
    },
    password: { 
        type: String,
        required: true
    },
    phoneNumber: {
        type: String,
        default: ""
    },
    address: {
        type: addressSchema,
        default: {}
    },
    paymentDetails: {
        type: cardSchema,
        default: {}
    }

   }, { timestamps: true });


module.exports = mongoose.model('User', userSchema);