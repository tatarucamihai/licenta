const Coin = require('../models/coin')
const express = require('express')
const router = new express.Router()

router.post('/coins/create', async (req, res) => {
    const coin = new Coin({
        name: req.body.name,
        price: req.body.price,
        reviews: req.body.reviews
    })
    try {
        await coin.save()
        console.log(coin)
        res.send({ coin })
    }
    catch (e) {
        res.status(400).send(e)
        console.log(e)
    }
})

router.get('/coins/:id', async (req, res) => {
    try {
        const coin = await Coin.findById(req.params.id)
        if (!coin) {
            return res.send('Coin not found')
        }

        res.send(coin)
    }
    catch (e) {
        res.send(e)
    }
})

router.post('/coins/:id/reviews/sentiment', async (req, res) => {
    try {
        const coin = await Coin.findById(req.params.id)
        if (!coin) {
            return res.status(404).send('Coin not found')
        }
        const { review, sentimentScore } = req.body
        if (!review) {
            return res.status(400).send('No review was submitted')
        }
        if (sentimentScore === undefined) {
            return res.status(400).send('No sentiment score was submitted')
        }
        
        coin.reviews.push({ reviewText: review, sentimentScore: sentimentScore })
        await coin.save()
        res.send(coin)

    } catch (e) {
        console.error(e)
        res.status(500).send(e)
    }
});




module.exports = router