var express = require('express');
var app = express();
var port = 3001;
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

app.listen(port);
console.log('Server listening on port: ' + port);
