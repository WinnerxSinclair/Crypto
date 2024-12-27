require('dotenv').config();
const express = require('express');
const axios = require('axios');
const cors = require('cors');
console.log('Starting the server...');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: ['http://localhost:5173', 'https://crypto-production-5a21.up.railway.app']
}));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'dist')));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html')); 
});
//chart
app.get('/crypto/:id/:timeframe', async (req, res) => {
  const { id, timeframe } = req.params;
  let days;

  switch(timeframe){
    case '1d':
      days = 1;
      break;
    case '1w':
      days = 7;
      break;
    case '1m':
      days = 30;
      break;
    case '1y':
      days = 365;
      break;
    
    default:
      return res.status(400).json({ error: 'Invalid timeframe' });
  }

  try {
    const response = await axios.get(`https://api.coingecko.com/api/v3/coins/${id}/market_chart`, {
      params: { 
        vs_currency: 'usd', 
        days,
        x_cg_demo_api_key: process.env.COINGECKO_API_KEY
      },
      
    });

    res.json(response.data);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: 'Failed to fetch data' });
  };

  
});


//one crypto data
app.get('/coin/:id', async (req, res) => {
  const {id} = req.params;

  try {
    const response = await axios.get('https://api.coingecko.com/api/v3/coins/markets', {
      params: {
        vs_currency: 'usd',
        ids: `${id}`,
        x_cg_demo_api_key: process.env.COINGECKO_API_KEY
      }
    })
    res.json(response.data);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: 'Failed to fetch data' });
  }
});

//first 100 crypto data
app.get('/crypto/list', async (req, res) => {
  try {
    const response = await axios.get('https://api.coingecko.com/api/v3/coins/markets', {
      params: {
        vs_currency: 'usd',
        x_cg_demo_api_key: process.env.COINGECKO_API_KEY
      }
    })

    res.json(response.data);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: 'Failed to fetch data'})
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
})