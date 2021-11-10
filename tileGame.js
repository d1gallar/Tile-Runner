class TileGame {
    constructor(){
        this.game = new Board();
        this.inProgress = false;
        this.timer = new StopWatch();
    }

    restart(){
        this.game = new Board();
        this.inProgress = false;
        this.timer.reset();
    }

    pause(){
        this.inProgress = false;
        this.timer.stop();
    }

    start(){
        this.inProgress = true;
        this.timer.start();
        while(inProgress){

        }
    }
}