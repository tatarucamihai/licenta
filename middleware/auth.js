const jwt = require('jsonwebtoken')
const User = require('../src/models/user')

const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer', '').trim()
        const decoded = jwt.verify(token, 'licenta')
        const user = await User.findOne({_id: decoded._id, 'tokens.token': token })

        if (!user) {
            throw new Error('User not found!')
        }

        req.token = token
        req.user = user
        next()
    }
    catch (e) {
        res.send({ error: 'Please authenticate.' })
    }
}
module.exports = auth

