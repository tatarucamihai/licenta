const express = require('express')
const path = require('path')
const ejs = require('ejs')
const cors = require('cors')


require('./db/mongoose')
const userRouter = require('./routers/user-router')
const coinRouter = require('./routers/coin-router')



const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use(cors())


const port = process.env.PORT || 3000
const publicDirectory = path.join(__dirname, '../public')

app.use(express.static(publicDirectory))
app.use(userRouter)
app.use(coinRouter)


app.listen(port, () => {
    console.log(`Server is up on port ${port}!`)
    
})

app.get('/login', (req, res) => {
    res.sendFile(path.join(publicDirectory, 'login.html'));
})

app.get('/register', (req, res) => {
    res.sendFile(path.join(publicDirectory, 'register.html'));
})

app.get('/coin', (req, res) => {
    res.sendFile(path.join(publicDirectory, 'coin.html'));
})

