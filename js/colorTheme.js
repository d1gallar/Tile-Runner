const DEFAULT_COLORS = ["#0C9AF2", "#A199BF", "#04BFAD", "#F29C50", "#F25C5C", "#EEEEEE"];
const MAX_COLORS = 6;
const EMPTY_COLOR = "EMPTY";

module.exports = class ColorTheme {
// export default class ColorTheme {
    constructor(){
        this.colors = DEFAULT_COLORS;
    }

    //Returns the current theme
    get(){ return this.colors };

    //Checks if there are 6 colors in the theme
    isValid(){
        let missing = this.colors.filter(x => x === EMPTY_COLOR);
        if(missing.length > 0) {
            console.log(
                new Error(`The theme is invalid. Missing`,
                `${missing.length}/${MAX_COLORS} colors!`))
            return false;
        }
        return true;
    }

    // Adds a color onto the theme if there are any available spots. 
    // It inserts the color at the next available spot. If there are no
    // available spots, it does not add the color into the current theme.
    add(color){
        for(let i = 0; i < MAX_COLORS; i++){
            if(this.colors[i] === EMPTY_COLOR){
                this.colors[i] = color;
                return true;
            }
        }
        console.log(
            new Error('There are no available spots to add a new color!'))
        return false;
    }

    // Changes the color at the specified index. 
    setColorAt(color, i){
        if(i > MAX_COLORS || i < 0) {
            console.log(`Failed to set ${color} onto the`,
            `board since ${i} is out of range.`)
        }
        this.color[i] = color;
    }

    // Takes in a theme (an array of 6 colors) and sets it as the new theme
    // XXXXX Work on checking if each element is a "color"
    set(colors){
        if(colors === null){
            return console.log(new Error(`The theme is empty or null!`));
            
        } 
        if(!(colors instanceof Array)){
            return console.log(
                new Error(`The theme is not an array of colors!`));
        }
        if(colors.length !== MAX_COLORS){
            if(colors.length === MAX_COLORS-1){
                return console.log(
                    new Error(`Missing ${MAX_COLORS-colors.length} color!`));
            } else {
                return console.log(
                    new Error(`Missing ${MAX_COLORS-colors.length} colors!`));
            } 
        }
        for(let i = 0; i < MAX_COLORS; i++){
            this.colors[i] = colors[i];
        }
    }

    // Resets the color theme by making it empty
    reset(){
        this.colors = new Array(MAX_COLORS).fill(EMPTY_COLOR);
    }

    // Resets the theme to the default color theme
    resetDefault(){
        this.colors = DEFAULT_COLORS;
    }

    print(){ console.log(this.colors)}
}