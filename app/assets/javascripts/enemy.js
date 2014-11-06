var EnemyObj = function (enemy_params) {
  var ready = false,
      image = new Image(),
      name = enemy_params.name,
      startHP = enemy_params.hp,
      hp = enemy_params.hp,
      x = enemy_params.startX,
      y = enemy_params.startY;

  image.onload = function () {
    ready = true;
  };
  image.src = enemy_params.img;
  
  this.hpPercent = function () {
      return hp/startHP
  }
  this.name = function() {
    return name
  }
  this.damage = function(dmg) {
    hp -= dmg;
    if (hp < 0){
      hp = 0
    }
  }
  this.hp = function(){
    return hp;
  }
  this.image = function() {
    return image;
  }
  this.ready = function() {
    return ready;
  }
  this.setY = function(coordinate) {
    y = coordinate;
  }
  this.y = function() {
    return y;
  }
  this.setX = function(coordinate) {
    x = coordinate;
  }
  this.x = function() {
    return x;
  },
  this.render = function() {
    Map.ctx().drawImage(image, x, y)
  }
};