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
  clickToStart:{
    load: function(menu){
      Menu.apply(this);
      this.name = "startMenu";

      this.buttons.push(new Button({
        x: game.width/2 - 150,
        y: game.height/2,
        width: 300,
        height: 80,
        text: "Start Game",
        callback: function(){
            game.enterMenu(menu.load());
        }
      }))
      this.buttons.push(new Button({
        x:20,
        y:3*game.height/4 - 100,
        width: 200,
        height: 50,
        text: "Music+",
        callback:function(){
          game.musicVolume = Math.min(game.musicVolume + 5, 100);
          localStorage.musicVolume = game.musicVolume;
          game.maestro.playMusic('music1');
        }
      }));

      this.buttons.push(new Button({
        x:20,
        y:3*game.height/4 - 100 + 52,
        width: 200,
        height: 50,
        text: "Music-",
        callback:function(){
          game.musicVolume = Math.max(game.musicVolume - 5, 0);
          localStorage.musicVolume = game.musicVolume;
          game.maestro.playMusic('music1');
        }
      }));

      this.buttons.push(new Button({
        x:20,
        y:3*game.height/4 - 100 + 52 + 52,
        width: 200,
        height: 50,
        text: "SFX+",
        callback:function(){
          if(game.maestro.music){
            game.maestro.pauseMusic();
          }
          game.sfxVolume = Math.min(game.sfxVolume + 5, 100);
          localStorage.sfxVolume = game.sfxVolume;
          game.maestro.playVoice('angry1');
        }
      }));

      this.buttons.push(new Button({
        x:20,
        y:3*game.height/4 - 100 + 52 + 52 + 52,
        width: 200,
        height: 50,
        text: "SFX-",
        callback:function(){
          if(game.maestro.music){
            game.maestro.pauseMusic();
          }
          game.sfxVolume = Math.max(game.sfxVolume - 5, 0);
          localStorage.sfxVolume = game.sfxVolume;
          game.maestro.playVoice('bad2');
        }
      }));
      return this;
    },
    update: function(){
      this.buttons.forEach(btn =>{
        btn.update();
      })
    },
    draw: function(){
      game.artist.drawImage(game.images["beginning"], 0, 0, game.width, game.height);

      this.buttons.forEach(btn => {
        btn.draw();
      });
    }
  },
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
      game.maestro.playMusic("win-music");
      this.name = "startMenu";

      this.buttons.push(new Button({
        x: 900,
        y: 650,
        width: 400,
        height: 100,
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
      game.artist.drawImage(game.images["start"], 0, 0, game.width, game.height);


      this.buttons.forEach(btn => {
        btn.draw();
      });
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
      game.maestro.playMusic("music1");


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
              id: index,
              item_id: item.id,
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
              id: index,
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

      if(game.player.items.length === 0 && game.player.money < 10000 && game.round < 5){
        game.enterMenu(Menus.pushGame.load());
      }
      else if (game.player.money >= 10000){
        game.enterMenu(Menus.wonGame.load());
      }else if(game.round >= 5 && game.player.items.length === 0){
        game.enterMenu(Menus.lostGame.load());
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
      this.buttons = [];
      this.load();
    }
  },
  customerMenu:{

    button_action: function(action){
      if(this.cooldown > 0)
        return;
      else{
        if(action === "close"){
          !this.customer.closing ? this.customer.close() : void(0);
        }
        else{
          !this.customer.closing ? this.customer.react(action) : void(0);
          this.cooldown = this.maxCooldown;
        }
      }
    },

    load: function(){
      Menu.apply(this);
      this.name = "customerMenu";
      this.cooldown = 0;
      this.maxCooldown = 1000;
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
              id: index,
              item_id: item.id,
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
              id: index,
              item_id: item.id,
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
        callback: () => this.button_action("compliment")
        }
      ));

      this.buttons.push(new Button({
        x: menuLeft + 2,
        y: menuTop + menuHeight/5 + 2,
        width: menuWidth - 4,
        height: (menuHeight/5) - 4,
        text: 'Upsell',
        callback: () => this.button_action("hook")
      }));

      this.buttons.push(new Button({
        x: menuLeft + 2,
        y: menuTop + menuHeight/5 * 2 + 2,
        width: menuWidth - 4,
        height: (menuHeight/5) - 4,
        text: 'Insult',
        callback: () => this.button_action("insult")
      }));

      this.buttons.push(new Button({
        x: menuLeft + 2,
        y: menuTop + menuHeight/5 * 3 + 2,
        width: menuWidth - 4,
        height: (menuHeight/5) - 4,
        text: 'Reverse Psychology',
        callback: () => this.button_action("reverse")
      }));

      this.buttons.push(new Button({
        x: menuLeft + 2,
        y: menuTop + menuHeight/5 * 4 + 2,
        width: menuWidth - 4,
        height: (menuHeight/5) - 4,
        text: 'Close the deal',
        callback: () => this.button_action("close")
      }));
      return this;
    },
    update: function(){
      this.cooldown -= game.delta;
      this.customer.update();
      this.buttons.forEach(btn =>{
        btn.update();
      })
      if(this.customer.removeItem){
        this.buttons = this.buttons.filter(btn => btn.id !== game.pickedItem);
        this.ui = this.ui.filter(ui => ui.id !== game.pickedItem);
        this.customer.removeItem = false;
      }
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


      let btn = this.buttons.find(btn => btn.id === game.pickedItem);
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
            text: 'Back to picking for another day',
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
  wonGame:{
    load: function(){
      Menu.apply(this);
      this.name = "pushGame";
      let menuLeft = 2*game.width/3;
      let menuTop = 3*game.height/4;
      let menuWidth = game.width/3-5;
      let menuHeight = game.height/4-5;
      game.maestro.playMusic("win-music");
      game.maestro.playVoice("win");
      this.buttons.push(new Button({
            x: menuLeft + 2,
            y: menuTop + 2,
            width: menuWidth - 4,
            height: (menuHeight/5) - 4,
            text: 'OMG I FINALLY GET TO DATE YOU :D',
            callback: () => {
              game.maestro.stopAllVoices();
              game.enterMenu(Menus.credits.load());
            }
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


      game.artist.drawImage(game.images["background-intro"], 0, 0, game.width, game.height)
      game.artist.drawImage(game.images["chicky-love"], game.width / 2, 0, 458, 648)
      game.artist.drawRect(50, 150, 700, (CONFIG.WINTEXT.split(" ").length - 1) % 33 * 10)
      game.artist.writeTextFit(CONFIG.WINTEXT, 50, 150, 24, 700, "white")
      this.buttons.forEach(btn =>{
        btn.draw();
      })

    }
  },
  lostGame:{
    load: function(){
      Menu.apply(this);
      this.name = "pushGame";
      let menuLeft = 2*game.width/3;
      let menuTop = 3*game.height/4;
      let menuWidth = game.width/3-5;
      let menuHeight = game.height/4-5;

      game.maestro.playVoice("lose");
      game.maestro.playMusic("lose-music");
      this.buttons.push(new Button({
            x: menuLeft + 2,
            y: menuTop + 2,
            width: menuWidth - 4,
            height: (menuHeight/5) - 4,
            text: "Oh no, I promise I WILL harvest $10000 next time yessss",
            callback: () => {
              game.maestro.stopAllVoices();
              game.enterMenu(Menus.credits.load())
            }
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

      game.artist.drawImage(game.images["background-intro"], 0, 0, game.width, game.height)
      game.artist.drawImage(game.images["chicky-angry"], game.width / 2, 0, 458, 648)
      game.artist.drawRect(50, 150, 700, (CONFIG.LOSETEXT.split(" ").length - 1) % 30 * 10)
      game.artist.writeTextFit(CONFIG.LOSETEXT, 50, 150, 24, 700, "white")
      this.buttons.forEach(btn =>{
        btn.draw();
      })
      this.buttons.forEach(btn =>{
        btn.draw();
      })

    }
  },
  credits:{
    load: function(){
      Menu.apply(this);
      return this;
    },
    update: function(){


    },
    draw: function(){

      game.artist.drawImage(game.images["credits"], 0, 0, game.width, game.height)

      this.buttons.forEach(btn =>{
        btn.draw();
      })

    }
  },
}
