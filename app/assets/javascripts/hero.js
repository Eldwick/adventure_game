var Hero = function () {
  this.ready = false
  this.image = createImage("assets/hero2.png")
  this.speed = 256
  this.startHP = 400
  this.hp = 400
  this.name = "Guy"
  this.attackOptions = new Option({
      pointerX: 15, 
      pointerY: 355, 
      selections:[{text: "Throw Mouse", type: "projectile", useLimit: 50}, 
                  {text: "Floppy Disk", type: "projectile", useLimit: 2}]
    })
  this.itemOptions = new Option({
      pointerX: 15, 
      pointerY: 395, 
      selections:[{text: "Beer", type: "item", useLimit: 2}, 
                  {text: "Coffee", type: "item", useLimit: 2}]
      })
  this.x;
  this.y;
}

Hero.prototype = {
  hpPercent: function () {
    return this.hp/this.startHP
  },
  damage: function(dmg) {
    this.hp -= dmg;
  },
  addHP: function(plus){
    this.hp += plus;
  },
  setY: function(coordinate) {
    this.y = coordinate;
  },
  setX: function(coordinate) {
    this.x = coordinate;
  },
  speed: function() {
    return this.speed;
  }
};


function Option (option_params) {
  this.innerSelected = false,
  this.selections = option_params.selections || [],
  this.currentSelectionIndex = 0,
  this.open = false,
  this.fightmenu = createImage('assets/menuFight.png'),
  this.pointerX = option_params.pointerX,
  this.pointerY = option_params.pointerY,
  this.orginalPointY = option_params.pointerY,
  this.action;

  this.createAction = function(option) {
    if (option.type == "projectile"){
      if (option.text == "Throw Mouse") {
        return new Projectile('assets/mouse.png')
      } else if (option.text == "Floppy Disk") {
        return new Projectile('assets/floppyDisk.png')
      } 
    } else if (option.type == "item") {
      if (option.text == "Coffee") {
        return new Item('assets/coffee.png', {type: "attack", modifier:10})
      } else if (option.text == "Beer") {
        return new Item('assets/beer.png', {type: "hp", modifier:20})
      }
    }
  }
}

Option.prototype = {
  select: function () {
    this.open = !this.open
  },
  open: function () {
    return this.open
  },
  innerSelected: function () {
    return this.innerSelected
  },
  select: function() {
    var currentSelection = this.selections[this.currentSelectionIndex];

    this.pointerY = this.orginalPointY
    if( currentSelection.useLimit > 0) {
      if(this.innerSelected){
        currentSelection.useLimit--
        this.action = this.createAction(currentSelection)
        this.pointerX -= 180
      } else {
        this.pointerX += 180
        this.pointerY = 355
      }
    }
    this.innerSelected = !this.innerSelected
    this.currentSelectionIndex = 0
  },
  pointerDown: function () {
    if(this.currentSelectionIndex < (this.selections.length-1)){
      this.currentSelectionIndex += 1;
      this.pointerY = 355 + (40*this.currentSelectionIndex);
    } else {
      this.pointerY = this.orginalPointY;
      this.currentSelectionIndex = 0;
    }
  },
  pointerUp: function () {
    if(this.currentSelectionIndex > 0){  
      this.currentSelectionIndex--;
      this.pointerY = 355 - (40*this.currentSelectionIndex);
    } else {
      this.pointerY = 355 + (40*(this.selections.length-1));
      this.currentSelectionIndex = this.selections.length-1
    }
  },
  render: function () {
    Map.ctx().fillStyle = "rgb(255, 255, 255)";
    Map.ctx().font = "18px Helvetica";
    Map.ctx().textAlign = "left";
    Map.ctx().textBaseline = "top";
    if (this.innerSelected){
      Map.ctx().drawImage(this.fightmenu, 200, 335);
      var y = 355
      for (i in this.selections){
        Map.ctx().fillText(this.selections[i].text, 245, y);
        Map.ctx().fillText(this.selections[i].useLimit, 365, y);
        y += 40;
      }
    }
  }
}

function characterList(hero, enemy) {
  this.ctx = Map.ctx(),
  this.listImage = createImage('assets/characterListFight.png'),
  this.hero = hero,
  this.enemy = enemy;
}

characterList.prototype = {
  render: function() {
    var ctx = this.ctx,
        hero = this.hero,
        enemy = this.enemy,
        listImage = this.listImage;

    ctx.drawImage(listImage, 200, 335);
    ctx.fillStyle = "rgb(255, 255, 255)";
    ctx.font = "18px Helvetica";
    ctx.textAlign = "right";
    ctx.textBaseline = "top";

    ctx.rect(370, 355, 100, 15);
    ctx.rect(370, 400, 100, 15);
    ctx.lineWidth = 4;
    ctx.strokeStyle = 'black';
    ctx.stroke();
    ctx.fill();

    ctx.fillText(hero.name, 315, 355);
    if (hero.hpPercent() < (1/3)){
      ctx.fillStyle = "rgb(255, 0, 0)";
    }
    ctx.fillText(hero.hp, 365, 355);

    ctx.fillText(enemy.name(), 315, 395);
    if (enemy.hpPercent() < (1/3)){
      ctx.fillStyle = "rgb(255, 0, 0)";
    }
    ctx.fillText(enemy.hp(), 365, 395);
    
    ctx.beginPath();
    ctx.rect(370, 355, (100 * hero.hpPercent()), 15);
    ctx.rect(370, 400, (100 * enemy.hpPercent()), 15);
    ctx.fillStyle = 'green';
    ctx.fill();
  }
}

function Item(path, item_params) {
  this.image = createImage(path);
  this.x = 90;
  this.y = 50;
  if (item_params.type == "attack"){
    this.displayText = "+"+item_params.modifier+" Attack"
    Map.fightScene().setHeroModifier(item_params.modifier)
  } else if (item_params.type == "hp"){
    this.displayText = "+"+item_params.modifier+" HP"
    Map.hero().addHP(item_params.modifier)
  }
}

Item.prototype = {
  render: function () {
    Map.ctx().fillText(this.displayText, this.x + 32, this.y);
    Map.ctx().drawImage(this.image, this.x, this.y);
  }
}

function Projectile(path) {
  this.image = createImage(path);
  this.x = 100;
  this.y = 90;
}

Projectile.prototype = {
  moveRight: function (position) {
    this.x += 5
  },
  moveLeft: function (position) {
    this.x -= 5
  },
  setX: function (postion) {
    this.x = postion
  },
  sety: function (postion) {
    this.y = postion
  },
  getX: function () {
    return this.x
  },
  getY: function () {
    return this.y
  },
  render: function () {
    Map.ctx().drawImage(this.image, this.x, this.y);
  }
}
