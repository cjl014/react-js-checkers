import React from 'react';
import * as d3 from 'd3';
import './CheckerPiece.css';

class CheckerPiece extends React.Component{
    constructor(props){
      super(props);
      
      this.dragended = this.dragended.bind(this);
      this.dragstarted = this.dragstarted.bind(this);
    }
    
    playerTurnEnd(board, whosTurn, checkGameOver, redPieces, blackPieces, history) {
      this.props.updateGame(board, whosTurn, checkGameOver, redPieces, blackPieces, history);
    }
    
    
    dragstarted(piece) {
      piece.style.cursor = 'grabbing';
      piece.setAttribute('data-prev-CenterX', piece.firstChild.getAttribute('cx'));
      piece.setAttribute('data-prev-CenterY', piece.firstChild.getAttribute('cy'));
      
      // if text 'K' exist
      if(piece.children[1]){
        piece.setAttribute('data-prev-TextX', piece.children[1].getAttribute('x'));
        piece.setAttribute('data-prev-TextY', piece.children[1].getAttribute('y'));
      }
      
      let currentSquareState = Object.assign({}, this.props.gameState.board.squares[piece.getAttribute('data-sqId') - 1]);
      this.props.canMoveTo(currentSquareState);
    }
  
    drag() {
      d3.select(this.firstChild).attr("cx", parseInt(this.firstChild.getAttribute('cx')) + parseInt(d3.event.dx)).attr("cy", parseInt(this.firstChild.getAttribute('cy')) + parseInt(d3.event.dy));
      
      // if text 'K' exist
      if(this.children[1]){
        d3.select(this.children[1]).attr('x', parseInt(this.children[1].getAttribute('x'))  + parseInt(d3.event.dx)).attr("y", parseInt(this.children[1].getAttribute('y')) + parseInt(d3.event.dy));
      }
    }
  
    dragended(piece) {
      let gameState = Object.assign({}, this.props.gameState); 
      let currentPiece = d3.select(piece);
      let currentPieceCircle = d3.select(piece.firstChild);
      let currentPieceText = piece.children[1] ? d3.select(piece.children[1]) : 'none';
      let pieceCenterX = currentPieceCircle.attr('cx');
      let pieceCenterY = currentPieceCircle.attr('cy');
      let overallDistance = 999999999999;
      let chosenSq;
      let updatedBoard = Object.assign({}, {squares: []});
      let whosTurn = this.props.gameState.whosTurn;
      let currentSquareState = Object.assign({}, this.props.gameState.board.squares[piece.getAttribute('data-sqId') - 1]);
      let redPieces = this.props.gameState.player1.pieces;
      let blackPieces = this.props.gameState.player2.pieces;
      let redPiecesJumped = 0;
      let blackPiecesJumped = 0;
      let stopLoop = false;
      let history = gameState.history.slice(0);
      
      piece.style.cursor = 'grab';
      
      d3.selectAll('.rect').each(function(){
        let distanceX = this.getAttribute('centerX') - pieceCenterX;
        let distanceY = this.getAttribute('centerY') - pieceCenterY;
        distanceX = Math.abs(distanceX);
        distanceY = Math.abs(distanceY);
        let distance = distanceX + distanceY;
        
        if (distance < overallDistance){
          overallDistance = distance;
          chosenSq = this;
        }
      });
  
      // if there are no squares to move to
      if(this.props.canMoveTo(currentSquareState).length == 0){
        currentPieceCircle.attr('cx', currentPiece.attr('data-prev-CenterX')).attr('cy', currentPiece.attr('data-prev-CenterY'));
        // if text 'King' exist
        if(currentPieceText != 'none'){
          currentPieceText.attr('x', currentPiece.attr('data-prev-TextX')).attr('y', currentPiece.attr('data-prev-TextY'));
        }
      }
  
      // loops through squares available to move to
      this.props.canMoveTo(currentSquareState).forEach((obj, i)=>{
        // if you dropped a piece on an available square, then start updating the state of the board.
        if (chosenSq.getAttribute('data-id') == obj.sqId && stopLoop == false){
          stopLoop = true;
  
          updatedBoard.squares = this.props.gameState.board.squares.map((s)=>{
            let sq = Object.assign({}, s);
            let sqPiece = Object.assign({}, sq.piece);
            
            // set items for the new square
            if(sq.id == chosenSq.getAttribute('data-id')){
              sqPiece.id = currentPiece.attr('data-id');
              sqPiece.color = currentPiece.attr('data-color');
              sq.isEmpty = 'false';
  
              // KING ME
              if ((sqPiece.color == 'red' &&  chosenSq.getAttribute('data-row') == '1') || (sqPiece.color == 'black' &&  chosenSq.getAttribute('data-row') == '8')){
                sqPiece.type = 'king';
              }
              else{
                sqPiece.type = currentPiece.attr('data-type');
              }
            }
            // set items for the previous square
            if(sq.id == currentPiece.attr('data-sqId')){
              sqPiece = {};
              sq.isEmpty = 'true';
            }
            // set items for the jumped square/piece
            if(obj.jumpedPieceIds){
              for (let j = 0; j <= i; j++){
                if(sqPiece.id == parseInt(obj.jumpedPieceIds[j])){
                  sqPiece = {};
                  sq.isEmpty = 'true';
                  currentPiece.attr('data-color') == 'red' ? blackPiecesJumped++ : redPiecesJumped++;
                }
              }
            }
            
            sq.piece = sqPiece;
            return sq;
          })
  
          whosTurn = whosTurn == 'player1' ? 'player2' : 'player1';
          history.push(gameState);
          this.playerTurnEnd(updatedBoard, whosTurn, true, redPieces - redPiecesJumped, blackPieces - blackPiecesJumped, history);
        }
        else{
          currentPieceCircle.attr('cx', currentPiece.attr('data-prev-CenterX')).attr('cy', currentPiece.attr('data-prev-CenterY'));
          // if text 'King' exist
          if(currentPieceText != 'none'){
            currentPieceText.attr('x', currentPiece.attr('data-prev-TextX')).attr('y', currentPiece.attr('data-prev-TextY'));
          }
        }
      });
      
      d3.selectAll('.rect').each(function(){
        //this.style.opacity = 1;
        this.classList.remove('highlight_sq');
      });
    } 
    
    componentDidMount(){
      // remove drag listeners
      d3.selectAll('.checkerPiece[data-active=false]')
        .call(d3.drag()
              .on('start', null)
              .on('drag', null)
              .on('end', null)
        );
      
      // add drag listeners to active pieces only
      d3.selectAll('.checkerPiece[data-active=true]')
        .call(d3.drag()
              .on('start', (d, i, nodes)=>this.dragstarted(nodes[i]))
              .on('drag', this.drag)
              .on('end', (d, i, nodes)=>this.dragended(nodes[i]))
         );
     }
    
    render(){
      let active;
      
      if (this.props.gameState.whosTurn == 'player1'){
        this.props.color == 'red' ? active = true : active = false;
      }
      else {
        this.props.color == 'black' ? active = true : active = false;
      }
        
      
      return(
        <g data-id={this.props.id} className='checkerPiece' data-type={this.props.type} data-color={this.props.color} data-sqId={this.props.sqId} data-active={active}>
          <circle cx={this.props.sqCenterX} cy={this.props.sqCenterY} r='20' stroke={this.props.stroke} stroke-width='3' fill={this.props.fillColor} />
          {this.props.type == 'king' ? <text data-piece-id={this.props.id}  x={this.props.sqCenterX - 5} y={this.props.sqCenterY + 5} fill="white">K</text> : ''}
  
        </g>
      )
    }
}

export default CheckerPiece;