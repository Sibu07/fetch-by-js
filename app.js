const http = require('http');
const url = require('url');

const hostname = '0.0.0.0';
const port = process.env.PORT || 3000;

const server = http.createServer((req, res) => {
  const queryObject = url.parse(req.url, true).query;
  const jsonUrl = queryObject.json_url;
  let start = queryObject.start ? parseInt(queryObject.start) : 0;
  let end = queryObject.end;
  let limit = queryObject.limit ? parseInt(queryObject.limit) : undefined;
  
  http.get(jsonUrl, (response) => {
    let data = '';
    response.on('data', (chunk) => {
      data += chunk;
    });
    response.on('end', () => {
      const json_data = JSON.parse(data);
      if (end === undefined) {
        end = json_data.length;
      } else {
        end = parseInt(end);
      }
      if (limit !== undefined) {
        end = start + limit;
      }
      const response_data = json_data.slice(start, end);
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify(response_data));
    });
  }).on('error', (err) => {
    console.log(`Error: ${err.message}`);
  });
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
