let Customer = function(){
  this.money = 0;
  this.body = "";
  this.face = "";
  this.hat = "";
  this.head = "";


  this.update = function(){
   
  }

  this.draw = function(){
    game.artist.drawImage(game.images[this.body], 700, 50, 275, 540);
    game.artist.drawImage(game.images[this.head], 725, 95, 215, 150);
    game.artist.drawImage(game.images[this.face], 720, 95, 215, 150);

    if(this.hat === "hat2"){

      game.artist.drawImage(game.images[this.hat], 720, 65, 215, 150);
    }
    else{
      game.artist.drawImage(game.images[this.hat], 720, 95, 215, 150);
    }
  }

  
}

