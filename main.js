var game = {
  width: 1280,
  height: 720,
  artist: null,
  images: [],
  player: null,
  round: 0,
  maestro: null,
  controller: null,
  delta: 0,
  menus: [],
  musicVolume: 15,
  sfxVolume: 20,
  voiceVolume: 20,
  sounds: [],
  music: [],
  voices: [],

	load: function(){
    this.artist = new Artist(this.width,this.height);
    this.maestro = new Maestro();
    this.controller = new MouseController(this.artist.canvas);
    this.artist.drawRect(0,0,this.width,this.height,"#aaa");
    
    let imageNames = ["background-main", "antique", "gun", "jewelry", "painting", "plant", "technology", "tool", "circle", "chicky", "background-intro"];
    for(let i = 1; i <= 3; i++){
      imageNames.push(`hat${i}`);
      imageNames.push(`body${i}`);
      imageNames.push(`face${i}`);
      imageNames.push(`head${i}`);
    }

    ////////////////////  Images
    imageNames.forEach(img => {
      this.images[img] = this.artist.loadImg('./assets/' + img + '.png');
    })
    ////////////////////  SFX
    let soundNames = [];
    soundNames.forEach(snd =>{
      this.sounds[snd] = this.maestro.loadSound(snd);
    })
    ///////////////////   Music
    let musicNames = [];
    musicNames.forEach(mus =>{
      this.music[mus] = this.maestro.loadSound(mus);
    })
    ///////////////////   Voices
    let voiceNames = [];

    for(let i = 1; i < 4; i++){
      voiceNames.push(`enter${i}`);
      voiceNames.push(`bad${i}`);
      voiceNames.push(`good${i}`);
      voiceNames.push(`angry${i}`);
    }
    voiceNames.forEach(voice =>{
      this.voices[voice] = this.maestro.loadSound(voice);
    })

    if(localStorage.sfxVolume !== undefined){
      game.sfxVolume = Number(localStorage.sfxVolume);
    }
    if(localStorage.musicVolume !== undefined){
      game.musicVolume = Number(localStorage.musicVolume);
    }
    if(localStorage.voiceVolume !== undefined){
      game.voiceVolume = Number(localStorage.voiceVolume);
    }


    this.player = new Player();

    //read URL

      this.loadFromUrl(window.location.href)
      //add Items to player



    //load customers


    this.start();
	},

  start: function(){

    let loaded = true;
    let loadCount = 0;

    Object.keys(this.images).forEach(img => {
      if(this.images[img].ready === false){
        loaded = false;
        loadCount++;
      }
    })
    Object.keys(this.sounds).forEach(snd => {
      if(this.sounds[snd].ready === false){
        loaded = false;
        loadCount++;
      }
    })
    Object.keys(this.music).forEach(mus => {
      if(this.music[mus].ready === false){
        loaded = false;
        loadCount++;
      }
    })
    Object.keys(this.voices).forEach(voc => {
      if(this.voices[voc].ready === false){
        loaded = false;
        loadCount++;
      }
    })

    if(loaded === false){
      //draw loading screen
      game.artist.drawRect(0,0,game.width,game.height, 'black')
      game.artist.writeText('Things to load: ' + loadCount, 50,50,50,'white');
      window.requestAnimationFrame(game.start.bind(this));
    }else{
      //start game
      this.update();
    }
	},

	update: function(tstamp){

    this.delta = tstamp - this.timestamp;
    this.timestamp = tstamp;

    if(this.menus.length > 0){
      this.menus[this.menus.length - 1].update();
    }else{
      //ran out of menus
      console.log("Ran out of menus");
    }

    //controller update has to be last
    this.controller.update();
    this.draw();
	},

	draw: function(){
    this.artist.drawRect(0,0,game.width,game.height,'#78787F');

    if(this.menus.length > 0){
      this.menus[this.menus.length - 1].draw();
    }else{
      this.artist.drawRect(0,0,game.width,game.height, 'red');
      console.log('Something went wrong!');
    }

    this.artist.drawRect(game.controller.x-1, game.controller.y-1, 3,3,'red');

    window.requestAnimationFrame(game.update.bind(game));
	},

  enterMenu: function(menu){
    this.menus.push(menu);
  },

  exitMenu: function(){
    game.menus.pop();
    game.menus[game.menus.length-1].reload()
  },

  getCurMenu: function(){
    return this.menus[this.menus.length - 1];
  },

  getMenuByName: function(name){
    return this.menus.find(menu =>{
      return menu.name === name;
    })
  }, 

  randInt: function(range, start = 0){
    return Math.floor(Math.random() * range) + start;
  },

  parseItem: function(id, quality){

    let item = new Item()
    item.id = id;
    item.name = ITEMS[id - 1].name;
    item.baseVal = ITEMS[id - 1].baseValue;
    item.apparentVal = Math.round(((this.randInt(quality * 2) - quality) / 100 * item.baseVal + item.baseVal) / 10) * 10;
    item.type = ITEMS[id - 1].type;
    item.description = ITEMS[id - 1].description;
    item.specialFlag = ITEMS[id - 1].specialFlag;
    item.quality = quality;
    return item;
  },

  loadFromUrl: function (url){


    let segments = url.split("#")

    if(segments === 1){
      return; // Empty url
    }
    let hash = segments[segments.length - 1]
    let parts = hash.split("-")


    if (parts.length === 1) {
      console.log(this.randInt(5) + 1)
      this.player.items.push(this.parseItem(this.randInt(5) + 1, 2))
      this.player.items.push(this.parseItem(this.randInt(5, 5) + 1, 2))
      this.player.items.push(this.parseItem(this.randInt(5, 10) + 1, 2))
      this.player.items.push(this.parseItem(this.randInt(5, 15) + 1, 2))
      this.player.items.push(this.parseItem(this.randInt(5, 20) + 1, 2))
      this.menus.push(Menus.startMenu.load());
      return;
    }
    if (parts.length < 3) {
      alert("Wrong url");
      return;
    }

    let url_items = parts[0].split("i")
    url_items.forEach(item => {
      if(item !== ""){
        let sp = item.split("q");
        let i = Number(sp[0])
        let q = Number(sp[1])

        if(i === 0){
          this.enterMenu(Menus.pushGame.load());
        }
        this.player.items.push(this.parseItem(i, q));
      }
    })

    this.player.money =  Number(parts[1].split("m")[1])
    this.round = Number(parts[2].split("r")[1])

    if(this.round === 0){
      this.menus.push(Menus.startMenu.load());
    }
    else{
      this.menus.push(Menus.itemsMenu.load());
    }
  },

  goto(url){
    window.location.replace(url);
  }

}

window.addEventListener('load', function(){
  game.load();
})