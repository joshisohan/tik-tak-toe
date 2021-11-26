import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function calculateWinner(squares) {
  const line = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];

  for (let i = 0; i < line.length; i++) {
    const [a, b, c] = line[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return [a, b, c];
    }
  }
  return null;
}


function Square(props) {
  return (
    <button
      className={props.name}
      onClick={props.onClick}
    >
      {props.value}
    </button>
  )
}

class Board extends React.Component {
  renderSquare(i) {
    console.log(this.props.winner, i);
    var class_name = (this.props.winner != null && this.props.winner.includes(i)) ? 'square winner' : 'square';
    return (
      <Square
        name={class_name}
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
      />
    );
  }

  render() {
    return (
      <div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null)
      }],
      stepNumber: 0,
      xIsNext: true,
      winner: null,
    }
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    let squares = current.squares.slice();
    const winner = calculateWinner(squares);

    if (squares[i] != null) {
      console.log("Already Filled!");
      alert("Already Filled!");
      return
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    const current_winner = calculateWinner(squares);

    if (winner) {
      return;
    }

    this.setState({
      history: history.concat([{
        squares: squares
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });

    if (current_winner) {
      this.setState({
        winner: current_winner
      });
      return;
    }
  }

  time_travel(move) {
    const step_history = this.state.history[move];
    const winner = calculateWinner(step_history.squares);

    this.setState({
      stepNumber: move,
      xIsNext: (move % 2) === 0,
      winner: winner
    })
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    let msg = "";
    // const winner = calculateWinner(current.squares.slice())

    const moves = history.map((steps, move) => {
      const desc = move ?
        "Go to move #" + move :
        "Go to game start";
      console.log("STEPS:", steps)
      console.log("MOVE: ", move)

      return (
        <li key={move}>
          <button onClick={() => this.time_travel(move)}>{desc}</button>
        </li>
      )
    })

    let status;
    if (this.state.winner) {
      status = "Winner is: " + this.state.winner;
    } else {
      status = "Next Player: " + (this.state.xIsNext ? 'X' : 'O');
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
            winner={this.state.winner}
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
          />
          <p>
            <p>{msg}</p>
          </p>
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);
