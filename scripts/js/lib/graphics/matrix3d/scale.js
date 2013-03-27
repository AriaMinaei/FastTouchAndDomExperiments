var define;

if (typeof define !== 'function') {
  define = require('amdefine')(module);
}

define(function() {
  var Scale;
  return Scale = (function() {

    function Scale(x, y, z) {
      this.set(x, y, z);
    }

    Scale.prototype.set = function(x, y, z) {
      this.x = parseFloat(x);
      this.y = parseFloat(y);
      return this.z = parseFloat(z);
    };

    Scale.prototype.getMatrix = function() {
      return [this.x, 0, 0, 0, 0, this.y, 0, 0, 0, 0, this.z, 0, 0, 0, 0, 1];
    };

    return Scale;

  })();
});
