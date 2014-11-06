var Option = function () {
  var ctx = Map.ctx()
  var open = false;
  var fightmenu = createImage('assets/menuFight.png');
  this.select = function() {
    open = !open
  }
  this.open = function () {
    return open
  }
  this.render = function () {
    ctx.drawImage(fightmenu, 200, 335);
    ctx.fillStyle = "rgb(255, 255, 255)";
    ctx.font = "18px Helvetica";
    ctx.textAlign = "left";
    ctx.textBaseline = "top";
    ctx.fillText("Mouse Throw", 245, 355);
    ctx.fillText("Keyboard Smash", 245, 395);
  }
}

var characterList = function (hero, enemy) {
  var ctx = Map.ctx(),
      listImage = createImage('assets/characterListFight.png'),
      hero = hero,
      enemy = enemy;

  this.render = function() {
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

    ctx.fillText(hero.name(), 315, 355);
    if (hero.hpPercent() < (1/3)){
      ctx.fillStyle = "rgb(255, 0, 0)";
    }
    ctx.fillText(hero.hp(), 365, 355);
    

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

var throwMouse = function() {
  var mouse = createImage('assets/mouse.png'),
      x = 100,
      y = 90;
  this.moveRight = function(position){
    x += 5
  }
  this.moveLeft = function(position){
    x -= 5
  }
  this.setX = function(postion){
    x = postion
  }
  this.sety = function(postion){
    y = postion
  }
  this.getX = function(){
    return x
  }
  this.getY = function(){
    return y
  }
  this.render = function(){
   Map.ctx().drawImage(mouse, x, y);
  }
}

var FightScene = function(hero, enemy, index) {
  var ctx = Map.ctx(),
      fightBg = createImage('assets/fightScreen2.png'),
      fightmenu = createImage('assets/menuFight.png'),
      pointer = createImage('assets/glovePoint.png'),
      attackText = createImage('assets/attackText.png'),
      blink = true,
      open = false,
      action = false,
      damageShow = false,
      victory = false,
      heroTurn = true,
      pointerY = 355,
      answerOption = new Option(),
      charList = new characterList(hero, enemy),
      mouse = new throwMouse(),
      enemyMouse = new throwMouse(),
      enemyIndex = index,
      damage;

  enemyMouse.setX(400)

  this.hero = hero
  var enemy = enemy

  function damageHit(dmg, vctm) {
    damage = dmg;
    damageShow = true;
    victim = vctm;
    setTimeout(function(){damageShow = false}, 400)
  }

  this.enemyIndex = function(){
    return enemyIndex
  }

  this.isOpen = function() {
    return open
  }

  this.start = function() {
    setInterval(function(){
      blink = !blink
    }, 400);
  }

  this.pointerDown = function() {
    pointerY = 395
  }
  this.pointerUp = function() {
    pointerY = 355
  }
  this.select = function() {
    open = !open;
  }
  this.attack = function() {
    action = !action;
  }

  this.render = function() {
    var enemyX = 400,
        enemyY = 90,
        heroX = 90,
        heroY = 90;

    

    if(enemy.hp() <= 0 && !victory){
      victory = true
      setTimeout(function(){
        Map.killEnemy(enemyIndex)
        Map.setFight(false)
      }, 2000)
    }

    ctx.drawImage(fightBg, 0, 0);
    ctx.drawImage(fightmenu, 0, 335);
    charList.render()
    ctx.drawImage(attackText, 70, 355);

    if(victory) {
      ctx.fillStyle = "rgb(255, 0, 0)";
      ctx.font = "36px Helvetica";
      ctx.textAlign = "left";
      ctx.textBaseline = "top";
      ctx.fillText("Victory!!", 190, 90);
    } else {
      if(damageShow){
        ctx.fillStyle = "rgb(255, 0, 0)";
        ctx.font = "18px Helvetica";
        ctx.textAlign = "left";
        ctx.textBaseline = "top";
        if(victim === "hero"){
          ctx.fillText("-"+damage, 90, 50);
        } else if (victim === "enemy"){
          ctx.fillText("-"+damage, 400, 50);
        }
        if (heroTurn){
          heroX = heroX + (5*Math.random())
          heroX = heroX - (5*Math.random())
          heroY = heroY + (2*Math.random())
          heroY = heroY - (2*Math.random())
        } else {
          enemyX = enemyX + (5*Math.random())
          enemyX = enemyX - (5*Math.random())
          enemyY = enemyY + (2*Math.random())
          enemyY = enemyY - (2*Math.random())
        }
      }
      if(action && heroTurn) {
        if (mouse.getX() < 400){
          mouse.moveRight()
          mouse.render()
        } else {
          action = false
          heroTurn = false
          var dmgHit = (3+Math.floor(Math.random()*7))
          damageHit(dmgHit, "enemy")
          enemy.damage(dmgHit)
          mouse.setX(90)
        }
      }
      if(open && heroTurn){
        answerOption.render()      
        if(blink && !action){
          ctx.drawImage(pointer, 195, pointerY);
        }
      } else {
        if(blink && heroTurn && !action){
          ctx.drawImage(pointer, 15, pointerY);
        }
      }

      if(!heroTurn && !damageShow){
        if (enemyMouse.getX() > 100){
          enemyMouse.moveLeft()
          enemyMouse.render()
        } else {
          heroTurn = true
          var dmgHit = (3+Math.floor(Math.random()*7))
          damageHit(dmgHit, "hero")
          hero.damage(dmgHit)
          enemyMouse.setX(400)
        }
      }

      ctx.drawImage(Hero.image(), heroX, heroY);
      ctx.drawImage(enemy.image(), enemyX, enemyY);
    }
  }
}