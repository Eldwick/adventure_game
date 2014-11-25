var FightScene = function(hero, enemy, index) {
  var ctx = Map.ctx(),
      pointer = createImage('assets/glovePoint.png'),
      heroModifier = 0,
      enemyX = 400,
      enemyY = 90,
      heroX = 90,
      heroY = 90,
      blink = true,
      open = false,
      isFighting = false,
      isUsingItem = false,
      damageShow = false,
      victory = false,
      heroTurn = true,
      pointerY = 355,
      attackOptions = hero.attackOptions,
      charList = new characterList(hero, enemy),
      itemOptions = hero.itemOptions,
      enemyMouse = new Projectile('assets/Bug.png'),
      enemyIndex = index,
      optionMatrix = [
        attackOptions,
        itemOptions
      ],
      currentOptionY = 0,
      currentOption = optionMatrix[currentOptionY],
      projectile,
      damage;

  enemyMouse.setX(400)

  this.hero = hero

  this.enemy = enemy

  function setCurrentOption() {
    currentOption = optionMatrix[currentOptionY]
  }

  function toggleOptionY() {
    if (currentOptionY < (optionMatrix.length-1)) {
      currentOptionY += 1
    } else {
      currentOptionY -= 1
    }
  }

  function damageHit(dmg, vctm) {
    damage = dmg;
    damageShow = true;
    victim = vctm;
    setTimeout(function(){damageShow = false}, 400)
  }

  function renderBG () {
    var fightBg = createImage('assets/fightScreen2.png'),
        fightmenu = createImage('assets/menuFight.png'),
        attackText = createImage('assets/attackText.png'),
        itemText = createImage('assets/itemsText.png');
        
    ctx.drawImage(fightBg, 0, 0);
    ctx.drawImage(fightmenu, 0, 335);
    charList.render()
    ctx.drawImage(attackText, 70, 355);
    ctx.drawImage(itemText, 70, 395);
  }

  function renderVictory () {
    ctx.fillStyle = "rgb(255, 0, 0)";
    ctx.font = "36px Helvetica";
    ctx.textAlign = "left";
    ctx.textBaseline = "top";
    ctx.fillText("Victory!!", 190, 90);
  }

  function renderVictimDamage() {
    ctx.fillStyle = "rgb(255, 0, 0)";
    ctx.font = "18px Helvetica";
    ctx.textAlign = "left";
    ctx.textBaseline = "top";
    if(victim === "hero"){
      ctx.fillText("-"+damage, 90, 50);
      heroX = heroX + (5*Math.random()) - (5*Math.random())
      heroY = heroY + (2*Math.random()) - (2*Math.random())
    } else if (victim === "enemy"){
      ctx.fillText("-"+damage, 400, 50);
      enemyX = enemyX + (5*Math.random()) - (5*Math.random())
      enemyY = enemyY + (2*Math.random()) - (2*Math.random())
    }
  }

  function checkVictory() {
    if(enemy.hp() <= 0 && !victory){
      victory = true
      setTimeout(function () {
        Map.killEnemy(enemyIndex)
        Map.setFight(false)
      }, 2000)
    }
  }

  this.currentOption = function () {
    return currentOption
  }
  this.setHeroModifier = function (modifier) {
    heroModifier += modifier
  }
  this.setProjectile = function (prjctile) {
    projectile = prjctile;
  }
  this.isOpen = function () {
    return open
  }

  this.start = function () {
    setInterval(function () {
      blink = !blink
    }, 400);
  }

  this.pointerDown = function () {
    if(currentOption.innerSelected) {
      currentOption.pointerDown()
    } else {
      toggleOptionY()
      setCurrentOption();
    }
  }

  this.pointerUp = function () {
    if(currentOption.innerSelected){
      currentOption.pointerUp()
    } else {
      toggleOptionY()
      setCurrentOption();
    }
  }

  this.select = function () {
    if(!isFighting){
      currentOption.select() 
      if(open && currentOptionY == 0){ //currentOptionY == 0 means pointer is on attack
        isFighting = true
      } else if (open) {
        isUsingItem = true
        setTimeout(function(){
          isUsingItem = false;
        }, 2000)
      }
      open = !open;
    }
  }


  this.render = function () {
    enemyX = 400;
    enemyY = 90;
    heroX = 90;
    heroY = 90;

    renderBG()
    checkVictory()

    if(victory) {
      renderVictory()
    } else {
      currentOption.render()

      if(damageShow){
        renderVictimDamage()
      }

      if(heroTurn) {
        if(isFighting) {
          if (currentOption.action.getX() < 400){
            currentOption.action.moveRight()
            currentOption.action.render()
          } else {
            heroTurn = false
            var dmgHit = (3+Math.floor(Math.random()*7) + heroModifier)
            damageHit(dmgHit, "enemy")
            enemy.damage(dmgHit)
            currentOption.action.setX(90)
          }
        } else if (isUsingItem && blink) {
          currentOption.action.render()
        } else if(blink) { 
          ctx.drawImage(pointer, currentOption.pointerX, currentOption.pointerY);
        } 
      } else if(!damageShow) {
        if (enemyMouse.getX() > 100){
          enemyMouse.moveLeft()
          enemyMouse.render()
        } else {
          isFighting = false
          heroTurn = true
          var dmgHit = (3+Math.floor(Math.random()*7))
          damageHit(dmgHit, "hero")
          hero.damage(dmgHit)
          enemyMouse.setX(400)
        }
      }

      ctx.drawImage(hero.image, heroX, heroY);
      ctx.drawImage(enemy.image(), enemyX, enemyY);
    }
  }
}