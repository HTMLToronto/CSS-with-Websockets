var io = require('socket.io').listen(57800);

io.sockets.on('connection', function (socket) {
	socket.on('submitUpdateLayout', function (updateData) {
		io.sockets.emit('updateLayout', updateData);
	});
});

