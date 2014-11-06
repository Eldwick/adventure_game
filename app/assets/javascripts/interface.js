var Interface = function (modifier) {
  var coordinate,
      keysDown = {};

  addEventListener("keydown", function (e) {
    if(!(e.keyCode == 13)){
      keysDown[e.keyCode] = true;
    }
  }, false);

  addEventListener("keydown", function (e) {
    if((e.keyCode == 13)){
      if(!Map.fightScene().isOpen()){
        Map.fightScene().select()
      } else {
        Map.fightScene().attack()
        Map.fightScene().select()
      }
    }
  }, true);

  addEventListener("keyup", function (e) {
    delete keysDown[e.keyCode];
  }, false);

  return {
    moveHero: function(modifier) {
      if (38 in keysDown && Hero.y() >= 32) { // Player holding up
        coordinate = Hero.y() - (Hero.speed() * modifier);
        Hero.setY(coordinate);
      }
      if (40 in keysDown && Map.canvas().height-64 > Hero.y()) { // Player holding down
        coordinate = Hero.y() + (Hero.speed() * modifier);
        Hero.setY(coordinate); 
      }
      if (37 in keysDown && Hero.x() >= 32) { // Player holding left
        coordinate = Hero.x() - (Hero.speed() * modifier);
        Hero.setX(coordinate); 
      }
      if (39 in keysDown && Map.canvas().width-64 > Hero.x()) { // Player holding right
        coordinate = Hero.x() + (Hero.speed() * modifier);
        Hero.setX(coordinate); 
      }
    },
    checkCaught: function() {
      for(i in Map.enemies()){
        if (
          Hero.x() <= (Map.enemies()[i].x() + 32)
          && Map.enemies()[i].x() <= (Hero.x() + 32)
          && Hero.y() <= (Map.enemies()[i].y() + 32)
          && Map.enemies()[i].y() <= (Hero.y() + 32)
        ) {
          Map.setFight(true)
          Map.setFightScene(new FightScene(Hero, Map.enemies()[i], i))
          Map.fightScene().start()
        }
      }
    },
    checkThroughDoor: function() {
      doors =  Map.currentTile()["doors"]
      for(doorIndex in doors) {
        door = doors[doorIndex]
        if (
          Hero.x() <= (door.x + 32)
          && door.x <= (Hero.x() + 32)
          && Hero.y() <= (door.y + 32)
          && door.y <= (Hero.y() + 32)
        ) {

          if (door.side === "top") {
            Map.up()
            Hero.setY(Map.canvas().height-65);
          } else if(door.side == "bottom") {
            Map.down()
            Hero.setY(33);
          } else if(door.side == "left") {
            Map.left()
            Hero.setX(Map.canvas().height-65);
          } else if(door.side == "right") {
            Map.right()
            Hero.setX(33);
          }
        }
      }
    },
    movePointer: function() {
      if (38 in keysDown) { // Player holding up
        Map.fightScene().pointerUp()
      }
      if (40 in keysDown) { // Player holding down
        Map.fightScene().pointerDown()
      }
    }
  }
}();


