var define;

if (typeof define !== 'function') {
  define = require('amdefine')(module);
}

define(function() {
  var Rotation;

  return Rotation = (function() {
    function Rotation(x, y, z) {
      this.set(x, y, z);
    }

    Rotation.create = function() {
      return new this(0, 0, 0);
    };

    Rotation.prototype.set = function(x, y, z) {
      this.x = parseFloat(x);
      this.y = parseFloat(y);
      return this.z = parseFloat(z);
    };

    Rotation.prototype.add = function(x, y, z) {
      this.x += parseFloat(x);
      this.y += parseFloat(y);
      return this.z += parseFloat(z);
    };

    Rotation.prototype.reset = function() {
      this.x = 0;
      this.y = 0;
      return this.z = 0;
    };

    Rotation.prototype.getMatrix = function() {
      var cosx, cosy, cosz, sinx, siny, sinz;

      cosx = Math.cos(this.x);
      sinx = Math.sin(this.x);
      cosy = Math.cos(this.y);
      siny = Math.sin(this.y);
      cosz = Math.cos(this.z);
      sinz = Math.sin(this.z);
      return [cosy * cosz, cosx * sinz + sinx * siny * cosz, sinx * sinz - cosx * siny * cosz, 0, -cosy * sinz, cosx * cosz - sinx * siny * sinz, sinx * cosz + cosx * siny * sinz, 0, siny, -sinx * cosy, cosx * cosy, 0, 0, 0, 0, 1];
    };

    return Rotation;

  })();
});
