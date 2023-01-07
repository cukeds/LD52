let Ui = function(args){
    this.x = args.x;
    this.y = args.y;
    this.width = args.width;
    this.height = args.height;
    this.image = args.image;
    this.text = args.text;
    this.textSize = args.textSize;
    this.textColor = args.textColor;

    this.update = function(){

    }

    this.draw = function(){
        if(this.text !== undefined){
            game.artist.writeTextFit(this.text, this.x, this.y, this.textSize, this.width, this.textColor);
        }
        if(this.image !== undefined){
            game.artist.drawImage(this.image, this.x, this.y, this.width, this.height);
        }
    }



}

