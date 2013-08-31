var express = require('express');
var https = require('https');
var fs = require('fs');

var options = {
    key: fs.readFileSync('~/pingtreekey.pem')
};
var port = 443;
var app = express();

var handle = function(req, res) {
  console.log('Received request: ' + req.url);
  for (var prop in req.query) {
    console.log(prop + ': ' + req.query[prop]);
  }
  res.sendfile('src/index.html');
};
app.use(express.static(__dirname + '/src'));
app.get('/', handle);

app.get('/home', handle);

app.get('/blah', handle);

https.createServer(options, app).listen(port);
console.log('Server listening on port: ' + port);
