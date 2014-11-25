var ready = function() {
  // Create the canvas

  Map.initCanvas()
  Map.resetHero()

  // The main game loop
  var main = function () {
    if(Map.fight()){
      Map.fightScene().render()
    } else {
      var now = Date.now();
      var delta = now - then;
      Interface.moveHero(delta / 1000);
      Interface.checkCaught()
      Interface.checkThroughDoor()
      Map.render();
      then = now;
    }
    
    // Request to do this again ASAP
    requestAnimationFrame(main);
  };

  // Cross-browser support for requestAnimationFrame
  var w = window;
  requestAnimationFrame = w.requestAnimationFrame || w.webkitRequestAnimationFrame || w.msRequestAnimationFrame || w.mozRequestAnimationFrame;

  // Let's play this game!
  var then = Date.now();
  main();
}


$(document).ready(ready);
$(document).on('page:load', ready);
