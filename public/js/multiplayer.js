import TileGame from './tileGame.js';

let finished = document.getElementById('finish');
let board = document.getElementById('board');
let match = document.getElementById('match');
let timer = document.getElementById('timer');
let body = document.getElementsByTagName('body')[0];
let menu = document.getElementsByClassName('menuContainer')[0];

let forceWin = document.getElementById('win');
forceWin.addEventListener("click", ()=>{
    game.forceWin();
});

let game = new TileGame();
let winner = false;
// let socket = io('http://localhost:3000');
const socket = io('http://192.168.1.121:3000/');

socket.emit('join-game-room', room);
socket.on('players-ready', (playerCount,board) => {
    if(playerCount == 2){
        game.startWCopy(board);
    }
});

let isGameDone = setInterval(()=>{
    if(isFinished() === 0){
        winner = true;
        socket.emit('game-finished', room);
        clearInterval(isGameDone);
    }
},10);

socket.on('display-end-game', ()=>{
    if(!winner){
        displayLoss();
        console.log('you lost!')
    } else {
        displayWin();
        console.log('you won!')
    }
    socket.emit('leave-room', room);
    socket.emit('leave-all');
});

socket.on('error-full-lobby', (error) =>{
    console.log('full')
    location.href = '/room/'+room+'/error';
});

function displayLoss(){
    body.style.backgroundColor = "#f25c5c";

    finished.style.opacity = "1";
    finished.innerText = "You have lost to your opponent!";
    finished.style.fontSize = "3rem";
    finished.style.marginLeft  = "-20rem";
    finished.style.top = "25vh";
    
    
    board.style.display = "none";
    match.style.display = "none";
    timer.style.display = "none";

    menu.style.display = "inline-grid";
    menu.style.left = "50vw";
    menu.style.marginLeft = "-10rem";
    menu.style.position = "absolute";
    menu.style.top = "35vh";
}

function displayWin(){
    body.style.backgroundColor = "#11ce98";

    setTimeout(()=>{
        finished.style.opacity = "1";
    }, 3500);

    finished.innerText = "You won against your opponent!";
    finished.style.fontSize = "2.5rem";
    finished.style.marginLeft  = "-16rem";
}

function isFinished(){
    let match = document.getElementsByClassName('matchCell');
    let remaining = 9;
    let board = [
        document.getElementById('7'),
        document.getElementById('8'),
        document.getElementById('9'),
        document.getElementById('12'),
        document.getElementById('13'),
        document.getElementById('14'),
        document.getElementById('17'),
        document.getElementById('18'),
        document.getElementById('19')
    ]

    if(match[0].style.backgroundColor === '' 
        || board[0].style.backgroundColor === ''){
            return remaining;
    }
    
    let i = 0;
    for(let cell of match){
        let matchColor = cell.style.backgroundColor;
        let boardColor = board[i].style.backgroundColor;
        if(matchColor === boardColor){
            remaining--;
        } 
        i++;
    }

    return remaining;
}