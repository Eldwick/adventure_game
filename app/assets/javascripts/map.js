var TileFactory = function(url, doors_params, num_enemies) {
  var i, x, y, side
      doors = [];
  for (i = 0; i < doors_params.length; i++){
    params = doors_params[i];
    if (params.side === "top") {
      y = 0;
      x = (params.position * 32);
    } else if (params.side === "bottom") {
      y = (512-64);
      x = (params.position * 32);
    } else if (params.side === "left") {
      y = (params.position * 32);
      x = 0;
    } else if (params.side === "right") {
      y = (params.position * 32);
      x = (512-32);
    }
    door = {
      img: createImage("assets/door.png"),
      x:x,
      y:y,
      side:params.side
    }
    doors.push(door)
  }
  return {
    bg: createImage(url),
    doors: doors,
    num_enemies: num_enemies
  }
}

function createImage(url){
  new_image = new Image();
  new_image.src = url
  return new_image
}


var Map = function () {
  var grid = [
        [
          TileFactory("assets/background3.png", [{side:"right", position:3}], 3), 
          TileFactory("assets/background.png", [{side:"left", position:3}, {side:"top", position:7}, {side:"right", position:8}], 1),
          TileFactory("assets/background3.png", [{side:"left", position:8}], 4),
          0,
          0,
          0,
          TileFactory("assets/background3.png", [{side:"top", position:7}], 3)
        ],
        [
          0,
          TileFactory("assets/background2.png", [{side:"bottom", position:7}, {side:"right", position:4}], 2),
          TileFactory("assets/background.png", [{side:"left", position:4}, {side:"right", position:3}], 2),
          TileFactory("assets/background2.png", [{side:"left", position:8}, {side:"right", position:8}], 2),
          TileFactory("assets/background2.png", [{side:"left", position:8}, {side:"right", position:8}], 2),
          TileFactory("assets/background3.png", [{side:"left", position:8}, {side:"right", position:8}], 2),
          TileFactory("assets/background2.png", [{side:"bottom", position:7},{side:"left", position:8}], 2)
        ]
      ],
      gridIndexY = 0,
      gridIndexX = 1,
      ready = false,
      image = new Image(),
      canvas = document.createElement("canvas"),
      ctx = canvas.getContext("2d"),  
      currentTile = grid[gridIndexY][gridIndexX],
      enemies = [],
      fightScene,
      fight = false,
      hero = new Hero();

  image.onload = function () {
    ready = true;
  };
  image.src = grid[0][0].bg;


  function renderDoors() {
    for(doorIndex in currentTile["doors"]){
      door = currentTile["doors"][doorIndex]
      ctx.drawImage(door.img, door.x , door.y)
    }
  }
  function setCurrentTile() {
    currentTile = grid[gridIndexY][gridIndexX]
    createEnemies()
  }
  function createEnemies() {
    enemies = []
    for(var i = 0; i < currentTile.num_enemies; i++){
      enemy = new EnemyObj({
        name: "Goblin " + (i+1),
        img:"assets/monster.png",
        hp: 40,
        startX: 32 + (Math.random() * (canvas.width - 96)),
        startY: 32 + (Math.random() * (canvas.height - 96))
      })
      enemies.push(enemy)
    }
  }

  createEnemies()
  return {
    hero: function() {
      return hero
    },
    enemies: function() {
      return enemies
    },
    killEnemy: function(index) {
      enemies.splice(index, 1);
    },
    fightScene: function(){
      return fightScene
    },
    setFightScene: function(scene){
      fightScene = scene
    },
    ctx: function() {
      return ctx;
    },
    setFight: function(boolean) {
      fight = boolean
    },
    fight: function() {
      return fight
    },
    currentTile: function() {
      return currentTile
    },
    initCanvas: function() {
      canvas.width = 512;
      canvas.height = 480;
      $("#canvas").append(canvas)
    },
    canvas: function() {
      return canvas
    },
    ready: function() {
      return ready;
    },
    up: function() {
      gridIndexY++
      setCurrentTile()
    },
    down: function() {
      gridIndexY--
      setCurrentTile()
    },
    left: function() {
      gridIndexX--
      setCurrentTile()
    },
    right: function() {
      gridIndexX++
      setCurrentTile()
    },
    resetHero: function() {
      hero.setX(canvas.width / 2);
      hero.setY(canvas.width / 2);
    },
    render: function () {
      ctx.drawImage(currentTile.bg, 0, 0);
        
      for(var doorIndex = 0; doorIndex < currentTile.doors.length; doorIndex++){
        door = currentTile.doors[doorIndex]
        ctx.drawImage(door.img, door.x , door.y)
      }

      ctx.drawImage(hero.image, hero.x, hero.y);

      for (var i = 0; i < enemies.length; i++){
        enemies[i].render()
      }
    }
  };
}();
