import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

//class component
// class Square extends React.Component {
//   render() {
//     return (
//       <button 
//         className="square" 
//         onClick={()=>{this.props.onClick()}}
//         >
//         {this.props.value}
//       </button>
//     );
//   }
// }

//function component
function Square(props){
  let className = "square";
  if(props.isActive){
    className += ' sqaure-active'
  }
  return(
    <button className={className} onClick={props.onClick}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i) {
    return (<Square
      value={this.props.squares[i]}
      key={i}
      isActive={this.props.activeIndexes.includes(i)}
      onClick={()=>{this.props.onClick(i)}}
      />
    );
  }

  renderRow(size, rowIndex) {
    const squares = [];
    for(let i=0; i<size; i++){
      let squareIndex = rowIndex*size + i;
      squares.push(this.renderSquare(squareIndex));
    }
    return (<div className="board-row" key={rowIndex}>{squares}</div>
    );
  }

  render() {
    const rows = [];
    for(let i = 0; i<this.props.size; i++){
      rows.push(this.renderRow(this.props.size, i));
    }

    return (
      <div>{rows}</div>
    );
  }
}

class Game extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      history:[{
        squares: Array(9).fill(null),
        lastIndex: null,
        activeIndexes: [],
      }],
      xIsNext: true,
      stepNumber: 0,
      isAscending: true,
      boardSize: 3,
      status: 'Start game!'
    }
  }

  handleClick(i){
    const history = this.state.history.slice(0, this.state.stepNumber+1);
    const current = history[history.length-1];
    const squares = current.squares.slice();

    if(calculateWinner(squares) || squares[i]){
      return;
    }

    squares[i] = this.state.xIsNext ? 'X' : 'O';
    let { nextStatus, winnerIndexes } = this.checkGameState(squares);

    this.setState({
      history: history.concat([{
        squares: squares,
        lastIndex: i,
        activeIndexes: winnerIndexes ? winnerIndexes : [i],
      }]),
      xIsNext: !this.state.xIsNext,
      stepNumber: history.length,
      status: nextStatus,
    });
  }

  checkGameState(squares){
    const winnerIndexes = calculateWinner(squares);
    let nextStatus;
    if(winnerIndexes){
      const winner = squares[winnerIndexes[0]];
      nextStatus = winner + ' won!';
    }
    else if(this.state.stepNumber+1 >= Math.pow(this.state.boardSize, 2)){
      nextStatus = "Game over!";
    }
    else{
      nextStatus = "Next player: " + (!this.state.xIsNext ? 'X' : 'O');
    }
    return {nextStatus, winnerIndexes};
  }

  jumpTo(step){
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2 ) === 0,
    });
  }

  changeOrder(){
    this.setState({
      isAscending: !this.state.isAscending,
    });
  }

  getMovesList(history){
    const boardSize = this.state.boardSize;
    const moves = history.map((step, move) => {
      const row = Math.floor(step.lastIndex/boardSize)+1;
      const col = (step.lastIndex%boardSize)+1;
      const desc = move ? 'Go to step #' + move +`(${row}, ${col})`:'Go to game begin';
      return (
        <li key={move}>
          <button onClick={()=>this.jumpTo(move)}>{desc}</button>
        </li>
      );
    })
    return moves || [];
  }

  render() {
    const boardSize = this.state.boardSize;
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const moves = this.getMovesList(history);
    const status = this.state.status;    

    if(!this.state.isAscending){
      moves.reverse();
    }
    
    return (
      <div className="game">
        <div className="game-board">
          <Board
            size={boardSize}
            squares={current.squares}
            activeIndexes={current.activeIndexes}
            onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>          
          <ol>{moves}</ol>   
          <div><button onClick={()=>this.changeOrder()}>Change order</button>
          </div>       
        </div>
      </div>
    );
  }
}

// ========================================

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Game />);


function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return [a,b,c];
    }
  }
  return null;
}