const ColorTheme = require('./colorTheme');
// import ColorTheme from "./colorTheme.js";

const MAX_TILE = 4;
const TOTAL_TILES = 25;
const BOARD_SIZE = 5;
const MAX_COLORS = 6;
const EMPTY_TILE = 'EMPTY';

class Board {
// export default class Board {
    
    constructor(){
        this.board = null;
        this.theme = new ColorTheme();
        this.randomFill()
    }

    //Returns the current board
    getBoard(){ 
        if(this.board === null){
            if(board === null){
                return console.log(new Error("Board has not been created!"))
            }
        }
        return this.board;  
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

    // Finds the position of the empty cell within the board. Returns [x,y]
    getEmptyCell(){
        for(let i = 0; i < BOARD_SIZE; i++){
            for(let j = 0; j < BOARD_SIZE; j++){
                if(this.board[i][j] === EMPTY_TILE){
                    return [i, j];
                }
            }
        }
        return console.log(
            new Error('Empty cell was not found in the board.'));
    }

    //Moves the cell horizontally or vertically and returns the new board
    moveCell(pos){
        if(!(pos instanceof Array)){
            return console.log(
                new Error("Could not move the cell. Positions are not arrays!"))
        } 
        if(pos.length !== 2){
            return console.log(
                new Error("Could not move the cell."+
                "Positions should be [x,y].!"))
        }
        
        if(!this.canMove(pos)) return;
        
        let [x,y] = pos;
        let color = this.board[x][y];
        let row = this.board[x];

        let empty = null;
        for(let i = 0; i < row.length; i++){
            if(row[i] === EMPTY_TILE) empty = i;
        }
        
        if(empty !== null){
            console.log(this.board[x])
            let horizontal;
            console.log(empty,y)
            if(empty >= y){
                horizontal = row.splice(y, empty);
                console.log("ge",horizontal)
                let curr = horizontal.pop();
                horizontal.unshift(curr);
                this.board[x] = [...row,...horizontal]
            } else {
                let start = [...row].splice(0, empty)
                let inner = [...row].splice(empty,y-1);
                let end = [...row].splice(y+1,row.length)
                let curr = inner.shift();
                inner.push(curr);
                this.board[x] = [...start, ...inner,...end];
            }
            console.log(empty,[y,x],color)
        } else {
            let transpose = this.transpose([...this.board]);
            let col = transpose[y];
            for(let i = 0; i < col.length; i++){
                if(col[i] === EMPTY_TILE) empty = i;
            }
            let vertical;
            if(empty > x){
                vertical = col.splice(x, empty);
                let curr = vertical.pop();
                vertical.unshift(curr);
                transpose[y] = [...col,...vertical];
                
            } else{
                vertical = col.splice(x+1, empty);
                let curr = vertical.shift();
                vertical.push(curr);
                transpose[y] = [...vertical, ...col];
            }
            this.board = this.transpose(transpose);
            console.log(empty,[y,x],color)
        }
        return this.board;
    }

    //Takes in a cell position [x,y] and checks whether the user can move it
    canMove(cellPos){
        if(!(cellPos instanceof Array)) {
            return console.log(new Error("The cell position is not an array!"))
        }
        let [x, y] = cellPos;
        if(x < 0 || x >= BOARD_SIZE || y < 0 || y >= BOARD_SIZE) return false;
        let color = this.board[x][y];
        let [emptyX,emptyY] = this.getEmptyCell();
        if(x !== emptyX && y !== emptyY) return false;
        if(x === emptyX && y === emptyY) return false; // can't move empty tile

        for(let i = 0; i < BOARD_SIZE; i++){
            for(let j = 0; j < BOARD_SIZE; j++){
                if(i === emptyX || j === emptyY){
                    if(x === i && y === j){
                        return true;
                    }  
                }
            }
        }
        return false;
    }

    //Finds the transpose of the board
    transpose(matrix){
        let transpose = [];
        for(let i = 0; i < matrix.length; i++){
            for(let j = 0; j < matrix[0].length; j++){
                if(matrix[i][j] === undefined) continue;
                if(transpose[j] === undefined) transpose[j] = [];
                transpose[j][i] = matrix[i][j];
            }
        }
        return transpose;
    }

    // Uses the board's position of two different cells and swaps the values
    swapCell(posOne,posTwo){
        if(!(posOne instanceof Array) || !(posTwo instanceof Array)){
            return console.log(
                new Error("Could not swap cells. Positions are not arrays!"))
        } 

        if(posOne.length !== 2 || posTwo.length !== 2){
            return console.log(
                new Error("Could not swap cells. Positions should be [x,y].!"))
        }
        let [x1,y1] = posOne;
        let [x2,y2] = posTwo;
        let temp = this.board[x2][y2];
        this.board[x2][y2] = this.board[x1][y1];
        this.board[x1][y1] = temp;
    }

    // Prints the board out to the console
    print(){ console.log(this.board)}
}

let board = new Board();
board.swapCell([4,4],[4,0]);
board.print();
// vertical
// board.moveCell([4,3])
// board.moveCell([4,2])
// board.moveCell([4,1])
// board.moveCell([4,0])

// horizontal
// board.moveCell([0,4])
// board.moveCell([1,4])
// board.moveCell([2,4])
// board.moveCell([3,4])
board.moveCell([4,1])

board.print();
// console.log(board.moveCell([3,4]))
// board.print();