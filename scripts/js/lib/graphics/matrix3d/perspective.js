var define;

if (typeof define !== 'function') {
  define = require('amdefine')(module);
}

define(function() {
  var Perspective;
  return Perspective = (function() {

    function Perspective(d) {
      this.set(d);
    }

    Perspective.prototype.set = function(d) {
      return this.d = parseFloat(d);
    };

    Perspective.prototype.getMatrix = function() {
      return [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, -1 / this.d, 0, 0, 0, 1];
    };

    return Perspective;

  })();
});
