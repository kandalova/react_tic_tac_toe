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
  //move to Game for historylogic
  // constructor(props){
  //   super(props);
  //   this.state = {
  //     squares: Array(9).fill(null),
  //     xIsNext: true,
  //   };
  // }

  // handleClick(i){
  //   const squares = this.state.squares.slice();
  //   if(calculateWinner(squares) || squares[i]){
  //     return;
  //   }
  //   squares[i] = this.getNextPlayer();
  //   this.setState({
  //     squares: squares,
  //     xIsNext: !this.state.xIsNext,
  //   });
  // }

  renderSquare(i) {
    return (<Square
      className={i===this.props.lastIndex ? '' : ''}
      value={this.props.squares[i]}
      key={i}
      isActive={i===this.props.lastIndex || this.props.winnerIndexes?.includes(i)}
      winnerIndexes={this.props.winnerIndexes}
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

  // getNextPlayer(){
  //   return this.state.xIsNext ? 'X': 'O';
  // }

  render() {
    //move to Game for history
    // const winner = calculateWinner(this.state.squares);
    // let status;
    // if(winner){
    //   status = winner + ' won!'
    // }
    // else{
    //   status = 'Next player: ' + this.getNextPlayer();
    // }
    const rows = [];
    for(let i = 0; i<this.props.size; i++){
      rows.push(this.renderRow(this.props.size, i));
    }

    return (
      <div>{rows}</div>
    );


    return (
      <div>
        {/* <div className="status">{status}</div> */}
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
  constructor(props){
    super(props);
    this.state = {
      history:[{
        squares: Array(9).fill(null),
        lastIndex: null,
      }],
      xIsNext: true,
      stepNumber: 0,
      isAscending: true,
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
    this.setState({
      history: history.concat([{
        squares: squares,
        lastIndex: i,
      }]),
      xIsNext: !this.state.xIsNext,
      stepNumber: history.length,
    });
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
  

  render() {
    const boardSize = 3;
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winnerIndexes = calculateWinner(current.squares);
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
    if(!this.state.isAscending){
      moves.reverse();
    }
    let status;
    if(winnerIndexes){
      const winner = current.squares[winnerIndexes[0]];
      status = winner + ' won!';
    }
    else if(this.state.stepNumber >= boardSize*boardSize){
      status = "Game over!";
    }
    else{
      status = "Next player: " + (this.state.xIsNext ? 'X' : 'O');
    }
    return (
      <div className="game">
        <div className="game-board">
          <Board
            size={boardSize}
            squares={current.squares}
            lastIndex={current.lastIndex}
            winnerIndexes={winnerIndexes}
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