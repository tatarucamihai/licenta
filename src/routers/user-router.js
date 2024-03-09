const express = require('express')
const User = require('../models/user')
const router = new express.Router()
const auth = require('../../middleware/auth')

router.post('/users/create', async (req, res) => {
    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
    })

    try {
        await user.save()
        const token = await user.generateAuthToken()
        res.send('User created successfully!')

    } catch (e) {
        res.status(500).send(e)
        console.log(e)
    }
})

router.post('/users/login', async (req, res) => {

    try {
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken()
        res.json({ user, token })
    }
    catch (e) {
        res.status(400).send('Invalid credentials')
        console.log(e)
    }
})

router.post('/users/logout', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => { //pt logout de pe device-ul curent facem filter si
                                                             //pastram doar tokenurile ce nu sunt egale cu cel curent
            return token.token !== req.token
        })
        await req.user.save()

        res.send('User logged out successfully!')
    }
    catch (e) {
        res.status(500).send(e)
        console.log(e)
    }
})


module.exports = router;
