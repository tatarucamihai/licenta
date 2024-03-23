const Coin = require('../models/coin')
const axios = require('axios')
const express = require('express')
const router = new express.Router()
const auth = require('../../middleware/auth')


router.get('/api/btc-coin/', async (req, res) => {
    try {
        const response = await axios.get('https://rest.coinapi.io/v1/exchangerate/BTC/USD', {
            headers: { 'X-CoinAPI-Key': 'CAEC9731-272E-48C4-ACBC-7B9159E28CAE'}
        })
        res.json({ rate: response.data.rate })
        console.log(response.headers['x-ratelimit-remaining'])

    } catch (e) {
        console.error('Error fetching BTC rate', e)

    }
})


router.get('/api/dash-coin', async (req, res) => {
    try {
        const response = await axios.get('https://rest.coinapi.io/v1/exchangerate/DASH/USD', {
            headers: { 'X-CoinAPI-Key': 'CAEC9731-272E-48C4-ACBC-7B9159E28CAE' , 'X-CoinAPI-Limits': 'ForceInclude' }
        });
        res.json({ rate: response.data.rate });
        console.log(response.headers['x-ratelimit-remaining'])
    } catch (e) {
        console.error('Error fetching DASH rate', e);
        res.status(500).send('Error fetching DASH rate');
    }
});

router.get('/api/aurora-coin', async (req, res) => {
    try {
        const response = await axios.get('https://rest.coinapi.io/v1/exchangerate/AUR/USD', {
            headers: { 'X-CoinAPI-Key': 'CAEC9731-272E-48C4-ACBC-7B9159E28CAE' }
        });
        res.json({ rate: response.data.rate });
        console.log(response.headers['x-ratelimit-remaining'])
    } catch (e) {
        console.error('Error fetching Aur rate', e);
        res.status(500).send('Error fetching Aur rate');
    }
});

router.get('/api/doge-coin', async (req, res) => {
    try {
        const response = await axios.get('https://rest.coinapi.io/v1/exchangerate/DOGE/USD', {
            headers: { 'X-CoinAPI-Key': 'CAEC9731-272E-48C4-ACBC-7B9159E28CAE' }
        });
        res.json({ rate: response.data.rate });
        console.log(response.headers['x-ratelimit-remaining'])
    } catch (e) {
        console.error('Error fetching Doge rate', e);
        res.status(500).send('Error fetching Doge rate');
    }
});

router.get('/api/eth-coin', async (req, res) => {
    try {
        const response = await axios.get('https://rest.coinapi.io/v1/exchangerate/ETH/USD', {
            headers: { 'X-CoinAPI-Key': 'CAEC9731-272E-48C4-ACBC-7B9159E28CAE' }
        });
        res.json({ rate: response.data.rate });
        console.log(response.headers['x-ratelimit-remaining'])
    } catch (e) {
        console.error('Error fetching Doge rate', e);
        res.status(500).send('Error fetching Doge rate');
    }
});

router.get('/api/lite-coin', async (req, res) => {
    try {
        const response = await axios.get('https://rest.coinapi.io/v1/exchangerate/LTC/USD', {
            headers: { 'X-CoinAPI-Key': 'CAEC9731-272E-48C4-ACBC-7B9159E28CAE' }
        });
        res.json({ rate: response.data.rate });
        console.log(response.headers['x-ratelimit-remaining'])
    } catch (e) {
        console.error('Error fetching Doge rate', e);
        res.status(500).send('Error fetching Doge rate');
    }
});


module.exports = router
