const express = require('express');
const fs = require('fs');
const app = express();

let jsonData = null;
fs.readFile('data.json', (error, data) => {
  if (error) {
    console.error(`Failed to read data.json: ${error.message}`);
    return;
  }
  try {
    jsonData = JSON.parse(data);
    console.log(`Read ${jsonData.length} records from data.json`);
  } catch (e) {
    console.error('Failed to parse data.json as JSON data');
  }
});

app.get('/api/data', (req, res) => {
  if (!jsonData) {
    return res.status(500).send('Failed to read data');
  }

  const start = req.query.start ? parseInt(req.query.start) : 0;
  const end = req.query.end ? parseInt(req.query.end) : undefined;
  const limit = req.query.limit ? parseInt(req.query.limit) : undefined;
  
  const startIdx = Math.min(start, jsonData.length);
  const endIdx = end ? Math.min(end, jsonData.length) : jsonData.length;
  const limitIdx = limit ? Math.min(start + limit, jsonData.length) : endIdx;
  const result = jsonData.slice(startIdx, limitIdx);
  
  return res.status(200).json(result);
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
