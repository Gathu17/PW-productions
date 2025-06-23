const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Enable CORS for your frontend
app.use(cors({
  origin: ['http://localhost:5173', 'https://pw-productions.vercel.app']
}));

app.use(express.json());

// Proxy endpoint for Printful API
app.get('/api/printful/products', async (req, res) => {
  try {
    const response = await axios.get('https://api.printful.com/products', {
      headers: {
        'Authorization': `Bearer ${process.env.PRINTFUL_TOKEN}`,
        'Content-Type': 'application/json',
        // 'X-PF-Store-Id': 15798323
      }
    });
    
    // Limit to only 5 products
    const limitedData = {
      ...response.data,
      result: response.data.result.slice(0, 5)
    };
    res.json(limitedData);
  } catch (error) {
    console.error('Error proxying to Printful:', error.message);
    res.status(error.response?.status || 500).json({
      error: 'Failed to fetch from Printful API',
      details: error.response?.data || error.message
    });
  }
});

app.get('/api/printful/products/:id', async (req, res) => {
  try {
    const response = await axios.get(`https://api.printful.com/store/products/`, {
      headers: {
        'Authorization': `Bearer ${process.env.PRINTFUL_TOKEN}`,
        'Content-Type': 'application/json',
        'X-PF-Store-Id': 16236391,
      }
    });
    
    res.json(response.data);
  } catch (error) {
    console.error('Error proxying to Printful:', error.message);
    res.status(error.response?.status || 500).json({
      error: 'Failed to fetch from Printful API',
      details: error.response?.data || error.message
    });
  }
});

// Alternatively, you can use the catalog API which doesn't require a store ID
app.get('/api/printful/catalog', async (req, res) => {
  try {
    const response = await axios.get('https://api.printful.com/products', {
      headers: {
        'Authorization': `Bearer ${process.env.PRINTFUL_TOKEN}`,
        'Content-Type': 'application/json'
      }
    });
    
    res.json(response.data);
  } catch (error) {
    console.error('Error proxying to Printful:', error.message);
    res.status(error.response?.status || 500).json({
      error: 'Failed to fetch from Printful API',
      details: error.response?.data || error.message
    });
  }
});

app.get('/api/printful/catalog/:id', async (req, res) => {
  try {
    const response = await axios.get(`https://api.printful.com/products/${req.params.id}`, {
      headers: {
        'Authorization': `Bearer ${process.env.PRINTFUL_TOKEN}`,
        'Content-Type': 'application/json'
      }
    });
    
    res.json(response.data);
  } catch (error) {
    console.error('Error proxying to Printful:', error.message);
    res.status(error.response?.status || 500).json({
      error: 'Failed to fetch from Printful API',
      details: error.response?.data || error.message
    });
  }
});

app.listen(PORT, () => {
  console.log(`Proxy server running on port ${PORT}`);
});

