var define;

if (typeof define !== 'function') {
  define = require('amdefine')(module);
}

define(function() {
  var Skew;
  return Skew = (function() {

    function Skew(x, y) {
      this.set(x, y);
    }

    Skew.prototype.set = function(x, y) {
      this.x = parseFloat(x);
      return this.y = parseFloat(y);
    };

    Skew.prototype.getMatrix = function() {
      return [1, Math.tan(this.y), 0, 0, Math.tan(this.x), 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
    };

    return Skew;

  })();
});
