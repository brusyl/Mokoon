var express = require("express"),
    app = express(),
    server = require("http").Server(app),
    path = require("path"),
    io = require("socket.io")(server),
    port = 3000;

server.listen(port);

app.use('/src', express.static(__dirname + '/src'));
app.use('/node_modules', express.static(__dirname + '/node_modules'));
app.use('/build', express.static(__dirname + '/build'));
app.use('/dist', express.static(__dirname + '/dist'));


app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname + '/test.html'));
});

io.on('connection', function (socket) {
    socket.emit('news', {
        hello: 'world'
    });
    socket.on('move', function (data) {
        console.log(data);
    });
});

console.log("Running at Port " + port);