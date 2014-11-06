var Hero = function () {
  var ready = false,
      image = new Image(),
      speed = 256,
      startHP = 400,
      hp = 400,
      name = "Guy",
      x,y;

  image.onload = function () {
    ready = true;
  };
  image.src = "assets/hero2.png";
  return {
    hpPercent: function () {
      return hp/startHP
    },
    name: function () {
      return name;
    },
    damage: function(dmg) {
      hp -= dmg;
    },
    hp: function(){
      return hp;
    },
    image: function() {
      return image;
    },
    ready: function() {
      return ready;
    },
    setY: function(coordinate) {
      y = coordinate;
    },
    y: function() {
      return y;
    },
    setX: function(coordinate) {
      x = coordinate;
    },
    x: function() {
      return x;
    },
    speed: function() {
      return speed;
    }
  };
}();