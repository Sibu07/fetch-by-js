const express = require('express');
const request = require('request');
const app = express();

app.get('/api/data', (req, res) => {
  const jsonUrl = req.query.json_url;
  const start = req.query.start ? parseInt(req.query.start) : 0;
  const end = req.query.end ? parseInt(req.query.end) : undefined;
  const limit = req.query.limit ? parseInt(req.query.limit) : undefined;
  
  request.get(jsonUrl, (error, response, body) => {
    if (error) {
      return res.status(500).send(error.message);
    }
    try {
      const data = JSON.parse(body);
      const startIdx = Math.min(start, data.length);
      const endIdx = end ? Math.min(end, data.length) : data.length;
      const limitIdx = limit ? Math.min(start + limit, data.length) : endIdx;
      const result = data.slice(startIdx, limitIdx);
      return res.status(200).json(result);
    } catch (e) {
      return res.status(500).send('Invalid JSON data');
    }
  });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
