const express = require('express')
const User = require('../models/user')
const router = new express.Router()

router.post('/users/create', async (req, res) => {
    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
    })

    try {
        await user.save()
        const token = await user.generateAuthToken()
        res.send({ user, token })

    } catch (e) {
        res.status(500).send(e)
        console.log(e)
    }
})

router.post('/users/login', async (req, res) => {

    try {
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken()
        res.send('User succesfully logged in!')
    }
    catch (e) {
        res.status(400).send('Invalid credentials')
        console.log(e)
    }



})


module.exports = router;
