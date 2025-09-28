const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

app.post('/v1/chat/completions', async (req, res) => {
  try {
    const response = await axios.post('http://localhost:12434/engines/llama.cpp/v1/chat/completions', req.body, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    res.status(response.status).send(response.data);
  } catch (error) {
    console.error('Error proxying request:', error);
    if (error.response) {
      res.status(error.response.status).send(error.response.data);
    } else {
      res.status(500).send({ error: 'An internal server error occurred' });
    }
  }
});

app.listen(port, () => {
  console.log(`Proxy server listening at http://localhost:${port}`);
});