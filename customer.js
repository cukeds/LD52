let Customer = function(args){
  this.item = args.item;
  this.name = args.name;
  this.body = args.body;
  this.face = args.face;
  this.hat = args.hat;
  this.head = args.head;
  this.offsetX = 640;
  this.offsetY = 0;
  this.showDialogue = false;
  this.maxPatience = args.maxPatience
  this.patience = this.maxPatience;
  this.triggered = 0;
  this.closing = false;
  this.start = true;
  this.sellingPrice = args.sellingPrice;
  this.dialogue = "";
  this.priceModifier = 1;
  this.actionModifiers = args.actionModifiers;
  this.explodingParticles = [];

  this.react = function(action){
    this.actionModifiers[action] > 1 ? this.priceModifier += 0.07 : this.priceModifier -= 0.15;
    this.actionModifiers[action] > 1 ? game.maestro.playVoice(`good${game.randInt(3)+1}`) : game.maestro.playVoice(`bad${game.randInt(3)+1}`);
    this.actionModifiers[action] > 0 ? this.actionModifiers[action] -= 0.2 : this.actionModifiers[action] = 0;
    this.sellingPrice = Math.round(this.item.apparentVal * this.priceModifier)

    this.patience--;
  }

  this.close = function(){
    game.player.money += this.sellingPrice;
    this.closing = true;
  }

  this.steal = function(){
    game.player.items = game.player.items.filter(item => item.id !== this.item.id);
    for(let i = 0; i < 300; i++){
      this.explodingParticles.push(new Particle(850, 150));
    }
    game.maestro.playVoice(`angry${game.randInt(3)+1}`)
  }

  this.exit = function(){
    game.maestro.stopAllVoices();
    game.exitMenu();
  }



  this.update = function(){
    if(this.closing){
      this.offsetX += game.delta / 3;
      if(this.offsetX > 640){
        game.player.items = game.player.items.filter(item => item.id !== this.item.id);
        this.exit();
      }
    }
    else {
      if (this.offsetX > 0) {
        this.offsetY = game.randInt(20);
        this.offsetX -= game.delta / 3;
      } else {
        this.offsetY = game.randInt(this.maxPatience * 3 - this.patience * 3);
        this.patience > 2 ? this.offsetX = 0 : this.offsetX = game.randInt(10 - this.patience);
        this.showDialogue = true;
      }

      if (this.patience > 0) {
        this.dialogue = `Dang I really want that ${this.item.name}, I'm willing to pay $${this.sellingPrice} right now oh yeahhhh`
      } else {
        this.dialogue = `NEVERMIND YOUR STUPID SELLING, I'LL JUST TAKE ${this.item.name} FOR $0!!!!!!!!`
        if (this.triggered === 0) {
          this.steal();
          this.triggered = 1500;
        }
        this.explodingParticles.forEach(particle => particle.update());
        this.triggered -= game.delta;
        if (this.triggered < 0) {
          this.exit();
        }

      }
    }
    if(this.start){
      this.start = false;
      game.maestro.playVoice(`enter${game.randInt(3)+1}`);
    }
  }

  this.draw = function(){
    game.artist.writeTextFit(this.name, 700, 10, 40, 600, "white")

    game.artist.drawImage(game.images[this.body], this.offsetX + 700, this.offsetY + 50, 275, 540);
    game.artist.drawImage(game.images[this.head], this.offsetX + 730, this.offsetY + 95, 215, 150);
    game.artist.drawImage(game.images[this.face], this.offsetX + 720, this.offsetY + 95, 215, 150);

    if(this.hat === "hat2"){
      game.artist.drawImage(game.images[this.hat], this.offsetX + 720, this.offsetY + 45, 235, 150);
    }
    else{
      game.artist.drawImage(game.images[this.hat], this.offsetX + 720, this.offsetY + 95, 215, 150);
    }

    if(this.showDialogue){
      let height = (this.dialogue.split(" ").length) * 5.3
      game.artist.drawRect(950, 100, 300, height, "white");
      game.artist.writeTextFit(this.dialogue, 950, 100, 20, 300, "black")
    }

    this.explodingParticles.forEach(particle=> particle.draw());
  }


}
FIRST_NAMES = [
  "Bob", "Robert", "Patrick", "Lola", "Scrappy", "Johnny", "John", "Honey", "Mort"
]

LAST_NAMES = [
    "Scrapyard", "Moneybags", "Hardworker", "Smith", "Snow", "Golddigger"
]

NICKNAMES = [
    "Baby", "The Destroyer", "Extreme Popper", "WTF", "Lil Bro"
]

CUSTOMERS = {
  Generic: function (){
    let item = game.player.items[game.randInt(game.player.items.length)];
    let sellingPrice = item.apparentVal * 0.8;
    let keys =  Object.keys(PERSONALITIES);
    return new Customer({
      name: `${FIRST_NAMES[game.randInt(FIRST_NAMES.length)]} "${NICKNAMES[game.randInt(NICKNAMES.length)]}" ${LAST_NAMES[game.randInt(LAST_NAMES.length)]}`,
      body: `body${game.randInt(3) + 1}`,
      hat: `hat${game.randInt(3) + 1}`,
      face: `face${game.randInt(3) + 1}`,
      head: `head${game.randInt(3) + 1}`,
      item: item,
      sellingPrice: sellingPrice,
      maxPatience: game.randInt(4, 6),
      actionModifiers: PERSONALITIES[keys[game.randInt(keys.length)]]
    })
  }
}


PERSONALITIES = {
  Hookable: {
    compliment: 1.1,
    hook: 1.3,
    insult: 0.3,
    reverse: 0.5,
  },
  Blushy: {
    compliment: 1.5,
    hook: 0.5,
    insult: 0.1,
    reverse: 1,
  },
  Pushover: {
    compliment: 0.1,
    hook: 1,
    insult: 1.4,
    reverse: 1.3,
  },
  Annoying: {
    compliment: 1,
    hook: 0.1,
    insult: 0.1,
    reverse: 1.6,
  }
}
