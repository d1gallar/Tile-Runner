class TileGame {
    constructor(){
        this.game = new Board();
        this.inProgress = false;
        this.timer = new StopWatch();
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

    //Starts a new game by creating a new board and starting a new timer
    start(){
        this.game = new Board();
        this.inProgress = true;
        this.timer.start();
        while(inProgress){

        }
    }
}