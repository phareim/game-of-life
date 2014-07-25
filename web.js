var express = require('express');
var app = express();

var port = Number(process.env.PORT || 5000);

app.use('/', express.static(__dirname + '/'));
app.use('/', express.static(__dirname + '/public'));

app.listen(port, function() {
    console.log('listening on port: ' + port + ".");
});