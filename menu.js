let Menu = function(){
  this.x = 0;
  this.y = 0;
  this.width = game.width;
  this.height = game.height;
  this.color = 'white';
  this.hasLoaded = false;
  this.buttons = [];
  this.boxes = [];
  this.controller = game.controller;
}

let Button = function(params){
  let keys = Object.keys(params);
  keys.forEach(key =>{
    this[key] = params[key];
  })

  this.update = function(){
    if(this.isClicked() && this.callback !== undefined){
      this.callback();
    }
    if(this.isRightClicked() && this.rightClickCallback !== undefined){
      this.rightClickCallback();
    }
  }

  this.isClicked = function(){
    return game.controller.isObjClicked(this);
  }

  this.isRightClicked = function(){
    return game.controller.isObjRightClicked(this);
  }

  this.draw = function(){
    if(this.text !== undefined){
      game.artist.drawRect(this.x,this.y,this.width,this.height,'white');
      game.artist.drawRectOutline(this.x,this.y,this.width,this.height,'black');
      game.artist.writeTextFit(this.text, this.x+10, this.y, this.height -this.height/2, this.width,'black')
    }

    if(this.image !== undefined){
      game.artist.drawImage(game.images[this.image],this.x,this.y,this.width,this.height);
    }
  }
}

let Box = function(params){
  let keys = Object.keys(params);
  keys.forEach(key =>{
    this[key] = params[key];
  })

  this.update = function(){

  }



  this.isDroppedOn = function(){
    if( game.controller.x > this.x &&
        game.controller.x < this.x + this.width &&
        game.controller.y > this.y &&
        game.controller.y < this.y + this.height){
          return this;
    }else{
      return null;
    }
  }

  this.draw = function(){
    // game.artist.drawRect(this.x,this.y,this.width,this.height,'white');
    // game.artist.drawRectOutline(this.x,this.y,this.width,this.height,'black');
    // game.artist.writeTextFit(this.text, this.x+10, this.y+5, 20, this.width,'black')
    if(this.text !== undefined){
      game.artist.drawRect(this.x,this.y,this.width,this.height,'white');
      game.artist.drawRectOutline(this.x,this.y,this.width,this.height,'black');
      game.artist.writeTextFit(this.text, this.x+10, this.y+5, this.height -5, this.width,'black')
    }

    if(this.image !== undefined){
      game.artist.drawImage(game.images[this.image],this.x,this.y,this.width,this.height);
    }
  }
}

let Menus = {
  introMenu:{
    load: function(){
      Menu.apply(this);
      this.name = "introMenu";
      game.maestro.playMusic("background-intro");
      game.maestro.playVoice("chicky");
      this.buttons.push(new Button({
        x: 0,
        y: 0,
        width: 300,
        height: 75,
        text: "Continue",
        callback: function(){
          game.maestro.playMusic("music1");
          game.maestro.stopVoice("chicky");
          game.enterMenu(Menus.itemsMenu.load());
        }
      }))

      return this;
    },
    update: function(){
      this.buttons.forEach(btn =>{
        btn.update();
      })
    },
    draw: function(){
      game.artist.drawImage(game.images["background-intro"], 0, 0,game.width,game.height)
      game.artist.drawImage(game.images["chicky"], game.width / 2, 0, 458, 648)
      game.artist.drawRect(50, 150, 700, (CONFIG.INTROTEXT.split(" ").length - 1) % 33 * 10)
      game.artist.writeTextFit(CONFIG.INTROTEXT, 50, 150, 24, 700, "white")

      this.buttons.forEach(btn =>{
        btn.draw();
      })

    }
  },
  startMenu:{
    load: function(){
      Menu.apply(this);
      this.name = "startMenu";

      this.buttons.push(new Button({
        x: 500,
        y: 500,
        width: 600,
        height: 150,
        text: "Start Game",
        callback: function(){
          game.enterMenu(Menus.introMenu.load());
        }
      }))

      this.hasLoaded = true;
      return this;
    },
    update: function(){
      this.buttons.forEach(btn =>{
        btn.update();
      })
    },
    draw: function(){
      //game.artist.drawRect(0,0,game.width,game.height,'white');
      game.artist.drawRectOutline(5,5,game.width-10,game.height-10,'black')

      this.buttons.forEach(btn =>{
        btn.draw();
      })

    }
  },
  messageMenu: {
    load: function(message,sound){
      Menu.apply(this);
      this.name = "Message";
      this.message = message;

      this.buttons.push(new Button({
        x: game.width/2 + 5,
        y: (game.height * 3 / 4) + 15,
        width: game.width / 6 - 5,
        height: 50,
        text: 'Okay',
        callback: function(){
          if(sound !== undefined){
            game.maestro.stopVoice(sound);
          }
          game.exitMenu();
          game.nextTurn();
        }
      }));

      if(sound !== undefined){
        this.buttons.push(new Button({
          x: game.width/2 - game.width/6,
          y: (game.height * 3 / 4) + 15,
          width: game.width / 6 - 5,
          height: 50,
          text: 'Play Audio',
          callback: function(){
            game.maestro.playVoice(sound);
          }
        }));
      }


      return this;
    },
    update: function(){
      this.buttons.forEach(btn =>{
        btn.update();
      })
    },
    draw: function(){
      //game.artist.clearCanvas();
      //Message
      game.artist.drawRect(game.width/3, game.height/4, game.width/3, game.height/2, '#ccc');
      game.artist.drawRectOutline(game.width/3, game.height/4, game.width/3, game.height/2, '#000');
      game.artist.writeTextFit(this.message, game.width/3 + 5, game.height/4 +5, 24, game.width/3 - 10, 'black');

      //okay button
      this.buttons.forEach(btn =>{
        btn.draw();
      })
    }
  },
  itemsMenu:{
    load: function(){
      Menu.apply(this);
      this.name = "itemsMenu";
      this.ui = [];
      let menuLeft = 2*game.width/3;
      let menuTop = 3*game.height/4;
      let menuWidth = game.width/3-5;
      let menuHeight = game.height/4-5;
      let self = this;


      let positions = [
        {x: 45, y: 36},
        {x: 215, y: 95},
        {x: 380, y: 225},
        {x: 490, y: 360},
        {x: 560, y: 540}
      ]
      game.player.items.forEach( function (item , index) {
        self.buttons.push(
            new Button({
              id: item.id,
              x: positions[index].x,
              y: positions[index].y,
              width: 120,
              height: 80,
              image: item.type.toLowerCase(),
              callback: function(){
                if (self.ui.length > 5){
                  for(let i = 0; i <= self.ui.length - 5; i++) self.ui.pop();
                }
                self.ui.push(
                    new Ui({
                      x: 800,
                      y: item.name.length > 10 ? 80 : 0,
                      width: item.name.length > 10 ? 500 : 120,
                      text: item.name,
                      textSize: item.name.length > 10 ? 40 : 60,
                      textColor: "white"
                    })
                )
                self.ui.push(
                    new Ui({
                      x: 800,
                      y: 150,
                      width: 500,
                      text: `${item.description} You think you could sell it for $${item.apparentVal}`,
                      textSize: 35,
                      textColor: "black"
                    })
                )
              }
            })
        )

        self.ui.push(
            // Generate price
            new Ui({
              id: item.id,
              x: positions[index].x + 40,
              y: positions[index].y - 20,
              width: 120,
              text: `$${item.apparentVal.toString()}`,
              textSize: 20,
              textColor: "white"
            })
        )

      });


      this.buttons.push(new Button({
        x: menuLeft + 2,
        y: menuTop + 2,
        width: menuWidth - 4,
        height: (menuHeight/4) - 4,
        text: 'Wait for customer',
        callback: function(){
          game.enterMenu(Menus.customerMenu.load());
        }
      }));

      return this;
    },
    update: function(){
      this.buttons.forEach(btn =>{
        btn.update();
      })

      if(game.player.items.length === 0){
        game.enterMenu(Menus.pushGame.load());
      }
    },
    draw: function(){

      game.artist.drawImage(game.images["background-main"], 0, 0, game.width, game.height)

      game.artist.writeTextFit(`$${game.player.money.toString()}`, 20, game.height - 100, 40, 300, "lightgreen")


      this.buttons.forEach(btn =>{
        btn.draw();
      })

      this.ui.forEach(ui =>{
        ui.draw();
      })

    },

    reload: function() {
      let checkButtons = this.buttons.filter(btn => btn.id !== undefined).filter(
          btn => game.player.items.filter(item => item.id === btn.id).length === 0);
      checkButtons.length > 0 ? checkButtons[0].toRemove = true : void(0);
      this.buttons = this.buttons.filter(btn => btn.toRemove !== true);

      let checkUi = this.ui.filter(el => game.player.items.filter(item => item.id === el.id).length === 0);
      checkUi.length > 0 ? checkUi[0].toRemove = true : void(0);
      this.ui = this.ui.filter(el => el.toRemove !== true);
    }
  },
  customerMenu:{
    load: function(){
      Menu.apply(this);
      this.name = "customerMenu";
      this.ui = [];
      this.customer = CUSTOMERS.Generic();
      let menuLeft = 2*game.width/3;
      let menuTop = 3*game.height/4;
      let menuWidth = game.width/3-5;
      let menuHeight = game.height/4-5;
      let self = this;


      let positions = [
        {x: 45, y: 36},
        {x: 215, y: 95},
        {x: 380, y: 225},
        {x: 490, y: 360},
        {x: 560, y: 540}
      ]
      game.player.items.forEach( function (item , index) {
        self.buttons.push(
            new Button({
              id: item.id,
              x: positions[index].x,
              y: positions[index].y,
              width: 120,
              height: 80,
              image: item.type.toLowerCase(),
              callback: function(){
                console.log("I'm trying to be sold!!!");
              }
            })
        )

        self.ui.push(
            // Generate price
            new Ui({
              id: item.id,
              x: positions[index].x + 40,
              y: positions[index].y - 20,
              width: 120,
              text: `$${item.apparentVal.toString()}`,
              textSize: 20,
              textColor: "white"
            })
        )


      });


      this.buttons.push(new Button({
        x: menuLeft + 2,
        y: menuTop + 2,
        width: menuWidth - 4,
        height: (menuHeight/5) - 4,
        text: 'Compliment',
        callback: () => !this.customer.closing ? this.customer.react("compliment") : void(0)
        }
      ));

      this.buttons.push(new Button({
        x: menuLeft + 2,
        y: menuTop + menuHeight/5 + 2,
        width: menuWidth - 4,
        height: (menuHeight/5) - 4,
        text: 'Hook',
        callback: () => !this.customer.closing ? this.customer.react("hook") : void(0)
      }));

      this.buttons.push(new Button({
        x: menuLeft + 2,
        y: menuTop + menuHeight/5 * 2 + 2,
        width: menuWidth - 4,
        height: (menuHeight/5) - 4,
        text: 'Insult',
        callback: () => !this.customer.closing ? this.customer.react("insult") : void(0)
      }));

      this.buttons.push(new Button({
        x: menuLeft + 2,
        y: menuTop + menuHeight/5 * 3 + 2,
        width: menuWidth - 4,
        height: (menuHeight/5) - 4,
        text: 'Reverse Psychology',
        callback: () => !this.customer.closing ? this.customer.react("reverse") : void(0)
      }));

      this.buttons.push(new Button({
        x: menuLeft + 2,
        y: menuTop + menuHeight/5 * 4 + 2,
        width: menuWidth - 4,
        height: (menuHeight/5) - 4,
        text: 'Close the deal',
        callback: () => !this.customer.closing ? this.customer.close() : void(0)
      }));
      return this;
    },
    update: function(){

      this.customer.update();
      this.buttons.forEach(btn =>{
        btn.update();
      })

      let checkButtons = this.buttons.filter(btn => btn.id !== undefined).filter(btn => game.player.items.filter(item => item.id === btn.id).length === 0);
      checkButtons.length > 0 ? checkButtons[0].toRemove = true : void(0);
      this.buttons = this.buttons.filter(btn => btn.toRemove !== true);

      let checkUi = this.ui.filter(el => game.player.items.filter(item => item.id === el.id).length === 0);
      checkUi.length > 0 ? checkUi[0].toRemove = true : void(0);
      this.ui = this.ui.filter(el => el.toRemove !== true);
    },
    draw: function(){

      game.artist.drawImage(game.images["background-main"], 0, 0, game.width, game.height)

      game.artist.writeTextFit(`$${game.player.money.toString()}`, 20, game.height - 100, 40, 300, "lightgreen")

      this.customer.draw();
      this.buttons.forEach(btn =>{
        btn.draw();
      })

      this.ui.forEach(ui =>{
        ui.draw();
      })


      let btn = this.buttons.find(btn => btn.id === this.customer.item.id);
      if(btn !== undefined){
        game.artist.drawImage(game.images["circle"], btn.x, btn.y, 120, 80);
      }
    }
  },
  pushGame:{
    load: function(){
      Menu.apply(this);
      this.name = "pushGame";
      let menuLeft = 2*game.width/3;
      let menuTop = 3*game.height/4;
      let menuWidth = game.width/3-5;
      let menuHeight = game.height/4-5;
      let url = `${CONFIG.URL}#${game.player.getInformationString()}-m${game.player.money}-r${game.round + 1}`

      this.buttons.push(new Button({
            x: menuLeft + 2,
            y: menuTop + 2,
            width: menuWidth - 4,
            height: (menuHeight/5) - 4,
            text: 'Back to picking uwuuuu',
            callback: () => game.goto(url)
          }
      ));
      return this;
    },
    update: function(){

      this.buttons.forEach(btn =>{
        btn.update();
      })

    },
    draw: function(){

      game.artist.drawImage(game.images["background-main"], 0, 0, game.width, game.height)

      this.buttons.forEach(btn =>{
        btn.draw();
      })

    }
  },
}
