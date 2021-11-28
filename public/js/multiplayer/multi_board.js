const ColorTheme = require('./multi_ColorTheme');
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

    //Moves the cell horizontally or vertically and returns true 
    // if the move was successful and false otherwise
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
        
        if(!this.canMove(pos)) return false;
        
        let [x,y] = pos;
        let color = this.board[x][y];
        let row = this.board[x];

        let empty = null;
        for(let i = 0; i < row.length; i++){
            if(row[i] === EMPTY_TILE) empty = i;
        }
        
        if(empty !== null){
            // console.log(row, {empty: empty, y: y})
            if(empty > y && empty-1 === y) {
                let emptyCell = row[empty];
                row[empty] = row[y];
                row[y] = emptyCell;
                this.board[x] = row;
                // console.log(row, "single: left left")
            } else if (y >= empty && empty+1 === y){
                let emptyCell = row[empty];
                row[empty] = row[y];
                row[y] = emptyCell;
                this.board[x] = row;
                // console.log(row,"single: right right")
            } else if(empty > y && empty-1 !== y){
                let start = [...row].splice(0,y)
                let inner = [...row].splice(y,empty);
                if(y === 0) inner = [...row].splice(y,empty+1);
                let end = [...row].splice(empty+1,BOARD_SIZE)
                let curr = inner.pop();         
                inner.unshift(curr);
                this.board[x] = [...start, ...inner,...end];
                // console.log(this.board[x],"group: left left")
            } else if (y >= empty && empty+1 !== y){
                let start = [...row].splice(0,empty);
                let inner = [...row].splice(empty,y+1);
                let end = [...row].splice(y+1,BOARD_SIZE);
                if(empty === 1 && y === 3) inner = [...row].splice(empty,y);
                let curr = inner.shift();
                inner.push(curr);
                this.board[x] = [...start, ...inner,...end];
                // console.log(this.board[x],"group: right right")
            }
        } else {
            let transpose = this.transpose([...this.board]);
            let col = transpose[y];
            for(let i = 0; i < col.length; i++){
                if(col[i] === EMPTY_TILE) empty = i;
            }
            // console.log(col, {empty: empty, x: x})
            if(empty > x && empty-1 === x){
                let emptyCell = col[empty];
                col[empty] = col[x];
                col[x] = emptyCell;
                transpose[y] = col;
                // console.log(col, "single: left up")
            } else if(x >= empty && empty+1 === x){
                let emptyCell = col[empty];
                col[empty] = col[x];
                col[x] = emptyCell;
                transpose[y] = col;
                // console.log(col, "single: left down")
            } else if(empty > x  && empty-1 !== x){
                let start = [...col].splice(0,x)
                let inner = [...col].splice(x,empty);
                if(x === 0) inner = [...col].splice(x,empty+1);
                let end = [...col].splice(empty+1,BOARD_SIZE)
                let curr = inner.pop();         
                inner.unshift(curr);
                transpose[y] = [...start, ...inner,...end];
                // console.log(transpose[y], "group: up left")
            } else if(x >= empty && empty+1 !== x){
                let start = [...col].splice(0,empty)
                let inner = [...col].splice(empty,x+1);
                let end = [...col].splice(x+1,BOARD_SIZE)
                if(empty === 1 && x === 3) inner = [...col].splice(empty,x)
                let curr = inner.shift();
                inner.push(curr);
                transpose[y] = [...start, ...inner,...end];
                // console.log(transpose[y],"group: down right")
            }
            this.board = this.transpose(transpose);
            // console.log(empty,[y,x],color)
        }
        return true;
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

module.exports = Board;
// let board = new Board();

// left slide: vertical [tested]
// board.swapCell([4,4],[3,4]);
// board.print();
// board.moveCell([0,4])
// board.moveCell([1,4])
// board.moveCell([2,4])
// board.moveCell([3,4])
// board.moveCell([4,4]) 

// right slide: vertical [tested]
// board.print();
// board.moveCell([0,4])
// board.moveCell([1,4])
// board.moveCell([2,4])
// board.moveCell([3,4])

// left slide: horizontal [tested]
// board.swapCell([4,4],[4,4]);
// board.print();
// board.moveCell([4,0])
// board.moveCell([4,1])
// board.moveCell([4,2])
// board.moveCell([4,3])

// right slide: horizontal [tested]
// board.swapCell([4,4],[4,0]);
// board.print();
// board.moveCell([4,1])
// board.moveCell([4,2])
// board.moveCell([4,3])
// board.moveCell([4,4])

// board.swapCell([4,4],[4,1]);
// board.print();
// board.moveCell([4,2])
// 1 e 2 3 4 -> 1 2 e 3 4

// board.print();