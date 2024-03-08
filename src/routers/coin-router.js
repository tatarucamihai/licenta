const Coin = require('../models/coin')
const express = require('express')
const router = new express.Router()
const auth = require('../../middleware/auth')

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

router.get('/coins', auth, async (req, res) => {
    try {
        const coins = await Coin.find()
        res.send({ coins })
    } catch (e) {
        console.error(e)
        res.status(500).send(e)
    }
})

router.post('/coins/reviews/sentiment', async (req, res) => {
    const { coinId, review, sentimentScore } = req.body

    try {
        const coin = await Coin.findById(coinId)
        if (!coin) {
            return res.status(404).send('Coin not found')
        }

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
        console.log(e)
        res.status(500).send(e)
    }
})

router.post('/coins/delete/:id',  async (req, res) => {
    try {const coin = await Coin.findByIdAndDelete(req.params.id)
        res.status(200).send(coin)

    }catch(e){
        res.status(500).send(e)
    }
    
})

module.exports = router