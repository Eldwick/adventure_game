var Interface = function (modifier) {
  var coordinate,
      keysDown = {};

  addEventListener("keydown", function (e) {
    if(Map.fight()){ // In turn based fight mode
      if (e.keyCode  == 13) { // Player pressed enter
        Map.fightScene().select()
      }
      if (e.keyCode  == 38) { // Player pressed up
        Map.fightScene().pointerUp()
      }
      if (e.keyCode  == 40) { // Player pressed down
        Map.fightScene().pointerDown()
      }
    } else {
      keysDown[e.keyCode] = true;
    }
  }, false);

  addEventListener("keyup", function (e) {
    delete keysDown[e.keyCode];
  }, false);

  return {
    moveHero: function(modifier) {
      if (38 in keysDown && Map.hero().y >= 32) { // Player holding up
        coordinate = Map.hero().y - (Map.hero().speed * modifier);
        Map.hero().setY(coordinate);
      }
      if (40 in keysDown && Map.canvas().height-64 > Map.hero().y) { // Player holding down
        coordinate = Map.hero().y + (Map.hero().speed * modifier);
        Map.hero().setY(coordinate); 
      }
      if (37 in keysDown && Map.hero().x >= 32) { // Player holding left
        coordinate = Map.hero().x - (Map.hero().speed * modifier);
        Map.hero().setX(coordinate); 
      }
      if (39 in keysDown && Map.canvas().width-64 > Map.hero().x) { // Player holding right
        coordinate = Map.hero().x + (Map.hero().speed * modifier);
        Map.hero().setX(coordinate); 
      }
    },
    checkCaught: function() {
      for(i in Map.enemies()){
        if (
          Map.hero().x <= (Map.enemies()[i].x() + 32)
          && Map.enemies()[i].x() <= (Map.hero().x + 32)
          && Map.hero().y <= (Map.enemies()[i].y() + 32)
          && Map.enemies()[i].y() <= (Map.hero().y + 32)
        ) {
          Map.setFight(true)
          Map.setFightScene(new FightScene(Map.hero(), Map.enemies()[i], i))
          Map.fightScene().start()
        }
      }
    },
    checkThroughDoor: function() {
      doors =  Map.currentTile()["doors"]
      for(doorIndex in doors) {
        door = doors[doorIndex]
        if (
          Map.hero().x <= (door.x + 32)
          && door.x <= (Map.hero().x + 32)
          && Map.hero().y <= (door.y + 32)
          && door.y <= (Map.hero().y + 32)
        ) {

          if (door.side === "top") {
            Map.up()
            Map.hero().setY(Map.canvas().height-65);
          } else if(door.side == "bottom") {
            Map.down()
            Map.hero().setY(33);
          } else if(door.side == "left") {
            Map.left()
            Map.hero().setX(Map.canvas().height-65);
          } else if(door.side == "right") {
            Map.right()
            Map.hero().setX(33);
          }
        }
      }
    }
  }
}();


