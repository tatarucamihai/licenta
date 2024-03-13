const WebSocket = require('ws');
const fs = require('fs');

const ws = new WebSocket('wss://ws.coinapi.io/v1/');

ws.on('open', function open() {
  const data = {
    "type": "hello",
    "apikey": "CAEC9731-272E-48C4-ACBC-7B9159E28CAE",
    "heartbeat": false,
    "subscribe_data_type": ["trade"],
    "subscribe_filter_symbol_id": [
      "BITSTAMP_SPOT_BTC_USD$",
      "BITFINEX_SPOT_BTC_LTC$",
      "COINBASE_",
      "ITBIT_"
    ]
  };

  ws.send(JSON.stringify(data));
});

ws.on('message', function incoming(data) {
    const message = data.toString();

    try {
      // Try to parse the message as JSON
      const jsonData = JSON.parse(message);
      console.log('Received JSON data:', jsonData);
    } catch (error) {
      // If an error occurs, log the original message
      console.error('Received non-JSON data:', message);
    }
  });