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
  this.removeItem = false;

  this.react = function(action){
    this.actionModifiers[action] >= 1 ? this.priceModifier += 0.15 : this.actionModifiers[action] > 0.5 ? this.priceModifier -= 0.15 : this.priceModifier -= 0.3;
    this.actionModifiers[action] >= 1 ? game.maestro.playVoice(`good${game.randInt(3)+1}`) : game.maestro.playVoice(`bad${game.randInt(3)+1}`);
    this.actionModifiers[action] > 0 ? this.actionModifiers[action] -= 0.2 : this.actionModifiers[action] = 0;
    this.sellingPrice = Math.max(Math.round(this.item.apparentVal * this.priceModifier), 1);

    this.patience--;
  }

  this.close = function(){
    game.player.money += this.sellingPrice;
    this.removeItem = true;
    this.closing = true;
  }

  this.steal = function(){
    game.player.items = game.player.items.filter(item => item.id !== this.item.id);
    for(let i = 0; i < 300; i++){
      this.explodingParticles.push(new Particle(850, 150));
    }
    game.maestro.playVoice(`angry${game.randInt(3)+1}`)
    this.removeItem = true;
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
        if(this.patience === 1){
          this.explodingParticles.push(new Particle(850, 150, "orange"));
        }
        this.dialogue = `Dang I really want that ${this.item.name}, I'm willing to pay $${this.sellingPrice} right now oh yeahhhh`
      } else if(this.patience === 0){
        this.dialogue = `NEVERMIND YOUR STUPID SELLING, I'LL JUST TAKE ${this.item.name} FOR $0!!!!!!!!`
        if (this.triggered === 0) {
          this.steal();
          this.triggered = 1500;
        }
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
    this.explodingParticles.forEach(particle => particle.update());
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
      let height = (this.dialogue.split(" ").length / 5) * 30
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
    let index = game.randInt(game.player.items.length);
    game.pickedItem = index;
    let item = game.player.items[index];
    let sellingPrice = item.apparentVal * 0.8;
    let keys =  Object.keys(PERSONALITIES);
    let body = `body${game.randInt(3) + 1}`;
    let hat = `hat${game.randInt(3) + 1}`;
    let face = `face${game.randInt(3) + 1}`;
    let head = `head${game.randInt(3) + 1}`;
    let actionModifiers;
    if(hat == "hat1" && face == "face1"){
      actionModifiers = PERSONALITIES.Angry;
    }
    if(hat == "hat2" && face == "face1"){
      actionModifiers = PERSONALITIES.Annoying;
    }
    if(hat == "hat3" && face == "face1"){
      actionModifiers = PERSONALITIES.Karen;
    }
    if(hat == "hat1" && face == "face2"){
      actionModifiers = PERSONALITIES.Pushover;
    }
    if(hat == "hat2" && face == "face2"){
      actionModifiers = PERSONALITIES.Hookable;
    }
    if(hat == "hat3" && face == "face2"){
      actionModifiers = PERSONALITIES.Happy;
    }
    if(hat == "hat1" && face == "face3"){
      actionModifiers = PERSONALITIES.Kooky;
    }
    if(hat == "hat2" && face == "face3"){
      actionModifiers = PERSONALITIES.Shy;
    }
    if(hat == "hat3" && face == "face3"){
      actionModifiers = PERSONALITIES.Blushy;
    }

    return new Customer({
      name: `${FIRST_NAMES[game.randInt(FIRST_NAMES.length)]} "${NICKNAMES[game.randInt(NICKNAMES.length)]}" ${LAST_NAMES[game.randInt(LAST_NAMES.length)]}`,
      body: body,
      hat: hat,
      face: face,
      head: head,
      item: item,
      sellingPrice: sellingPrice,
      maxPatience: game.randInt(4, 6),
      actionModifiers: actionModifiers
    })
  }
}


PERSONALITIES = {
  Hookable: {
    compliment: 1.1,
    hook: 1.3,
    insult: 0.3,
    reverse: 0.8,
  },
  Blushy: {
    compliment: 1.5,
    hook: 0.6,
    insult: 0.1,
    reverse: 1,
  },
  Pushover: {
    compliment: 0.1,
    hook: 1,
    insult: 1.5,
    reverse: 1.1,
  },
  Annoying: {
    compliment: 0.9,
    hook: 0.9,
    insult: 0.9,
    reverse: 0.9,
  },
  Karen: {
    compliment: 1.1,
    hook: 0.6,
    insult: 0.1,
    reverse: 1.5
  },
  Angry: {
    compliment: 1.3,
    hook: 0.4,
    insult: 0.1,
    reverse: 0.1,
  },
  Kooky: {
    compliment: 1.2,
    hook: 0.7,
    insult: 0.4,
    reverse: 1.2
  },
  Shy: {
    compliments: 0.7,
    hook: 1.3,
    insult: 0.4,
    reverse: 1
  },
  Happy: {
    compliment: 1.1,
    hook: 1.1,
    insult: 1.1,
    reverse: 1.1
  }

}
