import React from 'react';
import Board from '../Board/Board.js';
import './UserInterface.css';

class UserInterface extends React.Component{
    constructor(props){
      super(props);
    }
    
    render(){
      let gameStatus;
      
      if (this.props.gameState.gameOver == false){
        gameStatus = <span>It is <span className={this.props.gameState.whosTurn == 'player1' ? 'player1Text' : 'player2Text'}>{this.props.gameState.whosTurn == 'player1' ? 'Player 1\'s' : 'Player 2\'s'}</span> turn.</span>;
      }
      else{
        gameStatus = <span>Game Is Over. <span className={this.props.gameState.winner == 'Player 1 (Red)' ? 'player1Text' : 'player2Text'}>{this.props.gameState.winner}</span> is the winner!</span>;
      }
      
      return(
          <div className="row ui h-100">
            <div id="left_menu" className="col-2 bg-dark align-self-start">
              <h2 className="gameStatus">{gameStatus}</h2>
              <hr />
              <div className="piecesLeft">
                <h2 className="piecesLeftHeader"></h2>
                <span className="player1Text">Player 1 pieces: <br />{this.props.gameState.player1.pieces}</span>
                <br />
                <span className="player2Text">Player 2 pieces: <br />{this.props.gameState.player2.pieces}</span>
              </div>
            </div>
            <div className="col-8 text-center align-self-center">
              <Board width="600" height="600" gameState={this.props.gameState} updateGame={this.props.updateGame} canMoveTo={this.props.canMoveTo}/>
            </div>
            <div id="right_menu" className="col-2 bg-dark align-self-start">
              <h2 className="historyText">History</h2>
              {this.props.gameState.history.map((history, i)=>{
                return <button className='historyBtn btn-info' onClick={this.props.backtrack} value={i}>{i == 0 ? `Restart Game` : `Go To Move ${i}`}</button>;
              })}
            </div>
          </div>
      )
    }
}

export default UserInterface;