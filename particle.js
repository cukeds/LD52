let Particle = function(originX, originY){
    this.origin  = {
        x: originX,
        y: originY
    }
    this.x = originX;
    this.y = originY;
    this.size = game.randInt(10,1);
    this.color = "red";
    this.xSpeed = Math.random() * 21 - 10;
    this.ySpeed = Math.random() * 21 - 10;
    this.gravity = game.randInt(10) < 2;
    if(this.gravity){
        this.ySpeed -= 10;
    }

    this.update = function(){
        this.x += this.xSpeed * game.delta / 100;
        this.y += this.ySpeed * game.delta / 100;

        if(this.gravity){
            this.ySpeed += game.delta/100;
        }

        //if it leaves the screen respawn at origin
        if(this.x > game.width || this.x < 0 || this.y > game.height || this.y < 0){
            this.x = this.origin.x;
            this.y = this.origin.y;
            this.xSpeed = Math.random() * 21 - 10;
            this.ySpeed = Math.random() * 21 - 10;
        }
    }

    this.draw = function(){
        game.artist.drawRect(this.x, this.y,this.size, this.size,this.color);
    }
}