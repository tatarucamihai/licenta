const express = require('express')
const path = require('path')
const ejs = require('ejs')
const cors = require('cors')


require('./db/mongoose')

const userRouter = require('./routers/user-router')
const coinRouter = require('./routers/coin-router')
const currencyRouter = require('./routers/currency-router')



const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use(cors())


const port = process.env.PORT || 3000
const publicDirectory = path.join(__dirname, '../public',)


app.use(express.static(publicDirectory))
app.use(userRouter)
app.use(coinRouter)
app.use(currencyRouter)


app.listen(port, () => {
    console.log(`Server is up on port ${port}!`)

})

app.get('/coin-details.html', (req, res) => {
    res.sendFile(path.join(publicDirectory, 'views', 'coin-details.html'));
})

app.get('/', (req, res) => {
    res.sendFile(path.join(publicDirectory, 'views', 'index.html'));
})

app.get('/login', (req, res) => {
    res.sendFile(path.join(publicDirectory, 'views', 'login.html'));
})

app.get('/register', (req, res) => {
    res.sendFile(path.join(publicDirectory, 'views', 'register.html'));
})

app.get('/coin', (req, res) => {
    res.sendFile(path.join(publicDirectory, 'views', 'coin.html'));
})

