export default class StopWatch {
    constructor(){
        this.time = 0; // current time
        this.format = "00:00.00"; // formatted string
        this.running = false; // whether the timer is on
    }

    //Returns the formatted string
    getFormat(){ return this.format }

    //Resets the stop watch
    reset(linkElement = null){
        this.running = false;
        this.time = 0;
        if(linkElement) linkElement.innerHTML = "00:00.00";
        this.format = "00:00.00";
    }

    // Stops the stop watch
    stop(){ 
        this.running = false;
    }

    // Starts the stop watch
    start(linkElement=null){ 
        let milsec = 0;
        this.running = true;
        setInterval(() => {
            milsec += 10;
            if(this.running === true){
                this.time += 1000;
                this.format = this.toString(this.time);
                if(linkElement !== null) {
                    linkElement.innerHTML = this.format;
                }
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