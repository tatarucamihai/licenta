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

    currencyValue:{
        type: Number,
        default: 0
    },
    averageSentimentScore: {
        type: Number,
        default: 0
    },
    coinType:{
        required: true,
        type: String,
        
    }

    
});

const Coin = mongoose.model('Coin', coinSchema)
module.exports = Coin