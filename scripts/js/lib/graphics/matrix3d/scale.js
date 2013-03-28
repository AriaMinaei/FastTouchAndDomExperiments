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

    Scale.create = function() {
      return new this(1, 1, 1);
    };

    Scale.prototype.set = function(x, y, z) {
      this.x = parseFloat(x);
      this.y = parseFloat(y);
      return this.z = parseFloat(z);
    };

    Scale.prototype.add = function(x, y, z) {
      this.x += parseFloat(x);
      this.y += parseFloat(y);
      return this.z += parseFloat(z);
    };

    Scale.prototype.reset = function() {
      this.x = 1;
      this.y = 1;
      return this.z = 1;
    };

    Scale.prototype.getMatrix = function() {
      return [this.x, 0, 0, 0, 0, this.y, 0, 0, 0, 0, this.z, 0, 0, 0, 0, 1];
    };

    return Scale;

  })();
});

/*
//@ sourceMappingURL=scale.map
*/
