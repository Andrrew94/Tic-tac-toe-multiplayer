import React, { Component } from 'react';
import socketIOClient from "socket.io-client";
import Board from './Board/Board';
import classes from './TicTacToe.module.css';

class TicTacToe extends Component {
	constructor(props) {
		super(props);
		
		this.state = {
			board: [],
			socket: socketIOClient('http://localhost:4000'),
			message: 'Waiting for the other player...',
			turn: false,
			winner: false,
			status: ''
		};
		
		this.state.socket.on('board', board => {
		  this.setState({...this.state, board: board,});
		});
		
		this.state.socket.on('newPlayer', player => {
			this.setState({...this.state, player: player});
		});
		
		this.state.socket.on('turn', player => {
			if ( this.state.steps === 8 ) {
				this.setState({...this.state, message: "Tied game", turn: false})
			}
			if (player === this.state.player) {
				this.setState({...this.state, message: "It's your turn. What's your move?", turn: true})
			} else {
				this.setState({...this.state, message: `It's your opponents turn, player ${player} is thinking`, turn: false})
			}
		});
		
		this.state.socket.on('tiedGame', message => {
			this.setState({status: message});
		});
		
		this.state.socket.on('victory', player => {
			let updatedState = {turn: false};
			if ( player !== this.state.player ) {
				this.setState({message: 'Good job! You won!', winner: false});
			}  else {
				this.setState({message: 'Your opponent won, better luck next time!'});
			}
			this.setState({...this.state, updatedState});
		});
		
	}

	handleClick(i) {
		const boxes = this.state.board.slice();
		if (boxes[i] || !this.state.turn) {
			return
		}
		boxes[i] = this.state.player;
		
		this.setState({...this.state,board: boxes, turn: !this.state.turn});
		this.state.socket.emit('updateBoard', {index: i, value: boxes[i], boxes: this.state.board, incrementStep: 1});
	}
	
	resetGame() {
		this.setState({status: ''});
		this.state.socket.emit('reset');
	}

	render() {
		return (
			<div>
				<h2 className={classes.greeting}>Hello player {this.state.player}, welcome to the game board.</h2>
				<div className={classes.message}>{this.state.message}</div>
				<Board
						boxes={this.state.board}
						onClick={i => this.handleClick(i)}
				/>
				<div className={classes.game__info}>
					<div className={classes.status}>{this.state.status}</div>
					<button onClick={() => this.resetGame()} className={classes.reset__button}>Reset game</button>
				</div>
				
			</div>
		);
	}
}

export default TicTacToe;
