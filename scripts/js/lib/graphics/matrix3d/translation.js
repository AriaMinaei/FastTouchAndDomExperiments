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

    Translation.create = function() {
      return new this(0, 0, 0);
    };

    Translation.prototype.set = function(x, y, z) {
      this.x = parseFloat(x);
      this.y = parseFloat(y);
      return this.z = parseFloat(z);
    };

    Translation.prototype.add = function(x, y, z) {
      this.x += parseFloat(x);
      this.y += parseFloat(y);
      return this.z += parseFloat(z);
    };

    Translation.prototype.reset = function() {
      this.x = 0;
      this.y = 0;
      return this.z = 0;
    };

    Translation.prototype.getMatrix = function() {
      return [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, this.x, this.y, this.z, 1];
    };

    return Translation;

  })();
});
