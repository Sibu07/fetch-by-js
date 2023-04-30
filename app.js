const express = require('express');
const app = express();
const request = require('request');
const bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/api/data', (req, res) => {
  const jsonUrl = req.query.json_url;
  let start = req.query.start;
  let end = req.query.end;
  let limit = req.query.limit;

  request.get(jsonUrl, (err, response, body) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error fetching data');
      return;
    }

    let jsonData;
    try {
      jsonData = JSON.parse(body);
    } catch (err) {
      console.error(err);
      res.status(500).send('Error parsing JSON data');
      return;
    }

    start = start ? parseInt(start) : 0;
    end = end ? parseInt(end) : jsonData.length;

    if (limit) {
      limit = parseInt(limit);
      end = start + limit;
    }

    const response_data = jsonData.slice(start, end);

    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(response_data));
  });
});

app.listen(process.env.PORT || 3000, () => {
  console.log('App listening on port 3000!');
});
