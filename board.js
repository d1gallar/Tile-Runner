const MAX_COLORS = 6;
const MAX_TILE = 4;
const TOTAL_TILES = 25;
const BOARD_SIZE = 5;
const DEFAULT_COLORS = ["R", "Y", "B", "G", "O", "W"]
const EMPTY_COLOR = '';
const EMPTY_TILE = ' ';

class Board {
    constructor(){
        this.board = null;
        this.colors = DEFAULT_COLORS;
        this.randomFill()
    }

    //Fills the board with all the colored tiles
    randomFill(){
        if(!this.checkColors()) return new Error("Failed to fill the board!");
        let visited = new Set();
        let colorSet = new Array();
        for(let i = 0; i < MAX_COLORS; i++){
            for(let j = 0; j < MAX_TILE; j++){
                colorSet.push(this.colors[i]);
            }
        }
        
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

    //Checks if all the colors have been selected
    checkColors(){
        let missing = this.colors.filter(x => x === EMPTY_COLOR);
        if(missing.length > 0) {
            console.log(`WARNING: Missing ${missing.length}/${MAX_COLORS} colors!`)
            return false;
        }
        return true;
    }

    // Adds a color onto the board if there are any available spots. If all 
    // colors have been selected, it does not add the color!
    addColor(color){
        for(let i = 0; i < MAX_COLORS; i++){
            if(this.colors[i] === EMPTY_COLOR){
                this.colors[i] = color;
                return true;
            }
        }
        console.log('There are no available spots to add a new color!')
        return false;
    }
    
    // Sets the color at the specified index. 
    setColor(color, i){
        if(i > MAX_COLORS || i < 0) {
            console.log(`Failed to set ${color} onto the`,
            `board since ${i} is out of range.`)
        }
        this.color[i] = color;
    }

    // Resets all the board colors
    resetColors(){
        this.colors = new Array(MAX_COLORS).fill(EMPTY_COLOR);
    }

    // Resets all the board tiles
    reset(){
        for(let i = 0; i < BOARD_SIZE; i++){
            for(let j = 0; j < BOARD_SIZE; j++){
                this.board[i][j] = null;
            }
        }
    }

    print(){ console.log(this.board)}
}

let board = new Board();
board.print();
