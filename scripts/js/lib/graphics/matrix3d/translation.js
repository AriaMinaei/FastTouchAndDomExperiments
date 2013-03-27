var define;

if (typeof define !== 'function') {
  define = require('amdefine')(module);
}

define(function() {
  var Translation;
  return Translation = (function() {

    function Translation(x, y, z) {
      this.set(x, y, z);
    }

    Translation.prototype.set = function(x, y, z) {
      this.x = parseFloat(x);
      this.y = parseFloat(y);
      return this.z = parseFloat(z);
    };

    Translation.prototype.getMatrix = function() {
      return [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, this.x, this.y, this.z, 1];
    };

    return Translation;

  })();
});
