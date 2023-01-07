let Ui = function(){
    this.x = 0;
    this.y = 0;
    this.width = 0;
    this.height = 0;
    this.textSize = 0;

    this.update = function(){

    }

    this.draw = function(){
        if(this.text !== undefined){
            game.artist.writeTextFit(this.text, this.x, this.y, this.textSize, this.width);
        }
        if(this.image !== undefined){
            game.artist.drawImage(this.image, this.x, this.y, this.width, this.height);
        }
    }



}

