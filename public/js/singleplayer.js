import TileGame from './tileGame.js';

let game = new TileGame();
game.start();

let forceWin = document.getElementById('win');
forceWin.addEventListener("click", ()=>{
    game.forceWin();
});