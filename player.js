let Player = function(){
  this.items = [];
  this.information = [];
  this.money = 100;

  this.update = function(){

  }

  this.draw = function(){

  }

  this.getInformationString = function(){
    let str = "";
    if(this.information.length > 0){
      this.information.forEach(info => {
        str += "i" + info;
      })
    }
    else{
      str = "i0";
    }
    return str;
  }

}

