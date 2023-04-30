const express = require('express');

const axios = require('axios');

const app = express();

const port = 3000;

app.get('/api/data', async (req, res) => {

  const { json_url, start, end, limit } = req.query;

  try {

    const response = await axios.get(json_url);

    const json_data = response.data;

    let startIdx = start ? parseInt(start) : 0;

    let endIdx = end ? parseInt(end) : json_data.length;

    let limitNum = limit ? parseInt(limit) : undefined;

    if (limitNum !== undefined) {

      endIdx = startIdx + limitNum;

    }

    const response_data = json_data.slice(startIdx, endIdx);

    res.setHeader('Content-Type', 'application/json');

    res.send(JSON.stringify(response_data));

  } catch (error) {

    console.error(error);

    res.status(500).send('Internal server error');

  }

});

app.listen(port, () => {

  console.log(`Server listening at http://localhost:${port}`);

});

