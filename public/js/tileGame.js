import Board from './board.js';
import StopWatch from './stopWatch.js';

const MATCH_SIZE = 3;

export default class TileGame {
    constructor() {
        this.game = null;
        this.inProgress = false;
        this.match = null;
        this.timer = null;
    }

    //Restarts the game by resetting the board and the timer
    restart() {
        this.game = new Board();
        this.inProgress = false;
        this.timer.reset();
    }

    //Pauses the game by stopping the timer and the game
    pause() {
        this.inProgress = false;
        this.timer.stop();
    }

    // Resumes the game after being paused
    resume() {
        this.inProgress = true;
        this.timer.start();
    }

    //Copies the board of another game
    copyBoard(newBoard){
        if(newBoard instanceof Board){
            this.game = newBoard;
        }
    }

    //Checks if the player has reached matched all colors in the 3 x 3 grid.
    isFinished() {
        let board = this.game.getBoard();
        let center = [
            [board[1][1], board[1][2], board[1][3]],
            [board[2][1], board[2][2], board[2][3]],
            [board[3][1], board[3][2], board[3][3]]
        ];
        // console.log("not finished",this.match, center);
        for (let i = 0; i < MATCH_SIZE; i++) {
            for (let j = 0; j < MATCH_SIZE; j++) {
                if (this.match[i][j] != center[i][j]) {
                    return false;
                }
            }
        }
        // console.log("finished",this.match, center);
        return true;
    }

    //Creates a randomly generated 3 x 3 grid that the player has to match
    generateMatch() {
        let colorSet = this.game.createColorSet();
        let match = [];
        for (let i = 0; i < MATCH_SIZE; i++) {
            let row = [];
            for (let j = 0; j < MATCH_SIZE; j++) {
                let c = Math.floor(Math.random() * colorSet.length);
                row.push(colorSet[c]);
                colorSet.splice(c, 1);
            }
            match.push(row);
        }
        return match;
    }

    //Displays the matching 3 x 3 grid onto the screen
    displayMatch() {
        let rows = document.getElementsByClassName("matchCell");
        let c = 0;
        for (let i = 0; i < MATCH_SIZE; i++) {
            for (let j = 0; j < MATCH_SIZE; j++) {
                rows[c].style.backgroundColor = this.match[i][j];
                c++;
            }
        }
    }

    //Displays the board onto the screen
    displayBoard() {
        let rows = document.getElementsByClassName("boardCell");
        let board = this.game.getBoard();
        let c = 0;
        for (let i = 0; i < board.length; i++) {
            for (let j = 0; j < board.length; j++) {

                if (board[i][j] === "EMPTY") {
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
    updateBoard() {
        let board = this.game.getBoard();
        let htmlBoard = document.querySelectorAll(".boardCell");
        let i = 0;
        htmlBoard.forEach(cell => {
            let x = Math.floor(i / 5);
            let y = i % 5;

            cell.addEventListener('click', () => {
                // console.log(cell,x,y)
                let isValid = this.game.moveCell([x, y]);
                if (isValid) this.displayBoard();
            });
            i++;
        })
    }

    // Forces the game to a win
    forceWin() {
        let board = this.game.getBoard();
        let center = [
            [board[1][1], board[1][2], board[1][3]],
            [board[2][1], board[2][2], board[2][3]],
            [board[3][1], board[3][2], board[3][3]]
        ];
        this.match = center;
        this.displayMatch();
    }

    hideMenu() {
        let menu = document.getElementById("menu");
        menu.style.display = "none";
    }

    showGame() {
        let game = document.getElementById("game");
        game.style.display = "block";
    }

    hideGame() {
        let game = document.getElementById("game");
        game.style.display = "none";
    }

    //Starts the game
    start() {
        let counter = document.getElementById("counter");
        let container = document.getElementById("countContainer");
        container.style.display = "block";
        let num = Number.parseInt(counter.innerHTML);

        let countInterval = setInterval(() => {
            num--;
            if (num === 0) {
                clearInterval(countInterval);
                container.style.display = "none";
                this.createGame();
                this.showGame();
            } else {
                document.getElementById("counter").innerHTML = num;
            }
        }, 1000);
        return true;
    }

    //Displays an animation
    displayWin() {
        let one = document.getElementById("1");
        let two = document.getElementById("2");
        let three = document.getElementById("3");
        let four = document.getElementById("4");
        let five = document.getElementById("5");
        let six = document.getElementById("10");
        let seven = document.getElementById("15");
        let eight = document.getElementById("20");
        let nine = document.getElementById("25");
        let ten = document.getElementById("24");
        let eleven = document.getElementById("23");
        let twelve = document.getElementById("22");
        let thirteen = document.getElementById("21");
        let fourteen = document.getElementById("16");
        let fifteen = document.getElementById("11");
        let sixteen = document.getElementById("6");

        let outerCell = [one, two, three, four, five, six, seven, eight, nine, ten,
            eleven, twelve, thirteen, fourteen, fifteen, sixteen
        ];
        let timeout = 0;
        for (let cell of outerCell) {
            cell.style.animation = `shrinkPop ease-in both ${timeout}ms`;
            timeout += 100;
        }

        let table = document.getElementById("board");
        let tableCell = document.getElementsByClassName("boardCell");
        table.style.animation = `shrinkTable ease-in both 800ms`;

        setTimeout(()=>{
            for(let cell of outerCell){
                cell.remove();
            }
            table.style.padding = "5rem 5rem 5rem 5rem";
            table.style.marginLeft = "-13.25rem";
            table.style.borderSpacing = "0.7rem";
            table.style.borderRadius = "1.2rem";

            for(let remain of tableCell){
                remain.style.borderRadius = ".4rem";
                remain.style.padding = "12%";
            }

            
            table.style.animation = `shrinkTable2 linear 1.2s`;
            table.style.width = "7.5rem";
            table.style.marginTop = "-5rem";
            table.style.marginLeft = "-3.75rem";
            table.style.borderSpacing = "0.4rem";
            table.style.borderRadius = ".5rem";
            table.style.padding = "0 0.1rem 0 0.1rem";

            tableCell =  document.getElementsByClassName("boardCell");
            for(let i = 0; i < 9; i++){
                tableCell[i].style.borderRadius = "0.2rem";
                tableCell[i].style.padding = "12.5%";
            }
        },1000);

        let match = document.getElementById("match");
        let timer = document.getElementById("timer");
        setTimeout(()=>{
            table.style.animation = `finishTable linear 1.2s forwards`;
            match.style.animation = 'finishMatch linear 1.2s forwards';
            timer.style.animation = "finishTimer linear 1.2s forwards";
        }, 2000);
        
        setTimeout(()=>{ 
            let finish = document.getElementsByClassName("finished")[0];
            let endMenu = document.getElementsByClassName('menuContainer')[0];
            endMenu.style = 'display: inline-grid; left: 50vw; margin-left: -10rem; position: absolute;';
            finish.style.opacity = "100%"; 
        },3200);
    }

    //Creates a new game by creating a new board and starting a new timer
    createGame() {
        this.game = new Board();
        this.match = this.generateMatch();
        this.timer = new StopWatch();
        let timerElement = document.getElementById("timer");
        this.timer.start(timerElement);

        this.displayMatch();
        this.displayBoard();
        
        let interval = setInterval(() => {
            this.updateBoard();
            if (this.isFinished()) {
                this.timer.stop();
                this.displayWin();
                clearInterval(interval);
            }
        }, 10);
    }

    //Starts the a copy of the game's board [multiplayer]
    startWCopy(board) {
        let counter = document.getElementById("counter");
        let container = document.getElementById("countContainer");
        container.style.display = "block";
        let num = Number.parseInt(counter.innerHTML);

        let countInterval = setInterval(() => {
            num--;
            if (num === 0) {
                clearInterval(countInterval);
                container.style.display = "none";
                this.createGame(board);
                this.showGame();
            } else {
                document.getElementById("counter").innerHTML = num;
            }
        }, 1000);
        return true;
    }

    //Creates a new game by using a copied board and starting a new timer
    createWBoard(board) {
        this.game = board;
        this.match = this.generateMatch();
        this.timer = new StopWatch();
        let timerElement = document.getElementById("timer");
        this.timer.start(timerElement);

        this.displayMatch();
        this.displayBoard();
        
        let interval = setInterval(() => {
            this.updateBoard();
            if (this.isFinished()) {
                this.timer.stop();
                this.displayWin();
                clearInterval(interval);
            }
        }, 10);
    }
    
}