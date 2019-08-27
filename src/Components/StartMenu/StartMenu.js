import React from 'react';
import './StartMenu.css';

class StartMenu extends React.Component{
    constructor(props){
      super(props);
    }
    
    render(){
      const btnStyle = {
        border: '2px solid cornflowerblue',
        fontWeight: 'bold',
        letterSpacing: '2px'
      }
      
      return(
        <div id="start_menu" className="row">
          <div className="col">
            <div className="row text-center justify-content-center h-100">
              <div className="col-8 start_menu_bg">
                <h1 className="display-4 text-dark font-weight-bolder"><img className="logo" src="https://tiletanks.tk/resources/checkers_logo.png" alt="logo"/></h1>
                <h3><img className="two-player-text" src="https://tiletanks.tk/resources/twoPlayer.png" alt="2 player"/></h3>
                <br />
                <button className="btn btn-info" id="start_btn" style={btnStyle} onClick={this.props.startGame}>Start Game</button>
              </div>
            </div>
          </div>
        </div>  
      )
    }
  }

  export default StartMenu;