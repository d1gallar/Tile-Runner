class StopWatch {
    constructor(){
        this.time = 0; // current time
        this.running = false; // whether the timer is on
    }

    //Resets the stop watch
    reset(){
        this.running = false;
        this.time = 0;
        document.getElementById("demo").innerHTML = this.toString(this.time);
    }

    // Stops the stop watch
    stop(){ 
        this.running = false;
    }

    // Starts the stop watch
    start(){ 
        this.running = true; 
        let milsec = 0;
        let format = 
        setInterval(() => {
            milsec += 10;
            if(this.running === true){
                this.time += 1000;
                document.getElementById("demo").innerHTML = this.toString(this.time);
            }
        },10);
    }

    //Converts the current time (in ms) to a string format [min:sec.ms]
    toString(time){
        let min = time / (1000 * 60 * 60) | 0;
        let sec = time % (1000 * 60 *60) / (1000 * 60) | 0;
        let ms = time % (1000 * 60) / 1000 | 0;
            
        var checkTime = (time) => {
            return ( time < 10 ? "0" : "" ) + time;
        }

        min = checkTime(min);
        sec = checkTime(sec);

        return `${min}:${sec}.${ms}`;
    }
}

let timer = new StopWatch();
document.getElementById("start").onclick = () =>{ timer.start(); } 
document.getElementById("stop").onclick = () =>{ timer.stop(); }
document.getElementById("reset").onclick = () => {timer.reset();}
// setTimeout(()=>{timer.stop()}, 5000);
