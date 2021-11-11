const ColorTheme = require('./colorTheme'); 

const MAX_TILE = 4;
const TOTAL_TILES = 25;
const BOARD_SIZE = 5;
const MAX_COLORS = 6;
const MATCH_SIZE = 3;
const EMPTY_TILE = ' ';

class Board {
    
    constructor(){
        this.board = null;
        this.theme = new ColorTheme();
        this.randomFill()
    }

    //Returns the current board
    getBoard(){ return this.board;  }

    //Creates a randomly generated 9 x 9 board that the player has to match
    createMatch(){
        let colorSet = this.createColorSet();
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

    //Fills the board with all the colored tiles
    randomFill(){
        if(!this.theme.isValid()) return new Error("The theme is invalid!");
        let colorSet = this.createColorSet();
        
        let board = new Array();
        for(let i = 0; i < BOARD_SIZE; i++){
            let row = new Array();
            for(let j = 0; j < BOARD_SIZE; j++){
                if(colorSet.length > 0){
                    let c = Math.floor(Math.random() * colorSet.length);
                    row.push(colorSet[c]);
                    colorSet.splice(c,1);
                }
            }
            if(i === BOARD_SIZE-1) row.push(EMPTY_TILE);
            board.push(row);
        }
        
        this.board = board;
    }

    // Generates all the possibilities of what kind of color a tile could be
    // Returns a color array that represents the probability 
    createColorSet(){
        let colorSet = new Array();
        for(let i = 0; i < MAX_COLORS; i++){
            for(let j = 0; j < MAX_TILE; j++){
                colorSet.push(this.theme.get()[i]);
            }
        }
        return colorSet;
    }

    // Resets all the board tiles
    reset(){
        for(let i = 0; i < BOARD_SIZE; i++){
            for(let j = 0; j < BOARD_SIZE; j++){
                this.board[i][j] = null;
            }
        }
    }

    // Prints the board out to the console
    print(){ console.log(this.board)}
}

let board = new Board();
console.log(board.createMatch());
board.print();