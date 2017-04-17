var express = require('express');

var server = express();

server.configure(function(){
  server.use(express.static(__dirname + '/public_html'));
});


var processPort = process.env.PORT || 3000;
server.listen(processPort);

console.log('server up on port'+processPort);
