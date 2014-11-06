var Hero = function () {
  var ready = false;
  var image = new Image();
  image.onload = function () {
    ready = true;
  };
  image.src = "assets/hero.png";
  return {
    image: function () {
      return image;
    }
  };
}();