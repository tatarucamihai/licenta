const mongoose = require('mongoose')
const validator = require('validator')


const reviewSchema = new mongoose.Schema({
    reviewText: {
        type: String,

    },
    sentimentScore: {
        type: Number,
    }
});

const coinSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },

    reviews: [reviewSchema],

    price: {
        type: Number,
        required: true,
        trim: true
    },
    averageSentimentScore: {
        type: Number,
        default: 0
    }
    
});

const Coin = mongoose.model('Coin', coinSchema)
module.exports = Coin