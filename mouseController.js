let MouseController = function(canvas){
  this.x = 0;
  this.y = 0;

  this.justClicked = false;
  this.isClicked = false;
  this.isReleased = true;

  this.justRightClicked = false;
  this.isRightClicked = false;
  this.isRightReleased = true;

  this.state = 'none';

  this.isObjClicked = function(obj){
    return this.justClicked &&
    this.x > obj.x &&
    this.x < obj.x + obj.width &&
    this.y > obj.y &&
    this.y < obj.y + obj.height;
  }

  this.isObjRightClicked = function(obj){
    return this.justRightClicked &&
    this.x > obj.x &&
    this.x < obj.x + obj.width &&
    this.y > obj.y &&
    this.y < obj.y + obj.height;
  }

  this.update = function(){
    game.controller.justClicked = false;
    game.controller.justRightClicked = false;

    if(!this.isClicked){
      this.isReleased = false;
    }
    if(!this.isRightClicked){
      this.isRightReleased = false;
    }
  }

  this.update = function(){
    game.controller.justClicked = false;
    game.controller.justRightClicked = false;

    if(!this.isClicked){
      this.isReleased = false;
    }
    if(!this.isRightClicked){
      this.isRightReleased = false;
    }
  }

  this.getMousePos = function(e) {
    let canvas = game.artist.canvas;
    let rect = canvas.getBoundingClientRect();
    return {
        x: (e.clientX - rect.left) / (rect.right - rect.left) * canvas.width,
        y: (e.clientY - rect.top) / (rect.bottom - rect.top) * canvas.height
    }
  }

  canvas.addEventListener('mousedown', function(e){
    if(e.button == 2){
      game.controller.justRightClicked = true;
      game.controller.isRightClicked = true;
      game.controller.isRightReleased = false;
      e.preventDefault();
    }else{
      game.controller.justClicked = true;
      game.controller.isClicked = true;
      game.controller.isReleased = false;
    }
  })

  canvas.addEventListener('contextmenu', function(e){
    e.preventDefault();
  },false)

  canvas.addEventListener('mouseup', function(e){
    if(e.button == 2){
      game.controller.isRightClicked = false;
      game.controller.isRightReleased = true;
    }else{
      game.controller.isClicked = false;
      game.controller.isReleased = true;
    }
  })

  canvas.addEventListener('mousemove', function(e){
    if(game.controller.isClicked){
      game.artist.drawRect(game.controller.x, game.controller.y, 10,10, '#0F0');
    }
    
    let pos = game.controller.getMousePos(e)
    
    game.controller.x = pos.x;
    game.controller.y = pos.y;

    // let tooltip = document.getElementsByClassName('tooltip')[0];
    // tooltip.classList.add('display');
    // tooltip.style.top = game.controller.y + 25 + 'px';
    // tooltip.style.left = game.controller.x + 25 + 'px';
  })

  canvas.addEventListener('mouseout', function(e){
    document.getElementsByClassName('tooltip')[0].classList.remove('display');
  })
}
