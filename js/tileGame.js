import Board from './board.js';
import StopWatch from './stopWatch.js';

const MATCH_SIZE = 3;

class TileGame {
    constructor(){
        this.game = null;
        this.inProgress = false;
        this.match = null;
        this.timer = null;
    }

    //Restarts the game by resetting the board and the timer
    restart(){
        this.game = new Board();
        this.inProgress = false;
        this.timer.reset();
    }

    //Pauses the game by stopping the timer and the game
    pause(){
        this.inProgress = false;
        this.timer.stop();
    }

    // Resumes the game after being paused
    resume(){
        this.inProgress = true;
        this.timer.start();
    }

    //Checks if the player has reached matched all colors in the 3 x 3 grid.
    isFinished(){
        let board = this.game.getBoard();
        let center = [[ board[1][1], board[1][2], board[1][3] ],
                        [ board[2][1], board[2][2], board[2][3] ],
                        [ board[3][1], board[3][2], board[3][3] ]];
        // console.log("not finished",this.match, center);
        for(let i = 0; i < MATCH_SIZE; i++){
            for(let j = 0; j < MATCH_SIZE; j++){
                if(this.match[i][j] != center[i][j])  {
                    return false;
                }
            }
        }
        // console.log("finished",this.match, center);
        return true;
    }

    //Creates a randomly generated 3 x 3 grid that the player has to match
    generateMatch(){
        let colorSet = this.game.createColorSet();
        let match = [];
        for(let i = 0; i < MATCH_SIZE; i++){
            let row = [];
            for(let j = 0; j < MATCH_SIZE; j++){
                let c = Math.floor(Math.random() * colorSet.length);
                row.push(colorSet[c]);
                colorSet.splice(c,1);
            }
            match.push(row);
        }
        return match;
    }

    //Displays the matching 3 x 3 grid onto the screen
    displayMatch(){
        let rows = document.getElementsByClassName("matchCell");
        let c = 0;
        for(let i = 0; i < MATCH_SIZE; i++){
            for(let j = 0; j < MATCH_SIZE; j++){
                rows[c].style.backgroundColor = this.match[i][j];
                c++;
            }
        }
    }

    //Displays the board onto the screen
    displayBoard(){
        let rows = document.getElementsByClassName("boardCell");
        let board = this.game.getBoard();
        let c = 0;
        for(let i = 0; i < board.length; i++){
            for(let j = 0; j < board.length; j++){
                
                if(board[i][j] === "EMPTY"){
                    rows[c].className = "boardCell empty";
                    rows[c].style = "";
                } else {
                    rows[c].className = "boardCell";
                    rows[c].style.backgroundColor = board[i][j];
                }
                c++;
            }
        }
    }

    //Updates the board and then displays it onto the screen
    updateBoard(){
        let board = this.game.getBoard();
        let htmlBoard = document.querySelectorAll(".boardCell");
        let i = 0;
        htmlBoard.forEach(cell =>{
            let x = i % 5;
            let y = Math.floor(i / 5);

            cell.addEventListener('click', () =>{
                // console.log(cell,x,y)
                this.game.moveCell([y,x]);
                this.displayBoard();
            });
            i++;
        })
    }

    // Forces the game to a win
    forceWin(){
        let board = this.game.getBoard();
        let center = [  [ board[1][1], board[1][2], board[1][3] ],
                        [ board[2][1], board[2][2], board[2][3] ],
                        [ board[3][1], board[3][2], board[3][3] ]];
        this.match = center;
        this.displayMatch();
    }

    //Starts a new game by creating a new board and starting a new timer
    start(){
        this.game = new Board();
        this.match = this.generateMatch();
        this.timer = new StopWatch();
        let timerElement = document.getElementById("timer");
        this.timer.start(timerElement);

        this.displayMatch();
        this.displayBoard();

        let interval = setInterval(()=>{
            this.updateBoard();
            // this.forceWin();
            if(this.isFinished()){
                console.log("Game won!")
                this.timer.stop();
                clearInterval(interval);
            }
        },10)
    }

}

let game = new TileGame();
game.start();