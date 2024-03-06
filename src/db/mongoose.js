const mongoose = require('mongoose')
const mongodb = require('mongodb')


mongoose.connect('mongodb://127.0.0.1:27017/licenta-db')




mongoose.connection.on('error', err => {
    console.log('Mongoose connection error: ', err)
  })
    