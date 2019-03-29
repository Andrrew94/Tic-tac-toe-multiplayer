const express = require('express');
const socket = require('socket.io');

// Server setup
const app = express();
const server = app.listen(4000, function (  ) {
	console.log('listening to requests on port 4000');
});

// Static files
app.use(express.static('public'));

// Socket setup
let io = socket(server);

// Game settings
let board = null;
const players = {'X': null, 'O': null};
let player = 'X';
let steps = 0;
let status = '';

// Reset game function
function reset() {
	board = Array(9).fill(null);
	players['X'] = null;
	players['O'] = null;
	player = 'X';
	steps = 0;
	status = 'The game is tied, reset the game and try again!';
	io.emit('turn', player);
}

// Checking for winner
function checkWinner(boxes) {
	const lines = [
		[0, 1, 2],
		[3, 4, 5],
		[6, 7, 8],
		[0, 3, 6],
		[1, 4, 7],
		[2, 5, 8],
		[0, 4, 8],
		[2, 4, 6]
	];
	for (let i = 0; i < lines.length; i++) {
		const [a, b, c] = lines[i];
		if (boxes[a] && boxes[a] === boxes[b] && boxes[a] === boxes[c]) {
			return boxes[a];
		}
	}
	return null;
}

io.on('connection', function(socket) {
	
	// Creating new player
	if ( players['X'] === null) {
		players['X'] = socket;
		socket.emit('newPlayer', 'X');
	} else if ( players['O'] === null ) {
		players['O'] = socket;
		socket.emit('newPlayer', 'O');
		io.emit('turn', 'X');
	} else {
		socket.disconnect();
	}
	
	// On disconnect
	socket.on('disconnect', function() {
		if ( players['X'] === socket) {
			players['X'] = null;
		} else if ( players['O'] === socket ) {
			players['O'] = null;
		}
	});
	
	// Updating the game board and checking for game status
	socket.on('updateBoard', function(data) {
		steps = steps + data.incrementStep;
		if ( steps === 9 ) {
			io.emit('tiedGame', status);
		} else {
			if ( checkWinner(data.boxes) ) {
				// winner = true;
				io.emit('victory', player);
				io.emit('board', board);
				return
			} else {
				player = player === 'X' ? 'O' : 'X';
				io.emit('turn', player);
			}
		}
		
		// Emit the updated board
		board[data.index] = data.value;
		io.emit('board', board);
	});

	// Reset game event
	socket.on('reset', function() {
		reset();
		io.emit('board', board);
		console.log('the game has been reset');
	});
});

reset();
